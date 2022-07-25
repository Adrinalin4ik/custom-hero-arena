import { Scene3D } from "enable3d";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { CustomObject3D } from "../../extensions/object3d";

export class PreparationZone extends THREE.Group {
  private ground: CustomObject3D;
  
  async preload(scene: Scene3D) {
    // scene.load.preload('grass', '/assets/img/grass.jpg');
    // scene.load.preload('castle', 'assets/models/gltf/scene.gltf');
    scene.load.preload('test', 'assets/models/main.glb');
  }

  async create(scene: Scene3D) {
    // const grass = await scene.load.texture('grass')
    // grass.wrapS = grass.wrapT = 1000 // RepeatWrapping
    // grass.offset.set(0, 0)
    // grass.repeat.set(32, 32)
    // this.ground = new CustomObject3D();
    // const geometry = new THREE.BoxGeometry(64, 5, 64)
    // const material = new THREE.MeshPhongMaterial({ map: grass })
    // const mesh = new THREE.Mesh(geometry, material);
    // this.ground.position.set(32, -2, 32)
    // this.ground.add(mesh);

    // this.ground.reflectOnClick = true; 
    // this.add(this.ground);
    // scene.physics.add.existing(this.ground, {mass: 0});



    // -------------------------------------------------
    // Object

    // const obj = await scene.load.gltf('castle');
    // this.add(obj.scene);
    const loader = new GLTFLoader();
    const obj = await loader.load('assets/models/main.glb', (obj) => {
      // const mixer = scene.animationMixers.create(obj.scene);
      console.log(obj)
      // mixer.clipAction(obj.animations[0]).play();

      
      this.add(obj.scene);
    });
  }
}