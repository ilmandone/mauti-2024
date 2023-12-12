import * as THREE from 'three'
import debounce from 'lodash.debounce'
import Anime from 'animejs/lib/anime.es.js'
import { vertex } from '@/three/shader-grid/vertex'
import { fragment } from '@/three/shader-grid/fragment'

export type ProgressCb = (v: number) => unknown

enum Theme {
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
}

interface IInitRTScene {
    _rtCamera: THREE.PerspectiveCamera
    _rtScene: THREE.Scene
    _rtMesh: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>
    _rtMaterial: THREE.MeshStandardMaterial
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

    // Render texture
    private _rtScene!: THREE.Scene
    private _rtCamera!: THREE.PerspectiveCamera
    private _renderTarget!: THREE.WebGLRenderTarget<THREE.Texture>
    private _rtMaterial!: THREE.MeshStandardMaterial
    private _rtMesh!: THREE.Mesh

    private readonly _IMAGES: string[] = ['./img/bg-light.jpg', './img/bg-dark.jpg', './img/disp1.jpg']
    private _textures!: THREE.Texture[]

    private readonly _state!: Theme

    // distortion
    private _randomGrid!: THREE.DataTexture
    private _material!: THREE.ShaderMaterial

    // interactions
    private readonly _progressCb!: ProgressCb
    private _animRotation!: Anime.AnimeInstance
    private _dotCoords: { x: number; y: number } = { x: 0, y: 0 }

    constructor(container: HTMLElement, progressCb: ProgressCb, startState: Theme) {
        this._container = container
        this._progressCb = progressCb
        this._state = startState
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
    private _createRandoGrid(): THREE.DataTexture {
        const GRID_SIZE = 40

        const width = GRID_SIZE
        const height = GRID_SIZE

        const size = width * height

        const data = new Float32Array(3 * size)

        for (let i = 0; i < size; i++) {
            const r = Math.random() * 255 - 125
            const r1 = Math.random() * 255 - 125
            const stride = i * 3

            data[stride] = r
            data[stride + 1] = r1
            data[stride + 2] = r
        }

        const randomTexture = new THREE.DataTexture(data, width, height, THREE.RGFormat, THREE.FloatType)
        randomTexture.magFilter = randomTexture.minFilter = THREE.NearestFilter

        return randomTexture
    }

    //#endregion

    private _change(v: Theme): void {
        this._rtMaterial.map = this._textures[v]
        this._rtMaterial.emissiveMap = this._textures[v]
        this._rtMaterial.emissiveIntensity = v === 0 ? 1 : 0.15
    }

    /**
     * Initializes the renderer and render target.
     * @private
     * @returns {IInit}
     */
    private _init(): IInit {
        const _renderTarget = new THREE.WebGLRenderTarget(
            ThreeBackground.RENDER_TARGET_WIDTH,
            ThreeBackground.RENDER_TARGET_HEIGHT
        )
        const _renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
        _renderer.setSize(window.innerWidth, window.innerHeight)

        return { _renderer, _renderTarget }
    }

    /**
     * Initializes the render target scene.
     * @private
     * @returns {IInitRTScene}
     */
    private _initRTScene(): IInitRTScene {
        const cylRadius = 1
        const cameraDist = 5.6

        const _rtScene: THREE.Scene = new THREE.Scene()
        _rtScene.background = new THREE.Color('red')
        const _rtCamera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(10, 1.8, 0.1, 1000)
        _rtCamera.position.z = cameraDist

        const g = new THREE.CylinderGeometry(cylRadius / 2, cylRadius / 2, 3, 32)

        const _rtMaterial = new THREE.MeshStandardMaterial({
            map: this._textures[this._state],
            emissive: new THREE.Color(0xffffff),
            emissiveMap: this._textures[this._state],
            emissiveIntensity: this._state === 0 ? 1 : 0.2
        })

        const _rtMesh = new THREE.Mesh(g, _rtMaterial)
        _rtMesh.rotation.set(0, 0, Math.PI / 2)
        _rtScene.add(_rtMesh)

        return { _rtCamera, _rtScene, _rtMesh, _rtMaterial }
    }

    /**
     * Initializes the main scene and camera.
     * @param {THREE.RenderTarget} renderTarget - The render target used for the material.
     * @return { IInitMainScene }
     */
    private _initMainScene(renderTarget: THREE.RenderTarget): IInitMainScene {
        const planeSize = 1.5
        const cameraDist = 1

        const _scene: THREE.Scene = new THREE.Scene()
        const _camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
            80,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        _camera.position.z = cameraDist

        const g = new THREE.PlaneGeometry(planeSize * 1.8, planeSize)

        const _randomGrid = this._createRandoGrid()
        const _material = new THREE.ShaderMaterial({
            /*extensions: {
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
                    value: _randomGrid
                }
            },
            vertexShader: vertex,
            fragmentShader: fragment
        })

        const _mesh = new THREE.Mesh(g, _material)
        _scene.add(_mesh)

        const light = new THREE.AmbientLight(0xffffff, 3)
        _scene.add(light)

        return { _scene, _camera, _randomGrid, _material }
    }

    //#region Resize

    /**
     * Update render and camera to match viewport
     * @private
     */
    private _setViewPort() {
        const width = window.innerWidth
        const height = window.innerHeight

        this._renderer.setSize(width, height)
        this._camera.aspect = width / height
        this._camera.updateProjectionMatrix()

        // Set uniform resolution
        const imageAspect = ThreeBackground.RENDER_TARGET_HEIGHT / ThreeBackground.RENDER_TARGET_WIDTH
        let a1
        let a2
        if (height / width > imageAspect) {
            a1 = (width / height) * imageAspect
            a2 = 1
        } else {
            a1 = 1
            a2 = height / width / imageAspect
        }

        this._material.uniforms.resolution.value.x = width
        this._material.uniforms.resolution.value.y = height
        this._material.uniforms.resolution.value.z = a1
        this._material.uniforms.resolution.value.w = a2
    }

    /**
     * Window resize
     * @private
     */
    private _resize = debounce(this._setViewPort, 50)

    //#endregion

    /**
     * Start render loop
     * @private
     */
    private _start() {
        window.requestAnimationFrame(this._start.bind(this))

        this._renderer.setRenderTarget(this._renderTarget)
        this._renderer.render(this._rtScene, this._rtCamera)

        this._renderer.setRenderTarget(null)
        this._renderer.render(this._scene, this._camera)
    }

    //#region Public

    public start() {
        this._loadTextures().then((r) => {
            // Store textures
            this._textures = r

            // Create common render and render target
            Object.assign(this, this._init())

            Object.assign(this, this._initRTScene())

            // Create the main scene
            Object.assign(this, this._initMainScene(this._renderTarget))

            this._setViewPort()
            window.addEventListener('resize', this._resize.bind(this))

            this._container.appendChild(this._renderer.domElement)

            // Start rendering loop
            this._start()
        })
    }

    public change(v: Theme) {
        this._change(v)
    }

    public pointerPosition(p: { x: number; y: number }) {
        // TODO: Convert pointer coords to shape coords
    }

    public scrollProgression(v: number) {
        this._animRotation = Anime({
            targets: this._rtMesh.rotation,
            x: v * (Math.PI * 2),
            duration: 600,
            easing: 'easeOutCirc'
        })
    }

    //#endregion
}
