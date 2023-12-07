import type { IUniform } from 'three'
import * as THREE from 'three'
import debounce from 'lodash.debounce'
import { vertex } from '@/three/shader/vertex'
import { fragment } from '@/three/shader/fragment'
import Anime from 'animejs/lib/anime.es.js'
import { h } from 'vue'

export type ProgressCb = (v: number) => unknown

export class ThreeBackground {
    private _scene!: THREE.Scene
    private _camera!: THREE.PerspectiveCamera
    private _container!: HTMLElement
    private _renderer!: THREE.WebGLRenderer
    private _mesh!: THREE.Mesh
    private _windowRatio!: number

    private readonly _IMAGES: string[] = ['./img/bg-light.jpg', './img/bg-dark.jpg', './img/disp1.jpg']

    private _textures!: THREE.Texture[]
    private _uniforms!: { [uniform: string]: IUniform }

    private _animation!: Anime.AnimeInstance
    private readonly _startProgress!: number

    private readonly _PROGRESS_CB!: ProgressCb

    constructor(container: HTMLElement, progressCb: ProgressCb, startProgress: number) {
        this._container = container
        this._PROGRESS_CB = progressCb
        this._startProgress = startProgress
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

    private _change(v: number): void {
        const targets = this._uniforms.progress
        this._animation = Anime({
            targets,
            value: v,
            duration: 1200,
            easing: 'easeOutSine',
            autoplay: false
        })

        this._animation.play()
    }

    /**
     * Init THREE and scene elements
     * @private
     */
    private _init() {
        const planeSize = 1.8
        const cameraDist = 3

        const _windowRatio = window.innerWidth / window.innerHeight
        const _scene: THREE.Scene = new THREE.Scene()
        const _camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(48, 1, 0.1, 1000)
        _camera.position.z = cameraDist

        const _renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
        _renderer.setSize(window.innerWidth, window.innerHeight)

        // const g = new THREE.PlaneGeometry(planeSize, planeSize)
        const g = new THREE.SphereGeometry(planeSize / 2, 32, 32)

        const mat = new THREE.MeshStandardMaterial({
            map: this._textures[0],
            emissive: new THREE.Color(0xffffff),
            emissiveMap: this._textures[0]
        })

        const _mesh = new THREE.Mesh(g, mat)
        _mesh.rotation.set(0, 0, Math.PI / 2)
        _scene.add(_mesh)

        return { _camera, _renderer, _scene, _windowRatio, _mesh }
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
        this._camera.fov = Math.atan(width / 2 / this._camera.position.z) * 2 * THREE.MathUtils.RAD2DEG
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

    public change(v: number) {
        this._change(v)
    }

    public scrollProgression(v: number) {
        this._mesh.rotation.x = v * (Math.PI * 2)
    }

    //#endregion
}
