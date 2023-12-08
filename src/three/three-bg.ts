import * as THREE from 'three'
import debounce from 'lodash.debounce'
import Anime from 'animejs/lib/anime.es.js'

export type ProgressCb = (v: number) => unknown

enum Theme {
    Light = 0,
    Dark = 1
}

export class ThreeBackground {
    private _scene!: THREE.Scene
    private _camera!: THREE.PerspectiveCamera
    private _container!: HTMLElement
    private _renderer!: THREE.WebGLRenderer
    private _mesh!: THREE.Mesh
    private _material!: THREE.MeshStandardMaterial

    private readonly _IMAGES: string[] = ['./img/bg-light.jpg', './img/bg-dark.jpg', './img/disp1.jpg']

    private _textures!: THREE.Texture[]

    private _animRotation!: Anime.AnimeInstance
    private readonly _state!: Theme

    private readonly _PROGRESS_CB!: ProgressCb

    constructor(container: HTMLElement, progressCb: ProgressCb, startState: Theme) {
        this._container = container
        this._PROGRESS_CB = progressCb
        this._state = startState
    }

    private _textureLoaded(index: number) {
        this._PROGRESS_CB(Math.round((index / this._IMAGES.length) * 100))
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
            this._PROGRESS_CB(100)
            return r
        })
    }

    private _change(v: Theme): void {
        this._material.map = this._textures[v]
        this._material.emissiveMap = this._textures[v]
        this._material.emissiveIntensity = v === 0 ? 1 : 0.15
    }

    /**
     * Init THREE and scene elements
     * @private
     */
    private _init() {
        const planeSize = 1
        const cameraDist = 5.6

        const _windowRatio = window.innerWidth / window.innerHeight
        const _scene: THREE.Scene = new THREE.Scene()
        const _camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(10, 1, 0.1, 1000)
        _camera.position.z = cameraDist

        const _renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
        _renderer.setSize(window.innerWidth, window.innerHeight)

        // const g = new THREE.PlaneGeometry(planeSize, planeSize)
        const g = new THREE.CylinderGeometry(planeSize / 2, planeSize / 2, 3, 32)

        const _material = new THREE.MeshStandardMaterial({
            map: this._textures[this._state],
            emissive: new THREE.Color(0xffffff),
            emissiveMap: this._textures[this._state],
            emissiveIntensity: this._state === 0 ? 1 : 0.2
        })

        const _mesh = new THREE.Mesh(g, _material)
        _mesh.rotation.set(0, 0, Math.PI / 2)
        _scene.add(_mesh)

        return { _camera, _renderer, _scene, _windowRatio, _mesh, _material }
    }

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

    /**
     * Start render loop
     * @private
     */
    private _start() {
        window.requestAnimationFrame(this._start.bind(this))
        this._renderer.render(this._scene, this._camera)
    }

    //#region Public

    public start() {
        this._loadTextures().then((r) => {
            // Store textures
            this._textures = r

            // Init scene and store references
            Object.assign(this, this._init())
            this._container.appendChild(this._renderer.domElement)

            this._setViewPort()
            window.addEventListener('resize', this._resize.bind(this))

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
