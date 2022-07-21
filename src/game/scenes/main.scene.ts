import { ExtendedObject3D, Scene3D } from 'enable3d';
import * as THREE from 'three';
import { MouseCameraExtension } from '../../cameras/mouse-camera';
import { ClickHelper, IntersectionEvent, MouseBtn } from '../../helpers/click-manager';
import { Player } from '../objects/player.object';

export class MainScene extends Scene3D {
  private box: ExtendedObject3D;
  private mouseCamera: MouseCameraExtension;
  private clickHelper: ClickHelper;
  private player: Player;
  private ground: ExtendedObject3D;

  constructor() {
    super({
      key : 'MainScene'
    })
    // this.physics = new AmmoPhysics(this)

    document.addEventListener('contextmenu', (e) => {e.stopPropagation(); e.preventDefault();})
  }

  async init() {
    this.renderer.setPixelRatio(1)
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  async preload() {
    // preload your assets here
    this.load.preload('grass', '/assets/img/grass.jpg');
    
    this.load.preload('tree1', '/assets/models/tree1/source/treeanimated.fbx');
    this.load.preload('tree1-texture', '/assets/models/tree1/textures/treetexture.png');
    this.load.preload('tree1-texture-normal', '/assets/models/tree1/textures/treetexturenormal.png');

    this.load.preload('tree2', '/assets/models/tree2/source/PineTree_001.fbx');
    this.load.preload('tree2-texture', '/assets/models/tree2/textures/PineTree_001.png');

    this.load.preload('tree3', '/assets/models/tree3/source/Tree.fbx');
    this.load.preload('tree3-texture', '/assets/models/tree3/textures/Leaves.png');
    this.load.preload('tree3-texture-normal', '/assets/models/tree3/textures/Trunk.png');


    this.load.preload('tree4', '/assets/models/tree4/source/pine_tree_free.fbx');
    this.load.preload('tree4-texture', '/assets/models/tree4/textures/pine_tree_red_SC.tga.png');
  }

  async create() {
    // const camera = this.camera as PerspectiveCamera;
    // set up scene (light, ground, grid, sky, orbitControls)
    // this.warpSpeed()
    this.warpSpeed('camera', '-fog', '-sky', '-light', '-ground')

    this.mouseCamera = new MouseCameraExtension({
      camera: this.camera as THREE.PerspectiveCamera,
      enabled: false
    });
    
    this.lights.ambientLight();
    
    const grass = await this.load.texture('grass')
    grass.wrapS = grass.wrapT = 1000 // RepeatWrapping
    grass.offset.set(0, 0)
    grass.repeat.set(50, 50)
    this.ground = this.physics.add.ground({
      width: 50,
      height: 50,
      collisionFlags: 1,
      mass: 5000,
    }, { phong: { map: grass } })
    

    const fogColor = new THREE.Color(0xffffff);
    this.scene.background = fogColor; // Setting fogColor as the background color also
    this.scene.fog = new THREE.Fog(fogColor, 10, 300);

    // position camera
    this.camera.position.set(0, 19, 16);
    this.camera.lookAt(0, 0, 0);

    this.clickHelper = new ClickHelper({
      objects: [this.ground],
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
    this.player.position.set(0, 1.5, 0);
    this.scene.add(this.player);
    // this.physics.add.existing(this.player);


    // --------------------------------------------------
    const tree1 = new ExtendedObject3D();
    const tree1Fbx = await this.load.fbx('tree1');
    tree1.add(tree1Fbx);
    const tree1Texture = await this.load.texture('tree1-texture');
    const tree1Normal = await this.load.texture('tree1-texture-normal');
    const tree1Material = new THREE.MeshStandardMaterial({map: tree1Texture, normalMap: tree1Normal});

    tree1.traverse((child) => {
      if ( child.isMesh ) {
        child.material = tree1Material;
      }
    })

    this.scene.add(tree1);
    tree1.position.set(0, 0, 0);

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
    const tree3 = new ExtendedObject3D();
    const tree3Fbx = await this.load.fbx('tree3');
    tree3.add(tree3Fbx);
    const tree3Texture = await this.load.texture('tree3-texture');
    const tree3Normal = await this.load.texture('tree3-texture-normal');
    const tree3Material = new THREE.MeshStandardMaterial({
      map: tree3Texture,
      normalMap: tree3Normal,
    });

    tree3.traverse((child) => {
      if ( child.isMesh ) {
        child.material = tree3Material;
      }
    })
    this.scene.add(tree3);
    tree3.position.set(5, 3, 0);

    // --------------------------------------------------
    const tree4 = new ExtendedObject3D();
    const tree4Fbx = await this.load.fbx('tree4');
    tree4.add(tree4Fbx);
    const tree4Texture = await this.load.texture('tree4-texture');
    const tree4Material = new THREE.MeshStandardMaterial({
      map: tree4Texture,
    });

    tree4.traverse((child) => {
      if ( child.isMesh ) {
        child.material = tree4Material;
      }
    })
    tree4Fbx.scale.set(0.005, 0.005, 0.005);  
    this.scene.add(tree4);
    tree4.position.set(10, 1, 0);
  }

  

  update(timeFromStart: number, diff: number) {
    // this.box.rotation.x += 0.01 * diff
    // this.box.rotation.y += 0.01 * diff
    // console.log(this.camera)
    // console.log('update', diff, arg, test)
    this.mouseCamera.updateCamera(diff);
    this.player.update(diff);
  }

}