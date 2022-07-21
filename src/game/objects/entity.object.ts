import { ExtendedObject3D } from "enable3d";

export class Entity extends ExtendedObject3D {
  public guid: string = (Math.random() * 1000000).toString();
}