import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
//import MapView, { Marker, Polyline } from "react-native-maps";
import { WebView } from "react-native-webview";
import { router, useLocalSearchParams } from "expo-router";
import { fetchOrderById } from "@/apis/orderApi";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { getCustomerInfo } from "@/apis/userApi";
import { Ionicons } from "@expo/vector-icons";
import RouteLocationSelectionModal from "@/components/modals/RouteLocationSelectionModal";

interface Location {
  latitude: number;
  longitude: number;
  title: string;
  address?: string;
}

const TrackRouteScreen: React.FC = () => {
  const userId = useSelector((state) => state.user.userId);
  const { id } = useLocalSearchParams();
  const orderId = typeof id === "string" ? id : "";

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startLocation, setStartLocation] = useState<Location>({
    latitude: 10.762622,
    longitude: 106.660172,
    title: "Your Location",
  });
  const [endLocation, setEndLocation] = useState<Location>({
    latitude: 10.773831,
    longitude: 106.685149,
    title: "Restaurant",
  });
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [useWebViewMap, setUseWebViewMap] = useState<boolean>(true);

  // Location selection modal state - only for starting point
  const [showStartLocationModal, setShowStartLocationModal] =
    useState<boolean>(false);

  const getUserInfoMutation = useMutation({
    mutationFn: getCustomerInfo,
    onSuccess: (data) => {
      // Set user's location from the first address with coordinates
      if (data.addressCoordinates && data.addressCoordinates.length > 0) {
        setStartLocation({
          latitude: data.addressCoordinates[0].latitude,
          longitude: data.addressCoordinates[0].longitude,
          title: data.name || "Your Location",
          address: data.addressCoordinates[0].address,
        });
      }
    },
    onError: (error) => {
      console.error("Error fetching user info:", error);
    },
  });

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!orderId) {
        throw new Error("Invalid order ID");
      }

      const orderData = await fetchOrderById(orderId);
      console.log("Fetched order data:", orderData);
      setOrderDetail(orderData);

      // Check if restaurant data with coordinates is available (using original logic)
      if (
        orderData.restaurant_id &&
        typeof orderData.restaurant_id === "object" &&
        orderData.restaurant_id.latitude &&
        orderData.restaurant_id.longitude
      ) {
        setEndLocation({
          latitude: orderData.restaurant_id.latitude,
          longitude: orderData.restaurant_id.longitude,
          title: orderData.restaurant_id.name || "Restaurant",
          address: orderData.restaurant_id.address,
        });
      }

      getUserInfoMutation.mutate(userId);
      setIsLoading(false);

      // Fetch route after locations are set
      fetchRoute();
      console.log("End location set:", endLocation);
    } catch (err) {
      console.error("Error loading order details:", err);
      setError("Failed to load order details");
      setIsLoading(false);
    }
  };

  const handleSelectStartLocation = (location: {
    latitude: number;
    longitude: number;
    address?: string;
    title?: string;
  }) => {
    setStartLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      title: location.title || "Your Location",
      address: location.address,
    });

    // Refresh the route with the new starting location
    fetchRoute();
  };

  const fetchRoute = async () => {
    try {
      // Check if both locations are valid
      if (!startLocation?.latitude || !endLocation?.latitude) {
        throw new Error("Invalid location coordinates");
      }

      const start = [startLocation.longitude, startLocation.latitude];
      const end = [endLocation.longitude, endLocation.latitude];

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.join(
          ",",
        )};${end.join(",")}?overview=full&geometries=geojson`,
        { method: "GET" },
      );

      if (!response.ok) {
        throw new Error(`Route calculation failed: ${response.status}`);
      }

      const data = await response.json();

      // Parse OSRM response format
      if (data.routes && data.routes.length > 0) {
        const coordinates = data.routes[0].geometry.coordinates;
        const formattedCoordinates = coordinates.map((coord) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));

        setRouteCoordinates(formattedCoordinates);
      } else {
        throw new Error("No route found");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      // If API call fails, create a simple straight line route as fallback
      generateSimpleRoute();
    }
  };

  // Fallback method to generate a simple route if API call fails
  const generateSimpleRoute = () => {
    const numPoints = 10;
    const latDiff = endLocation.latitude - startLocation.latitude;
    const lngDiff = endLocation.longitude - startLocation.longitude;

    const route = [];
    for (let i = 1; i < numPoints; i++) {
      const fraction = i / numPoints;
      route.push({
        latitude: startLocation.latitude + latDiff * fraction,
        longitude: startLocation.longitude + lngDiff * fraction,
      });
    }

    setRouteCoordinates(route);
  };

  // Update route when locations change
  useEffect(() => {
    if (!isLoading && startLocation && endLocation) {
      fetchRoute();
    }
  }, [startLocation, endLocation]);

  // Calculate the region to show both markers
  const getMapRegion = () => {
    const lats = [startLocation.latitude, endLocation.latitude];
    const lngs = [startLocation.longitude, endLocation.longitude];
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latDelta = maxLat - minLat + 0.02;
    const lngDelta = maxLng - minLng + 0.02;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: latDelta > 0.02 ? latDelta : 0.02,
      longitudeDelta: lngDelta > 0.02 ? lngDelta : 0.02,
    };
  };

  // Generate HTML for the OpenStreetMap WebView
  const generateOSMHTML = () => {
    const startCoords = `[${startLocation.latitude}, ${startLocation.longitude}]`;
    const endCoords = `[${endLocation.latitude}, ${endLocation.longitude}]`;
    const waypoints = routeCoordinates
      .map((coord) => `[${coord.latitude}, ${coord.longitude}]`)
      .join(",");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { width: 100%; height: 100vh; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map');
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
          
          const startMarker = L.marker(${startCoords}).addTo(map)
            .bindPopup("${startLocation.title}${
              startLocation.address
                ? ": " + startLocation.address.replace(/"/g, '\\"')
                : ""
            }");
            
          const endMarker = L.marker(${endCoords}).addTo(map)
            .bindPopup("${endLocation.title}${
              endLocation.address
                ? ": " + endLocation.address.replace(/"/g, '\\"')
                : ""
            }");
          
          // Add route polyline if waypoints exist
          ${
            waypoints.length > 0
              ? `const routePath = [${startCoords}, ${waypoints}, ${endCoords}];
             L.polyline(routePath, {color: '#2196F3', weight: 4}).addTo(map);`
              : ""
          }
          
          // Fit map to show all markers
          const bounds = L.latLngBounds([${startCoords}, ${endCoords}]);
          map.fitBounds(bounds, { padding: [30, 30] });
        </script>
      </body>
      </html>
    `;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#0000ff' />
        <Text style={styles.loadingText}>Loading route information...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Render with WebView for OpenStreetMap
  if (useWebViewMap) {
    return (
      <View style={styles.container}>
        <WebView
          style={styles.map}
          originWhitelist={["*"]}
          source={{ html: generateOSMHTML() }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
        <View style={styles.infoContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                style={{ marginRight: 8 }}
                name='chevron-back-outline'
                size={24}
                color='black'
              />
            </TouchableOpacity>
            <Text style={styles.infoTitle}>Track route</Text>
          </View>

          {/* Location selection section - only for start location */}
          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>From:</Text>
            <TouchableOpacity
              style={styles.locationSelector}
              onPress={() => setShowStartLocationModal(true)}>
              <Ionicons
                name='location'
                size={20}
                color='#2196F3'
                style={styles.locationIcon}
              />
              <Text numberOfLines={1} style={styles.locationText}>
                {startLocation.address || startLocation.title}
              </Text>
              <Ionicons name='pencil' size={16} color='#757575' />
            </TouchableOpacity>
          </View>

          {/* Fixed destination - restaurant */}
          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>To:</Text>
            <View
              style={[styles.locationSelector, { backgroundColor: "#f8f8f8" }]}>
              <Ionicons
                name='restaurant'
                size={20}
                color='#F44336'
                style={styles.locationIcon}
              />
              <Text
                numberOfLines={2}
                style={[styles.locationText, { color: "#333" }]}>
                {endLocation.title}
                {endLocation.address ? ` (${endLocation.address})` : ""}
              </Text>
            </View>
          </View>
        </View>

        {/* Location selection modal - only for starting point */}
        <RouteLocationSelectionModal
          visible={showStartLocationModal}
          onClose={() => setShowStartLocationModal(false)}
          userId={userId}
          onSelectLocation={handleSelectStartLocation}
          title='Select Your Starting Point'
          purpose='start'
        />
      </View>
    );
  }

  // Original render method with react-native-maps as fallback
  return (
    <View style={styles.container}>
      {/* <MapView
        style={styles.map}
        region={getMapRegion()}
        showsUserLocation={true}
        followsUserLocation={true}>
        <Marker
          coordinate={{
            latitude: startLocation.latitude,
            longitude: startLocation.longitude,
          }}
          title={startLocation.title}
        />
        <Marker
          coordinate={{
            latitude: endLocation.latitude,
            longitude: endLocation.longitude,
          }}
          title={endLocation.title}
        />
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={4}
          strokeColor='#2196F3'
        />
      </MapView>
      <View style={styles.infoContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              style={{ marginRight: 8 }}
              name='chevron-back-outline'
              size={24}
              color='black'
            />
          </TouchableOpacity>
          <Text style={styles.infoTitle}>Track route</Text>
        </View>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.7,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  locationLabel: {
    width: 40,
    fontSize: 14,
    fontWeight: "bold",
  },
  locationSelector: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default TrackRouteScreen;
