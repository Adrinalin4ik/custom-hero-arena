import { PerspectiveCamera, Vector2 } from "three";

export interface MouseCameraExtensionParams {
  camera: PerspectiveCamera;
  enabled?: boolean;
  boundPercentage?: number; // values between 0 and 1 where is 0 is entire screen
  speed?: number;
}


export class MouseCameraExtension {
  private camera: PerspectiveCamera;
  private mouse = new Vector2();
  private enabled = true;
  private boundPercentage = 0.8;
  private speed = 0.05;

  constructor(config: MouseCameraExtensionParams) {
    this.camera = config.camera;
    this.boundPercentage = config.boundPercentage || this.boundPercentage;
    this.speed = config.speed || this.speed;
    if (config.enabled) {
      // subscribe on mouse updates
      document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
    }
  }

  onDocumentMouseMove(event: MouseEvent) {
    event.preventDefault();
    const centerX = event.clientX / window.innerWidth;
    const centerY = event.clientY / window.innerHeight;
    
    this.mouse.x = centerX * 2 - 1;
    this.mouse.y = centerY * 2 - 1;
  }

  updateCamera(diff: number) {
    if (!this.camera || !this.enabled) return;
    //offset the camera x/y based on the mouse's position in the window
    if (Math.abs(this.mouse.x) > this.boundPercentage) { 
      this.camera.position.x += this.speed * this.mouse.x * diff;
    }
    if (Math.abs(this.mouse.y) > this.boundPercentage) {
      this.camera.position.z += this.speed * this.mouse.y * diff;
    }
  }
}