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
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private renderer: THREE.WebGLRenderer;

  constructor(props: IRendererProps) {
    super(props);
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    PhysicsLoader('/libs/ammo', () => { 
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        stencil: false,
        powerPreference: 'high-performance',
        canvas: this.canvasRef.current!
      });

      new Project({
        scenes: [ MainScene ],
        renderer: this.renderer,
      });
      this.setState({ loading: false });
    });
  }

  componentWillUnmount() {
    this.renderer?.clear();
    this.canvasRef?.current?.remove();
  }

  render() {
    return (
      <div id='renderer'>
        <canvas
          id="test"
          ref={this.canvasRef}
        ></canvas>
      </div>
    )
  }
}