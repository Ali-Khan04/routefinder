import {
  View,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
} from "react-native";
import { useState } from "react";
import LocationInput from "../components/LocationInput";
import MapViewComponent from "@/components/MapView";
import { getRoute, LatLng } from "../utils/getRoute";

/*
  Converts a place name into coordinates
  Using OpenStreetMap Nominatim API
*/
async function geocodePlace(place: string): Promise<LatLng | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        place
      )}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "MyMapApp/1.0",
        },
      }
    );

    if (!res.ok) {
      console.error("Geocoding error:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      console.warn("No results found for:", place);
      return null;
    }

    // Normalise API response into our LatLng interface
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export default function MapScreen() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [startCoords, setStartCoords] = useState<LatLng | null>(null);
  const [endCoords, setEndCoords] = useState<LatLng | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [loading, setLoading] = useState(false);

  /*
    If user enters "lat,lng" then parse directly
    else treat input as a place name and geocode it
  */
  const parseCoords = async (text: string): Promise<LatLng | null> => {
    if (text.includes(",")) {
      const [latStr, lngStr] = text.split(",");
      const lat = Number(latStr.trim());
      const lng = Number(lngStr.trim());
      if (!isNaN(lat) && !isNaN(lng)) {
        return { latitude: lat, longitude: lng, lat, lng };
      }
    }
    return await geocodePlace(text.trim());
  };

  const handleRoute = async () => {
    if (!start.trim() || !end.trim()) {
      Alert.alert("Error", "Please enter both start and end locations");
      return;
    }

    setLoading(true);
    try {
      const startParsed = await parseCoords(start);
      const endParsed = await parseCoords(end);

      if (!startParsed) {
        Alert.alert("Error", `Could not find: "${start}"`);
        setLoading(false);
        return;
      }

      if (!endParsed) {
        Alert.alert("Error", `Could not find: "${end}"`);
        setLoading(false);
        return;
      }

      setStartCoords(startParsed);
      setEndCoords(endParsed);
      // Get route polyline from routing API
      const route = await getRoute(startParsed, endParsed);
      // Normalising route points into LatLng format used by Polyline
      const formattedRoute = route.map((point: any) => ({
        latitude: point.latitude,
        longitude: point.longitude,
        lat: point.latitude,
        lng: point.longitude,
      }));
      setRouteCoords(formattedRoute);
    } catch (error) {
      console.error("Route error:", error);
      Alert.alert("Error", "Failed to get route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LocationInput
        placeholder="Start (place or lat,lng)"
        value={start}
        onChange={setStart}
      />
      <LocationInput
        placeholder="End (place or lat,lng)"
        value={end}
        onChange={setEnd}
      />
      <Button
        title={loading ? "Loading..." : "Show Route"}
        onPress={handleRoute}
        disabled={loading}
      />
      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}
      <View style={styles.mapBox}>
        <MapViewComponent
          startCoords={startCoords}
          endCoords={endCoords}
          routeCoords={routeCoords}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  mapBox: {
    flex: 1,
    marginTop: 10,
  },
  loader: {
    marginVertical: 10,
  },
});
