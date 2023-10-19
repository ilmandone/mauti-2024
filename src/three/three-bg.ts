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

    constructor(container: HTMLElement) {
        this._container = container
    }

    private async _loadTextures(): Promise<THREE.Texture[]> {
        const loader = new THREE.TextureLoader()
        return await Promise.all([loader.loadAsync(this.IMAGES[0]), loader.loadAsync(this.IMAGES[1])])
    }

    private _updateUniformResolution(width: number, height: number): void {
        this._uniforms.resolution.value.x = width
        this._uniforms.resolution.value.y = height

        const asp = this._textures[0].image.height / this._textures[0].image.width
        let a1
        let a2
        if (height / width > asp) {
            a1 = (width / height) * asp
            a2 = 1
        } else {
            a1 = 1
            a2 = height / width / asp
        }

        this._uniforms.resolution.value.z = a1
        this._uniforms.resolution.value.w = a2
    }

    private createMaterial(): { mat: THREE.ShaderMaterial; uniforms: { [uniform: string]: IUniform } } {
        const uniforms = {
            time: { type: 'f', value: 0 },
            progress: { type: 'f', value: 0 },
            border: { type: 'f', value: 0 },
            intensity: { type: 'f', value: 0 },
            width: { value: 0.5, type: 'f', min: 0, max: 10 },
            scaleX: { value: 40, type: 'f', min: 0.1, max: 60 },
            scaleY: { value: 40, type: 'f', min: 0.1, max: 60 },
            transition: { type: 'f', value: 40 },
            swipe: { type: 'f', value: 0 },
            radius: { type: 'f', value: 0 },
            texture1: { type: 'f', value: this._textures[0] },
            texture2: { type: 'f', value: this._textures[1] },
            displacement: { type: 'f', value: new THREE.TextureLoader().load('./img/disp1.jpg') },
            resolution: { type: 'v4', value: new THREE.Vector4() }
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

        this._updateUniformResolution(width, height)
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

    public change(v: number) {
        this._uniforms.progress.value = v * 0.25
    }

    //#endregion
}
