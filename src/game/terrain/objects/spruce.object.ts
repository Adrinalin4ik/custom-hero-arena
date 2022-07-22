import { ExtendedObject3D } from "enable3d";

export class Spruce extends ExtendedObject3D {
  
  // async preload(scene: Scene3D) {
  //   scene.load.preload('tree1', '/assets/models/tree1/source/treeanimated.fbx');
  //   scene.load.preload('tree1-texture', '/assets/models/tree1/textures/treetexture.png');
  //   scene.load.preload('tree1-texture-normal', '/assets/models/tree1/textures/treetexturenormal.png');
  // }

  // async create(scene: Scene3D) {
  //   const object = new ExtendedObject3D();
  //   const objectFbx = await scene.load.fbx('tree1');
  //   object.add(objectFbx);
  //   const objectTexture = await scene.load.texture('tree1-texture');
  //   const objectNormal = await scene.load.texture('tree1-texture-normal');
  //   const objectMaterial = new THREE.MeshStandardMaterial({
  //     map: objectTexture, 
  //     normalMap: objectNormal
  //   });

  //   object.traverse((child) => {
  //     if ( child.isMesh ) {
  //       child.material = objectMaterial;
  //     }
  //   })

  //   this.add(object);
  // }
}