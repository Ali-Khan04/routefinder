# 🗺️ Expo Map Route Practice

This is a practice React Native application built using Expo that demonstrates real-world map routing, live location search, and route visualization.

The goal of this project was not just to show a map, but to understand how real navigation systems work behind the scenes.

## Features

- 📍 Start & End location input
- 🔍 Live English place search with auto-suggestions
- 🗺 Real road route drawing (not straight lines)
- ✅ Safe coordinate validation (no crashes)
- ⏳ Loading indicators & error handling
- 📦 TypeScript support with clean typing

## 🧠 How the routing logic works

This app uses a real-world flow similar to professional navigation systems:

```
User enters location
      ↓
Location is converted to coordinates (Geocoding)
      ↓
OSRM calculates real road route
      ↓
Polyline data is decoded
      ↓
React Native Maps draws the route
```

## 🧭 What is OSRM?

**OSRM (Open Source Routing Machine)** is the routing engine used in this project.

In simple terms:

> OSRM is the brain that calculates how to travel from Point A to Point B using real roads.

When the app sends start and end coordinates to OSRM, it returns:

- The best driving route
- Road curves and turns
- Distance and duration (available for future use)


This is what allows the app to show realistic navigation instead of fake straight lines.

## 🧩 What is a Polyline?

A **Polyline** is a line made from many connected GPS points.

Instead of:

```
Start -------- End (fake straight line)
```

A polyline creates:

```
Start ➝ road ➝ curve ➝ highway ➝ End (realistic path)
```

It visually represents the actual road shape on the map.

## 🔓 Why `@mapbox/polyline` is used

OSRM does not send route coordinates directly. It sends them in a **compressed encoded format** to save bandwidth.

This library:

```
@mapbox/polyline
```

is used to decode that compressed data and convert it into real latitude & longitude points that React Native Maps can understand and draw.

**In short:**

`@mapbox/polyline` converts compressed route data into real coordinate points that `react-native-maps` can use to draw a visible Polyline on the map.

## 📂 Project Structure

```
app/
 └── index.tsx          # Entry point
components/
 ├── LocationInput.tsx  # Smart input with suggestions
 └── MapView.tsx        # Map rendering + markers + polyline
screens/
 └── MapScreen.tsx      # Main logic screen
utils/
 └── getRoute.ts        # OSRM route fetching logic
types/
 └── mapbox-polyline.d.ts # Type declaration for polyline
```

## ✅ Tech Stack

- Expo
- React Native
- TypeScript
- react-native-maps
- OpenStreetMap (Nominatim + OSRM)
- @mapbox/polyline

## 🛠 How to Run

1. Install dependencies:

```bash
npm install
```

2. Start the project:

```bash
npx expo start
```

3. Scan QR code using Expo Go app.

## 🧪 Example Inputs

You can try:

```
Start: Air University Islamabad
End: Centaurus Mall Islamabad
```

OR

```
33.6844,73.0479
33.7380,73.0845
```


## 📈 Possible Future Improvements

- 📍 Current location button
- 🧭 Distance & ETA display
- 🚗 Live navigation animation
- 🎯 Auto fit camera to route
- 🌙 Dark mode maps

## ✨ Purpose

This project was built for learning and experimentation, focusing on understanding how mapping, routing, and geolocation systems function in real applications.

## 👨‍💻 Author

**Ali Ahmed Khan**

Built as a practice project to explore React Native mapping and navigation systems.
