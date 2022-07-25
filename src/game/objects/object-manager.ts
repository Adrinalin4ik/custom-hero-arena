import { ExtendedObject3D, Scene3D } from 'enable3d';
import * as THREE from 'three';
import { Group } from 'three';
import { WorldObjects } from './world-objects';
export class ObjectManager {
  private readonly scene: Scene3D;
  // private objects: {[name: string]: THREE.Group} = {};
  constructor(scene: Scene3D) {
    this.scene = scene;
  }
  async preload() {
    // preload your assets here
    for (const object of WorldObjects) {
      const fbxUrl = `${object.path}/${object.fbx}`;
      await this.scene.load.preload(`${object.name}.fbx`, fbxUrl);
      if (object.textureMap) {
        const textureMapUrl = `${object.path}/${object.textureMap}`;
        await this.scene.load.preload(`${object.name}.texture-map`, textureMapUrl);
      }
      if (object.normalMap) {
        const normalMapUrl = `${object.path}/${object.normalMap}`;
        await this.scene.load.preload(`${object.name}.normal-map`, normalMapUrl);
      }
      if (object.transparencyMap) {
        const map = `${object.path}/${object.transparencyMap}`;
        await this.scene.load.preload(`${object.name}.transparency-map`, map);
      }
      if (object.aoMap) {
        const map = `${object.path}/${object.aoMap}`;
        await this.scene.load.preload(`${object.name}.ao-map`, map);
      }
    }
  }


  static async createObject(
    name: string, 
    scene: Scene3D, 
    options?: {
      position?: THREE.Vector3,
    }) {
    const objectInfo = WorldObjects.find(o => o.name === name);
    if (!objectInfo) {
      throw new Error(`Object ${name} not found`);
    }
    
    const object = new ExtendedObject3D();
    object.name = `${name}-${Math.round(Math.random() * 1e6)}`;
    
    const objectFbx = await scene.load.fbx(`${name}.fbx`);
    object.add(objectFbx);
    
    const objectMaterial = new THREE.MeshStandardMaterial();
    
    if (objectInfo.textureMap) {
      const objectTexture = await scene.load.texture(`${name}.texture-map`);
      objectMaterial.map = objectTexture;
    }
    if (objectInfo.normalMap) {
      const objectNormal = await scene.load.texture(`${name}.normal-map`);
      objectMaterial.normalMap = objectNormal;
    }

    if (objectInfo.transparencyMap) {
      const map = await scene.load.texture(`${name}.transparency-map`);
      objectMaterial.alphaMap = map;
    }
    if (objectInfo.aoMap) {
      const map = await scene.load.texture(`${name}.ao-map`);
      objectMaterial.aoMap = map;
    }
    
    if (objectInfo.scale) {
      object.scale.set(objectInfo.scale.x, objectInfo.scale.y, objectInfo.scale.z);
    }
    
    object.traverse((child) => {
      if (child.isMesh) {
        child.material = objectMaterial;
      }
    });
    
    if (options?.position) {
      object.position.copy(options.position);
    }
    
    return object;
  }

  static async buildComposition(config: { 
    name: string,
    matrix: string[][],
    aliases: {[name: string]: string},
    scene: Scene3D,
    scale?: THREE.Vector3,
  }) {
    const scale = config.scale || new THREE.Vector3(1, 1, 1);
    const composition = new Group();
    composition.name = config.name;
    const matrix = config.matrix;
    for (let i = 0; i < matrix.length; i++) {
      const row = matrix[i];
      for (let j = 0; j < row.length; j++) {
        const objectName = config.aliases[row[j]];
        if (objectName) {
          const object = await ObjectManager.createObject(objectName, config.scene, {
            position: new THREE.Vector3(
              j * scale.z,
              0, 
              i * scale.x
            ),
          });
  
          composition.add(object);
        }
      }
    }
    return composition;
  }
}