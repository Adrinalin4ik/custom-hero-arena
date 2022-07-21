import { PhysicsLoader, Project } from "enable3d";
import React, { PureComponent } from "react";
import * as THREE from "three";
import { MainScene } from '../../../game/scenes/main.scene';
export interface IRendererProps {}
export interface IRendererState {
  project?: Project;
  loading: boolean;
}

export class Renderer extends PureComponent<IRendererProps, IRendererState> {
  private camera: THREE.PerspectiveCamera;
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private project: Project;

  constructor(props: IRendererProps) {
    super(props);
    this.state = {
      loading: true
    }
    this.camera = new THREE.PerspectiveCamera(60, this.aspectRatio, 2, 500);
    this.camera.up.set(0, 0, 1);
    this.camera.position.set(15, 0, 7);
  }

  componentDidMount() {
    PhysicsLoader('/libs/ammo', () => {
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        stencil: false,
        powerPreference: 'high-performance',
        canvas: this.canvasRef.current!
      });

      this.project = new Project({
        scenes: [ MainScene ],
        renderer,
      });
      this.setState({ loading: false });
    });
  }

  get aspectRatio() {
    return window.innerWidth / window.innerHeight;
  }

  render() {
    return (
      <div>
        <canvas
          ref={this.canvasRef}
          width='700' 
          height='600'
        ></canvas>
      </div>
    )
  }
}