import * as THREE from 'three';
import { Mesh, Vector3 } from 'three';
import { Entity } from "./entity.object";

export class Unit extends Entity {
  public movementFlags = {
    forward: false
  }
  public targetPoint: Vector3 = new Vector3();
  private arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1, 'red');
  constructor() {
    super();
    this.add(new Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshBasicMaterial({ color: 'red', wireframe: true })));
    this.add(this.arrow);
  }


  moveTo(point: THREE.Vector3) {
    console.log(this)
    this.targetPoint.copy(new THREE.Vector3(point.x, this.position.y, point.z));
    this.lookAt(this.targetPoint);
    this.movementFlags.forward = true;
    console.log('moveTo', this.targetPoint);
  }

  updateMovement(diff: number) {
    if (this.movementFlags.forward) {
      this.translateZ(0.01 * diff);
    }

    if (this.position.distanceTo(this.targetPoint) < 0.1) {
      this.movementFlags.forward = false;
    }
  }

  update(diff: number) {
    this.updateMovement(diff);
  }
}