import * as THREE from 'three'
import debounce from 'lodash.debounce'
import { vertex } from '@/three/shader-grid/vertex'
import { fragment } from '@/three/shader-grid/fragment'
import { RenderTexture } from '@/three/scenes/rtScene'

export type ProgressCb = (v: number) => unknown

export enum Theme {
    Light = 0,
    Dark = 1
}

interface IInitMainScene {
    _scene: THREE.Scene
    _camera: THREE.PerspectiveCamera
    _randomGridTexture: THREE.DataTexture
    _material: THREE.ShaderMaterial
    _mesh: THREE.Mesh
}

interface ICoords {
    x: number
    y: number
}

interface IMouse {
    cur: ICoords
    vel: ICoords
}

export class ThreeBackground {
    // Main scene
    private _scene!: THREE.Scene
    private _camera!: THREE.PerspectiveCamera
    private _container!: HTMLElement
    private _renderer!: THREE.WebGLRenderer

    // Render target
    static readonly RENDER_TARGET_HEIGHT = 576
    static readonly RENDER_TARGET_WIDTH = 1024

    private readonly _IMAGES: string[] = ['./img/bg-light.jpg', './img/bg-dark.jpg', './img/disp1.jpg']
    private readonly _startingTheme!: Theme

    // Render texture class
    private _renderTexture!: RenderTexture

    // distortion

    static readonly DISTORTION_STRENGTH = 0.2
    static readonly DISTORTION_INFLUENCE = 0.2
    static readonly DISTORTION_GRID_SIZE = 128
    static readonly DISTORTION_RELAXATION = 0.9

    private _randomGridTexture!: THREE.DataTexture
    private _material!: THREE.ShaderMaterial
    private _mesh!: THREE.Mesh
    private _mouse: IMouse = {
        cur: { x: 0, y: 0 },
        vel: { x: 0, y: 0 }
    }

    // interactions
    private readonly _progressCb!: ProgressCb
    private _dotCoords: { x: number; y: number } = { x: 0, y: 0 }

    constructor(container: HTMLElement, progressCb: ProgressCb, startState: Theme) {
        this._container = container
        this._progressCb = progressCb
        this._startingTheme = startState
    }

    //#region Textures

    private _textureLoaded(index: number) {
        this._progressCb(Math.round((index / this._IMAGES.length) * 100))
    }

    private async _loadTextures(): Promise<THREE.Texture[]> {
        const loader = new THREE.TextureLoader()
        const promises: Promise<THREE.Texture>[] = []
        this._IMAGES.forEach((i, index) => {
            promises.push(
                loader.loadAsync(i).then((r) => {
                    this._textureLoaded(index)
                    return r
                })
            )
        })
        return await Promise.all(promises).then((r) => {
            this._progressCb(100)
            return r
        })
    }

    //#endregion

    //#region Distortion

    private _updateDistortionTexture() {
        const randomGridData = this._randomGridTexture.image.data

        // Decrease cell value to reduce distortion
        for (let i = 0; i < randomGridData.length; i += 4) {
            randomGridData[i] *= ThreeBackground.DISTORTION_RELAXATION
            randomGridData[i + 1] *= ThreeBackground.DISTORTION_RELAXATION
        }

        // Convert mouse coords to grid texture coords
        const gridMouseX = this._mouse.cur.x * ThreeBackground.DISTORTION_GRID_SIZE
        const gridMouseY = (1 - this._mouse.cur.y) * ThreeBackground.DISTORTION_GRID_SIZE
        const maxDist = ThreeBackground.DISTORTION_GRID_SIZE * ThreeBackground.DISTORTION_INFLUENCE

        // For each grid distortion increase the value based on the mouse velocity
        for (let i = 0; i < ThreeBackground.DISTORTION_GRID_SIZE; i++) {
            for (let j = 0; j < ThreeBackground.DISTORTION_GRID_SIZE; j++) {
                const dist = Math.sqrt((gridMouseX - i) ** 2 + (gridMouseY - j) ** 2)

                if (dist < maxDist) {
                    const dataIndex = 4 * (i + ThreeBackground.DISTORTION_GRID_SIZE * j)

                    let power = maxDist / dist
                    power = Math.max(0, Math.min(power, 20))

                    randomGridData[dataIndex] += 100 * this._mouse.vel.x * power * ThreeBackground.DISTORTION_STRENGTH
                    randomGridData[dataIndex + 1] -=
                        100 * this._mouse.vel.y * power * ThreeBackground.DISTORTION_STRENGTH
                }
            }
        }

        // Decrease the mouse velocity
        this._mouse.vel.x *= ThreeBackground.DISTORTION_RELAXATION
        this._mouse.vel.y *= ThreeBackground.DISTORTION_RELAXATION

        this._randomGridTexture.needsUpdate = true
        this._material.uniforms.uDataTexture.value = this._randomGridTexture
    }

    /**
     * Creates a random grid texture.
     *
     * @private
     * @returns {THREE.DataTexture} The generated random grid texture.
     */
    private _createRandomGrid(aspect: number): THREE.DataTexture {
        const width = ThreeBackground.DISTORTION_GRID_SIZE
        const height = ThreeBackground.DISTORTION_GRID_SIZE

        const size = width * height
        const data = new Float32Array(4 * size)

        for (let i = 0; i < size; i += 1) {
            const r = Math.random() * 10
            const g = Math.random() * 10

            const idOffseted = i * 4

            data[idOffseted] = r
            data[idOffseted + 1] = g
            data[idOffseted + 2] = r
            data[idOffseted + 3] = 1
        }

        const randomTexture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.FloatType)
        randomTexture.magFilter = randomTexture.minFilter = THREE.NearestFilter
        randomTexture.needsUpdate = true
        return randomTexture
    }

    //#endregion

    /**
     * Initializes the renderer.
     * @private
     * @returns {IInit}
     */
    private _init(): { _renderer: THREE.WebGLRenderer } {
        const _renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
        _renderer.setSize(window.innerWidth, window.innerHeight)
        return { _renderer }
    }

    /**
     * Initializes the main scene and camera.
     * @param {THREE.RenderTarget} renderTarget - The render target used for the material.
     * @return { IInitMainScene }
     */
    private _initMainScene(renderTarget: THREE.RenderTarget): IInitMainScene {
        const planeSize = 1
        const cameraDist = 0.58

        const aspect = window.innerWidth / window.innerHeight

        const _scene: THREE.Scene = new THREE.Scene()
        const _camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(80, aspect, 0.1, 1000)
        _camera.position.z = cameraDist

        const g = new THREE.PlaneGeometry(planeSize, planeSize)

        const _randomGridTexture = this._createRandomGrid(aspect)
        const _material = new THREE.ShaderMaterial({
            /* extensions: {
          derivatives: '#extension GL_OES_standard_derivatives : enable'
      },*/
            side: THREE.DoubleSide,
            uniforms: {
                time: {
                    value: 0
                },
                resolution: {
                    value: new THREE.Vector4()
                },
                uTexture: {
                    value: renderTarget.texture
                },
                uDataTexture: {
                    value: _randomGridTexture
                }
            },
            vertexShader: vertex,
            fragmentShader: fragment
        })

        const _mesh = new THREE.Mesh(g, _material)
        _mesh.scale.set(aspect, 1, 1)
        _scene.add(_mesh)

        const light = new THREE.AmbientLight(0xffffff, 3)
        _scene.add(light)

        return { _scene, _camera, _randomGridTexture, _material, _mesh }
    }

    //#region Resize

    /**
     * Update render and camera to match viewport
     * @private
     */
    private _resizeUpdate() {
        const width = window.innerWidth
        const height = window.innerHeight
        const aspect = width / height

        this._mesh.scale.set(aspect, 1, 1)

        this._renderer.setSize(width, height)
        this._camera.aspect = aspect
        this._camera.updateProjectionMatrix()

        // Set uniform resolution
        const imageAspect = ThreeBackground.RENDER_TARGET_HEIGHT / ThreeBackground.RENDER_TARGET_WIDTH
        let a1
        let a2
        if (height / width > imageAspect) {
            a1 = aspect * imageAspect
            a2 = 1
        } else {
            a1 = 1
            a2 = height / width / imageAspect
        }

        // Update the shader material
        this._material.uniforms.resolution.value.x = width
        this._material.uniforms.resolution.value.y = height
        this._material.uniforms.resolution.value.z = a1
        this._material.uniforms.resolution.value.w = a2

        this._material.uniforms.uDataTexture.value = this._createRandomGrid(aspect)
    }

    /**
     * Window resize
     * @private
     */
    private _resize = debounce(this._resizeUpdate, 50)

    //#endregion

    /**
     * Start render loop
     * @private
     */
    private _renderStep() {
        window.requestAnimationFrame(this._renderStep.bind(this))

        // Render texture scene
        this._renderTexture.renderStep(this._renderer)

        // Update distortion
        this._updateDistortionTexture()

        // Main render step
        this._renderer.setRenderTarget(null)
        this._renderer.render(this._scene, this._camera)
    }

    //#region Public

    /**
     * Load textures and start the background
     */
    public start() {
        this._loadTextures().then((r) => {
            // Create render texture instance
            this._renderTexture = new RenderTexture(r, this._startingTheme)

            // Create the main renderer
            Object.assign(this, this._init())

            // Create the main scene
            Object.assign(this, this._initMainScene(this._renderTexture.target))

            this._resizeUpdate()
            window.addEventListener('resize', this._resize.bind(this))

            this._container.appendChild(this._renderer.domElement)

            // Start rendering loop
            this._renderStep()
        })
    }

    /**
     * Change theme
     * @param {Theme} v
     */
    public change(v: Theme) {
        this._renderTexture.setTheme(v)
    }

    /**
     * Pointer position update for distortion effect
     * @param {{ x: number; y: number }} p
     */
    public pointerPosition(p: { x: number; y: number }) {
        const x = p.x / window.innerWidth
        const y = p.y / window.innerHeight
        this._mouse.vel = { x: x - this._mouse.cur.x, y: y - this._mouse.cur.y }
        this._mouse.cur = { x, y }
    }

    /**
     * Scroll progression update for cylinder animation
     * @param v
     */
    public scrollProgression(v: number) {
        this._renderTexture.rotateCylinder(v)
    }

    //#endregion
}
