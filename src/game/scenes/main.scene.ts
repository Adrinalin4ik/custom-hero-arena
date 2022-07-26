import { Scene3D } from 'enable3d';
import EventEmitter from 'events';
import * as THREE from 'three';
import { MouseCameraExtension } from '../../cameras/mouse-camera';
import { ClickHelper, IntersectionEvent, MouseBtn } from '../../helpers/click-manager';
import { ObjectManager } from '../objects/object-manager';
import { Terrain } from '../terrain/terrain-manager';
import { Player } from '../units/player.object';
export class MainScene extends Scene3D {
  private mouseCamera: MouseCameraExtension;
  private clickHelper: ClickHelper;
  private player: Player;
  private terrain: Terrain = new Terrain();
  public objectManager: ObjectManager;
  public emitter = new EventEmitter();
  constructor() {
    super({
      key : 'MainScene'
    })
    // this.physics = new AmmoPhysics(this)

    this.objectManager = new ObjectManager(this);

    document.addEventListener('contextmenu', (e) => {e.stopPropagation(); e.preventDefault();})
  }

  async init() {
    this.renderer.setPixelRatio(1)
    this.renderer.setSize(window.innerWidth, window.innerHeight - 50);
    // this.camera = this.cameras.perspectiveCamera({
    //   fov: 60,
    //   aspect: window.innerWidth / window.innerHeight,
    //   near: 2,
    //   far: 1000,
    // });
    this.emitter.emit('init:completed');
  }

  async preload() {
    // preload your assets here
    // await this.objectManager.preload();
    await this.load.preload('sky-box', 'assets/models/dark-skybox/scene.gltf');
    await this.load.preload('sky-box-texture', 'assets/models/dark-skybox/textures/Material__25__background_JPG_002_emissive.jpeg');
    await this.terrain.preload(this);
    this.emitter.emit('preload:completed');
  }
  
  async create() {
    // const camera = this.camera as PerspectiveCamera;
    // set up scene (light, ground, grid, sky, orbitControls)
    // this.warpSpeed()
    // console.log(this)
    console.log('Everything is loaded');
    this.warpSpeed('camera', '-fog', 'sky', '-light', '-ground')

    this.mouseCamera = new MouseCameraExtension({
      camera: this.camera as THREE.PerspectiveCamera,
      enabled: false
    });
    
    const spot = this.lights.spotLight({ 
      color: '0xffffff', 
      angle: Math.PI / 2,
    })
    spot.position.set(100, 100, 0);
    const spotHelper = this.lights.helper.spotLightHelper(spot)

    // this.lights.ambientLight();
    // const directionalLight = this.lights.directionalLight({
    //   color: 0xffffff,
    //   intensity: 1,
    // });

    // this.lights.helper.directionalLightHelper(directionalLight)
    
    const skyboxTexture = await this.load.texture('sky-box-texture');
    this.scene.background = skyboxTexture;

    // const skybox = await this.load.gltf('sky-box');
    // this.scene.add(skybox.scene);


    this.terrain.create(this);
    this.scene.add(this.terrain);
      

    const fogColor = new THREE.Color(0xffffff);
    this.scene.background = fogColor; // Setting fogColor as the background color also
    this.scene.fog = new THREE.Fog(fogColor, 10, 300);

    // position camera
    this.camera.position.set(32, 80, 60);
    this.camera.lookAt(32, 0, 32);

    this.clickHelper = new ClickHelper({
      objects: [this.terrain],
      camera: this.camera as THREE.PerspectiveCamera,
      renderer: this.renderer,
    });

    this.scene.add(this.clickHelper.arrow);

    this.clickHelper.on('click', (event: IntersectionEvent) => {
      console.log('Clicked on point', event)
      if (event.type === MouseBtn.RIGHT) {
        this.player.moveTo(event.point);
      }
    });

    this.player = new Player();
    this.player.position.set(10, 1, 5);
    this.scene.add(this.player);
    // this.scene.position.set(32, 0, 32);
    // this.physics.add.existing(this.player, {
    //   collisionFlags: 0,
    // });

    // --------------------------------------------------
    // const tree2 = new ExtendedObject3D();
    // const tree2Fbx = await this.load.fbx('tree2');
    // tree2.add(tree2Fbx);
    // const tree2Texture = await this.load.texture('tree2-texture');
    // const tree2Material = new THREE.MeshStandardMaterial({map: tree2Texture});

    // tree2.traverse((child) => {
    //   if ( child.isMesh ) {
    //     child.material = tree2Material;
    //   }
    // })
    // tree2.scale.set(10, 10, 10);
    // this.scene.add(tree2);
    // tree2.position.set(10, 2, 10);

    // --------------------------------------------------
    // const tree3 = new ExtendedObject3D();
    // const tree3Fbx = await this.load.fbx('tree3');
    // tree3.add(tree3Fbx);
    // const tree3Texture = await this.load.texture('tree3-texture');
    // const tree3Normal = await this.load.texture('tree3-texture-normal');
    // const tree3Material = new THREE.MeshStandardMaterial({
    //   map: tree3Texture,
    //   normalMap: tree3Normal,
    // });

    // tree3.traverse((child) => {
    //   if ( child.isMesh ) {
    //     child.material = tree3Material;
    //   }
    // })
    // this.scene.add(tree3);
    // tree3.position.set(5, 3, 0);

    // --------------------------------------------------
    //   const tree4 = new ExtendedObject3D();
    //   const tree4Fbx = await this.load.fbx('tree4');
    //   tree4.add(tree4Fbx);
    //   const tree4Texture = await this.load.texture('tree4-texture');
    //   const tree4Material = new THREE.MeshStandardMaterial({
    //     map: tree4Texture,
    //   });

    //   tree4.traverse((child) => {
    //     if ( child.isMesh ) {
    //       child.material = tree4Material;
    //     }
    //   })
    //   tree4Fbx.scale.set(0.005, 0.005, 0.005);  
    //   this.scene.add(tree4);
    //   tree4.position.set(10, 1, 0);
    console.log('emitting')
    this.emitter.emit('create:completed');
  }

  preRender() {
    if (this.resizeRendererToDisplaySize()) {
      // const canvas = this.renderer.domElement;
      // this.camera = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }
    this.emitter.emit('preRender:completed');
  }
  
  postRender() {
    this.emitter.emit('postRender:completed');
  }
  

  update(timeFromStart: number, diff: number) {
    this.mouseCamera.updateCamera(diff);
    this.player.update(diff);
  }

  
  resizeRendererToDisplaySize() {
    const canvas = this.canvas;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      this.setSize(width, height - 50);
    }
    return needResize;
  }
}