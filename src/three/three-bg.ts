import * as THREE from 'three'

export class ThreeBackground {
    private _scene!: THREE.Scene
    private _camera!: THREE.PerspectiveCamera
    private _container!: HTMLElement
    private _renderer!: THREE.WebGLRenderer
    private _windowRatio!: number

    constructor(container: HTMLElement) {
        this._container = container
    }

    private _init() {
        this._windowRatio = window.innerWidth / window.innerHeight
        this._scene = new THREE.Scene()
        this._camera = new THREE.PerspectiveCamera(75, this._windowRatio, 0.1, 1000)

        const rend: THREE.WebGLRenderer = new THREE.WebGLRenderer()
        rend.setSize(window.innerWidth, window.innerHeight)
        this._container.appendChild(rend.domElement)

        this._renderer = rend
    }

    private _start() {
        window.requestAnimationFrame(this._start.bind(this))
        this._renderer.render(this._scene, this._camera)
    }

    //#region Public

    public start() {
        this._init()
        this._start()
    }

    //#endregion
}
