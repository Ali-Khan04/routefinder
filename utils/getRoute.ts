import * as polyline from "@mapbox/polyline";

export interface LatLng {
  latitude: number;
  longitude: number;
  lat: number;
  lng: number;
}
/*
  This function talks to the OSRM server(server that calculates the best route between two places.) and fetches
  the route between the start and end locationss.

  The result is converted into something react-native-maps
  can directly draw as a Polyline.
*/

export async function getRoute(start: LatLng, end: LatLng) {
  const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=polyline`;

  const res = await fetch(url);
  const data = await res.json();

  const points = polyline.decode(data.routes[0].geometry);
  /*
    polyline.decode gives us an array like:
    [ [lat, lng], [lat, lng], ... ]

    Here we convert that into objects so
    <Polyline /> understands it.
  */

  return points.map((p: number[]) => ({
    latitude: p[0],
    longitude: p[1],
  }));
}
