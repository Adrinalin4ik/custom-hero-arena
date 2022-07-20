import { ExtendedObject3D, Scene3D } from 'enable3d';

export class MainScene extends Scene3D {
  private box: ExtendedObject3D;

  constructor() {
    super({
      key : 'MainScene'
    })
    // this.physics = new AmmoPhysics(this)
  }

  async init() {
    this.renderer.setPixelRatio(1)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  async preload() {
    // preload your assets here
  }

  async create() {
    // const camera = this.camera as PerspectiveCamera;
    // set up scene (light, ground, grid, sky, orbitControls)
    // this.warpSpeed()
    // this.warpSpeed('-camera')
    this.physics.add.ground({
      width: 200,
      height: 200,
      collisionFlags: 1,
      mass: 5000,
    }, { lambert: { wireframe: true } })

    // enable physics debug
    // this.physics.debug?.enable()

    // position camera
    // this.camera.position.set(10, 10, 20);
    // this.camera.up.set(0, 0, 1);
    // blue box (without physics)
    this.box = this.add.box({ y: 2 }, { lambert: { color: 'deepskyblue' } })

    // pink box (with physics)
    this.physics.add.box({ y: 10 }, { lambert: { color: 'hotpink' } })
  }

  update(timeFromStart: number, diff: number) {
    this.box.rotation.x += 0.01 * diff
    this.box.rotation.y += 0.01 * diff
    // console.log('update', diff, arg, test)
  }
}