import MapView, { Marker, Polyline } from "react-native-maps";

interface LatLng {
  latitude: number;
  longitude: number;
}
// Props coming from MapScreen to show start/end markers and route
interface Props {
  startCoords: LatLng | null;
  endCoords: LatLng | null;
  routeCoords: LatLng[];
}

export default function MapViewComponent({
  startCoords,
  endCoords,
  routeCoords,
}: Props) {
  return (
    <MapView
      /*
        This tells where the map camera will point on first render.

        If startCoords exists, map will be center there.
        Otherwise fall back to Islamabad default location.
      */
      style={{ flex: 1 }}
      initialRegion={{
        latitude: startCoords?.latitude || 33.6844,
        longitude: startCoords?.longitude || 73.0479,
        latitudeDelta: 0.08, // controls zoom level vertically
        longitudeDelta: 0.08, // controls zoom level horizontally
      }}
    >
      {startCoords && <Marker coordinate={startCoords} title="Start" />}

      {endCoords && <Marker coordinate={endCoords} title="End" />}
      {/* Draw route line only when correct route data is available */}
      {routeCoords.length > 0 && (
        <Polyline coordinates={routeCoords} strokeWidth={4} />
      )}
    </MapView>
  );
}
