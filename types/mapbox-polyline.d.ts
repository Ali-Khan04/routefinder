/*
  TypeScript dosn't know what "@mapbox/polyline" is by default,
  because the library doesn't has its own type definitions.

  So this file basically tells TypeScript that 
  this module exists and what functions it has.

  Without this file, typescript throws errors like:
  "Could not find a declaration file for module '@mapbox/polyline'"  

  @mapbox/polyline is needed because it converts route data into actual coordianates
  that react-native-maps can understand and draw as a Polyline(Curved, realistic road path).
*/
declare module "@mapbox/polyline" {
  export function decode(str: string, precision?: number): number[][];
  export function encode(coordinates: number[][], precision?: number): string;
}
