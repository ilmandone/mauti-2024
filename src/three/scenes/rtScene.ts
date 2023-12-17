import * as THREE from 'three'
import type { Theme } from '@/three/three-bg'

interface IInitRTScene {
    _rtCamera: THREE.PerspectiveCamera
    _rtScene: THREE.Scene
    _rtMesh: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>
    _rtMaterial: THREE.MeshStandardMaterial
}

export class RenderTexture {
    static readonly RENDER_TARGET_HEIGHT = 576
    static readonly RENDER_TARGET_WIDTH = 1024

    private readonly _textures!: THREE.Texture[]
    private readonly _renderTarget!: THREE.WebGLRenderTarget<THREE.Texture>

    private _rtScene!: THREE.Scene
    private _rtCamera!: THREE.PerspectiveCamera
    private _rtMaterial!: THREE.MeshStandardMaterial
    private _rtMesh!: THREE.Mesh

    get target() {
        return this._renderTarget
    }

    get mesh() {
        return this._rtMesh
    }

    constructor(textures: THREE.Texture[], theme: Theme) {
        this._textures = textures
        this._renderTarget = new THREE.WebGLRenderTarget(
            RenderTexture.RENDER_TARGET_WIDTH,
            RenderTexture.RENDER_TARGET_HEIGHT
        )

        Object.assign(this, this.createScene(theme))
    }

    public createScene(theme: Theme): IInitRTScene {
        const cylRadius = 1
        const cameraDist = 5.8

        const _rtScene: THREE.Scene = new THREE.Scene()
        _rtScene.background = new THREE.Color('red')

        const _rtCamera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(10, 1.8, 0.1, 1000)
        _rtCamera.position.z = cameraDist

        const g = new THREE.CylinderGeometry(cylRadius / 2, cylRadius / 2, 3, 32)

        const _rtMaterial = new THREE.MeshStandardMaterial({
            map: this._textures[theme],
            emissive: new THREE.Color(0xffffff),
            emissiveMap: this._textures[theme],
            emissiveIntensity: theme === 0 ? 1 : 0.2
        })

        const _rtMesh = new THREE.Mesh(g, _rtMaterial)
        _rtMesh.rotation.set(0, 0, Math.PI / 2)
        _rtScene.add(_rtMesh)

        return { _rtCamera, _rtScene, _rtMesh, _rtMaterial }
    }

    public setTheme(v: Theme) {
        this._rtScene.background = new THREE.Color(v === 0 ? 'red' : 'blue')
        this._rtMaterial.map = this._textures[v]
        this._rtMaterial.emissiveMap = this._textures[v]
        this._rtMaterial.emissiveIntensity = v === 0 ? 1 : 0.15
    }

    public renderStep(renderer: THREE.WebGLRenderer) {
        renderer.setRenderTarget(this._renderTarget)
        renderer.render(this._rtScene, this._rtCamera)
    }
}
