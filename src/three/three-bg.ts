import * as THREE from 'three'
import debounce from 'lodash.debounce'

export class ThreeBackground {
    private _scene!: THREE.Scene
    private _camera!: THREE.PerspectiveCamera
    private _container!: HTMLElement
    private _renderer!: THREE.WebGLRenderer
    private _windowRatio!: number

    constructor(container: HTMLElement) {
        this._container = container
    }

    /**
     * Init THREE and scene elements
     * @private
     */
    private _init() {
        const planeSize = 1.55
        const cameraDist = 1

        const _windowRatio = window.innerWidth / window.innerHeight
        const _scene: THREE.Scene = new THREE.Scene()
        const _camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, this._windowRatio, 0.1, 1000)
        _camera.position.z = cameraDist

        const _renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
        _renderer.setSize(window.innerWidth, window.innerHeight)

        const g = new THREE.PlaneGeometry(planeSize, planeSize)
        const m = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
        const plane = new THREE.Mesh(g, m)
        _scene.add(plane)

        return { _camera, _renderer, _scene, _windowRatio }
    }

    /**
     * Update render and camera to match viewport
     * @private
     */
    private _setViewPort() {
        this._renderer.setSize(window.innerWidth, window.innerHeight)
        this._camera.aspect = window.innerWidth / window.innerHeight
        this._camera.fov = Math.atan(window.innerHeight / 2 / this._camera.position.z) * 2 * THREE.MathUtils.RAD2DEG
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
        Object.assign(this, this._init())
        this._container.appendChild(this._renderer.domElement)

        this._setViewPort()
        window.addEventListener('resize', this._resize.bind(this))

        this._start()
    }
    //#endregion
}
