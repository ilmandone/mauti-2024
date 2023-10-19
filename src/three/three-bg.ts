import * as THREE from 'three'
import debounce from 'lodash.debounce'
import type { IUniform } from 'three'
import { vertex } from '@/three/shader/vertex'
import { fragment } from '@/three/shader/fragment'

export class ThreeBackground {
    private _scene!: THREE.Scene
    private _camera!: THREE.PerspectiveCamera
    private _container!: HTMLElement
    private _renderer!: THREE.WebGLRenderer
    private _windowRatio!: number

    private readonly IMAGES: string[] = [
        'https://images.unsplash.com/photo-1652972756954-70d7d5ecc0e5',
        'https://images.unsplash.com/photo-1653045649098-4fa866974b43'
    ]

    private _textures!: THREE.Texture[]
    private _uniforms!: { [uniform: string]: IUniform }
    private _currentTexure: number = 0
    private _nextTexure: number = 1

    constructor(container: HTMLElement) {
        this._container = container
    }

    private async _loadTextures(): Promise<THREE.Texture[]> {
        const loader = new THREE.TextureLoader()
        return await Promise.all([
            loader.loadAsync(this.IMAGES[0]),
            loader.loadAsync(this.IMAGES[1]),
            loader.loadAsync(this.IMAGES[2])
        ])
    }

    private createMaterial(): { mat: THREE.ShaderMaterial; uniforms: { [uniform: string]: IUniform } } {
        const uniforms = {
            uTime: { value: 0.0 },
            uOffset: { value: 0.0 },
            uProgress: { value: 0.0 },
            uScreenRes: { value: new THREE.Vector2() },
            uCurrentImage: { value: this._textures[this._currentTexure] },
            uCurrentImageRes: { value: new THREE.Vector2() },
            uNextImage: { value: this._textures[this._nextTexure] },
            uNextImageRes: { value: new THREE.Vector2() }
        }
        const mat: THREE.ShaderMaterial = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: vertex,
            fragmentShader: fragment,
            transparent: true,
            depthTest: false,
            side: THREE.DoubleSide
        })

        return { mat, uniforms }
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
        // const m = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
        const { mat, uniforms } = this.createMaterial()
        this._uniforms = uniforms
        const plane = new THREE.Mesh(g, mat)
        _scene.add(plane)

        return { _camera, _renderer, _scene, _windowRatio }
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
        this._camera.fov = Math.atan(width / 2 / this._camera.position.z) * 2 * THREE.MathUtils.RAD2DEG

        this._uniforms.uScreenRes.value = new THREE.Vector2(width, height)
        this._uniforms.uCurrentImageRes.value = new THREE.Vector2(
            this._textures[this._currentTexure].image.width,
            this._textures[this._currentTexure].image.height
        )
        this._uniforms.uNextImageRes.value = new THREE.Vector2(
            this._textures[this._nextTexure].image.width,
            this._textures[this._nextTexure].image.height
        )
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
            this._textures = r
            Object.assign(this, this._init())
            this._container.appendChild(this._renderer.domElement)

            this._setViewPort()
            window.addEventListener('resize', this._resize.bind(this))

            this._start()
        })
    }

    public changeBg() {}

    //#endregion
}
