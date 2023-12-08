import * as THREE from 'three'
import debounce from 'lodash.debounce'
import Anime from 'animejs/lib/anime.es.js'

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
}

interface IInitRTScene {
    _rtCamera: THREE.PerspectiveCamera
    _rtScene: THREE.Scene
    _mesh: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>
    _material: THREE.MeshStandardMaterial
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

    private _rtScene!: THREE.Scene
    private _rtCamera!: THREE.PerspectiveCamera
    private _renderTarget!: THREE.WebGLRenderTarget<THREE.Texture>

    private _mesh!: THREE.Mesh
    private _material!: THREE.MeshStandardMaterial

    private readonly _IMAGES: string[] = ['./img/bg-light.jpg', './img/bg-dark.jpg', './img/disp1.jpg']

    private _textures!: THREE.Texture[]

    private _animRotation!: Anime.AnimeInstance
    private readonly _state!: Theme

    private readonly _progressCb!: ProgressCb

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

    private _change(v: Theme): void {
        this._material.map = this._textures[v]
        this._material.emissiveMap = this._textures[v]
        this._material.emissiveIntensity = v === 0 ? 1 : 0.15
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

        const _material = new THREE.MeshStandardMaterial({
            map: this._textures[this._state],
            emissive: new THREE.Color(0xffffff),
            emissiveMap: this._textures[this._state],
            emissiveIntensity: this._state === 0 ? 1 : 0.2
        })

        const _mesh = new THREE.Mesh(g, _material)
        _mesh.rotation.set(0, 0, Math.PI / 2)
        _rtScene.add(_mesh)

        return { _rtCamera, _rtScene, _mesh, _material }
    }

    /**
     * Initializes the main scene and camera.
     * @param {THREE.RenderTarget} renderTarget - The render target used for the material.
     * @return { IInitMainScene }
     */
    private _initMainScene(renderTarget: THREE.RenderTarget): IInitMainScene {
        console.log(renderTarget)
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
        const m = new THREE.MeshStandardMaterial({
            map: renderTarget.texture,
            emissiveMap: renderTarget.texture
            // emissive: 0xffffff
        })

        const _mesh = new THREE.Mesh(g, m)
        _scene.add(_mesh)

        const light = new THREE.AmbientLight(0xffffff, 3)
        _scene.add(light)

        return { _scene, _camera }
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

    public scrollProgression(v: number) {
        this._animRotation = Anime({
            targets: this._mesh.rotation,
            x: v * (Math.PI * 2),
            duration: 600,
            easing: 'easeOutCirc'
        })
    }

    //#endregion
}
