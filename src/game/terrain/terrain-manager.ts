import { Scene3D } from "enable3d";
import { Group } from "three";
import { PreparationZone } from "./preparation-zone.terrain";

export class Terrain extends Group {
  public preparationZone: PreparationZone = new PreparationZone();
  public reflectOnClick = true;
  
  constructor() {
    super();

    this.add(this.preparationZone);
    console.log(this)
  }

  async preload(scene: Scene3D) {
    this.preparationZone.preload(scene);
  }

  async create(scene: Scene3D) {
    this.preparationZone.create(scene);
  }
}