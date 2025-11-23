import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";

interface Suggestion {
  id: string;
  name: string;
  displayName: string;
}

interface Props {
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
  onSelectSuggestion?: (suggestion: Suggestion) => void;
}

export default function LocationInput({
  placeholder,
  value,
  onChange,
  onSelectSuggestion,
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  /*
    This runs whenever user types in the input.
    We don't immediately call the API on every keystroke
    instead we wait a bit (debounce) to keep it smooth.
  */
  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(() => {
      fetchSuggestions(value);
    }, 300); // wait for auto suggestion for 300ms before searching

    return () => clearTimeout(timer);
  }, [value]);
  // Fetch suggestions from OpenStreetMap Nominatim API
  const fetchSuggestions = async (query: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&limit=5&countrycodes=pk&accept-language=en`,
        {
          // Nominatim nees this to  identify your app
          headers: {
            "User-Agent": "MyMapApp/1.0",
          },
        }
      );

      const data = await res.json();

      const formatted = data.map((item: any) => ({
        id: item.osm_id,
        name: item.name,
        displayName: item.display_name,
      }));

      setSuggestions(formatted);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Suggestion error:", error);
    } finally {
      setLoading(false);
    }
  };
  /*
    Triggered when a user taps one of the suggestions.
    We fill the input and inform the parent component
  */
  const handleSelectSuggestion = (suggestion: Suggestion) => {
    onChange(suggestion.name);
    setShowSuggestions(false);
    // callback used by MapScreen to convert coordinates
    onSelectSuggestion?.(suggestion);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          onFocus={() => value.length > 0 && setShowSuggestions(true)}
        />
        {loading && (
          <ActivityIndicator
            size="small"
            color="#0000ff"
            style={styles.loader}
          />
        )}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSelectSuggestion(item)}
            >
              <Text style={styles.suggestionText}>{item.name}</Text>
              <Text style={styles.suggestionSubText}>{item.displayName}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    zIndex: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#999",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  loader: {
    marginRight: 10,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f9f9f9",
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  suggestionSubText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
});
