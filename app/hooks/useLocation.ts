import { useState, useCallback } from "react";
import * as Location from "expo-location";

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface UseLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useLocation = (options: UseLocationOptions = {}) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermissions = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === "granted";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Permission request failed"
      );
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        throw new Error("Location permission denied");
      }

      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        ...options,
      });

      const locationData: LocationData = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
      };

      // Get address from coordinates
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        });

        if (reverseGeocode.length > 0) {
          const address = reverseGeocode[0];
          locationData.address = `${address.street || ""} ${
            address.streetNumber || ""
          }, ${address.city || ""}, ${address.region || ""}`.trim();
        }
      } catch (geocodeError) {
        console.warn("Failed to get address:", geocodeError);
      }

      setLocation(locationData);
      return locationData;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get location";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [options, requestPermissions]);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    clearLocation,
    requestPermissions,
  };
};
