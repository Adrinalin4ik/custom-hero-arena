import { ExtendedObject3D } from "enable3d";
import { EventEmitter } from "events";
import { ArrowHelper, Group, Intersection, Object3D, Raycaster, Vector2, Vector3, WebGLRenderer } from "three";
import { CustomObject3D } from "../extensions/object3d";

export interface ClickHelperParams {
  objects: (ExtendedObject3D | CustomObject3D | Group)[];
  camera: THREE.PerspectiveCamera;
  enabled?: boolean;
  renderer: WebGLRenderer;
}

export interface IntersectionEvent {
  type: MouseBtn;
  point: Vector3;
  object: Intersection<Object3D<Event>>;
}

export enum MouseBtn {
  RIGHT = 2,
  LEFT = 1,
}

export class ClickHelper extends EventEmitter {
  private objects: (ExtendedObject3D | CustomObject3D | Group)[] = [];
  private camera: THREE.PerspectiveCamera;
  private mouse = new Vector2();
  private renderer: WebGLRenderer;
  private enabled = true;
  private rayCaster = new Raycaster();
  public arrow: ArrowHelper;
  constructor(config: ClickHelperParams) {
    super();
    this.prepareObjects(config.objects);
    console.log(this.objects)
    this.camera = config.camera;
    this.renderer = config.renderer;
    this.arrow = new ArrowHelper(new Vector3(1, 0, 0), new Vector3(0, 20, 0), 100, 'blue');
    document.addEventListener('mousedown', this.onDocumentMouseMove.bind(this));
  }

  prepareObjects(objects: (ExtendedObject3D | CustomObject3D | Group)[]) {
    for (const object of objects as CustomObject3D[]) {
      console.log(object.reflectOnClick)
      if (object.reflectOnClick) {
        this.objects.push(object);
      }
      if (object.children.length > 0) {
        this.prepareObjects(object.children);
      }
    }
  }

  onDocumentMouseMove(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.mouse.x = ((event.clientX - this.renderer.domElement.offsetLeft) / this.renderer.domElement.width) * 2 - 1;
    this.mouse.y = -((event.clientY - this.renderer.domElement.offsetTop) / this.renderer.domElement.height) * 2 + 1;

    this.rayCaster.setFromCamera(this.mouse, this.camera);
    this.arrow.setDirection(this.rayCaster.ray.direction);
    this.arrow.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
    var intersects = this.rayCaster.intersectObjects(this.objects, true);
    if (intersects.length > 0) {
      for (const intersection of intersects as Intersection<CustomObject3D>[]) {
        this.emit('click', { 
          type: event.button === 2 ? MouseBtn.RIGHT : MouseBtn.LEFT,
          point: intersection.point, 
          object: intersection 
        });
      }
    }
  }
}