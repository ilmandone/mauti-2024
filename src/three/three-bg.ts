import * as THREE from 'three'
import debounce from 'lodash.debounce'
import Anime from 'animejs/lib/anime.es.js'
import { vertex } from '@/three/shader-grid/vertex'
import { fragment } from '@/three/shader-grid/fragment'
import { RenderTexture } from '@/three/scenes/rtScene'

export type ProgressCb = (v: number) => unknown

export enum Theme {
    Light = 0,
    Dark = 1
}

interface IInit {
    _renderer: THREE.WebGLRenderer
    _renderTarget: THREE.WebGLRenderTarget<THREE.Texture>
}

interface IInitMainScene {
    _scene: THREE.Scene
    _camera: THREE.PerspectiveCamera
    _randomGrid: THREE.DataTexture
    _material: THREE.ShaderMaterial
    _mesh: THREE.Mesh
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
    private _randomGrid!: THREE.DataTexture
    private _material!: THREE.ShaderMaterial
    private _mesh!: THREE.Mesh

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

    /**
     * Creates a random grid texture.
     *
     * @private
     * @returns {THREE.DataTexture} The generated random grid texture.
     */
    private _createRandomGrid(aspect: number): THREE.DataTexture {
        const GRID_SIZE = 20

        const width = Math.round(GRID_SIZE * aspect)
        const height = GRID_SIZE

        const size = width * height
        const data = new Float32Array(2 * size)

        for (let i = 0; i < size; i++) {
            let r = Math.random() * 255 - 125
            let g = Math.random() * 255 - 125

            const stride = i * 4

            data[stride] = r
            data[stride + 1] = g
            data[stride + 2] = r
            data[stride + 3] = 1
        }

        const randomTexture = new THREE.DataTexture(data, width, height, THREE.RGFormat, THREE.FloatType)
        randomTexture.magFilter = randomTexture.minFilter = THREE.NearestFilter
        // randomTexture.needsUpdate = true
        return randomTexture
    }

    //#endregion

    private _setTheme(v: Theme): void {
        this._renderTexture.setTheme(v)
    }

    /**
     * Initializes the renderer and render target.
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

        const _randomGrid = this._createRandomGrid(aspect)
        const _material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: '#extension GL_OES_standard_derivatives : enable'
            },
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
                    value: _randomGrid
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

        return { _scene, _camera, _randomGrid, _material, _mesh }
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

        // Render step for render texture scene
        this._renderTexture.renderStep(this._renderer)

        // Main render step
        this._renderer.setRenderTarget(null)
        this._renderer.render(this._scene, this._camera)
    }

    //#region Public

    public start() {
        this._loadTextures().then((r) => {
            this._renderTexture = new RenderTexture(r, this._startingTheme) // Create render texture instance
            Object.assign(this, this._init()) // Create the main renderer
            Object.assign(this, this._initMainScene(this._renderTexture.target)) // Create the main scene

            this._resizeUpdate()
            window.addEventListener('resize', this._resize.bind(this))

            this._container.appendChild(this._renderer.domElement)

            this._renderStep() // Start rendering loop
        })
    }

    public change(v: Theme) {
        this._setTheme(v)
    }

    public pointerPosition(p: { x: number; y: number }) {
        // TODO: Convert pointer coords to shape coords
        console.log(p)
    }

    public scrollProgression(v: number) {
        Anime({
            targets: this._renderTexture.mesh.rotation,
            x: v * (Math.PI * 2),
            duration: 600,
            easing: 'easeOutCirc'
        })
    }

    //#endregion
}
