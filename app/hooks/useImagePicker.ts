import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";

interface ImagePickerResult {
  uri: string;
  name?: string;
  type?: string;
  size?: number;
}

interface UseImagePickerOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
  allowsMultipleSelection?: boolean;
  mediaTypes?: any;
}

export const useImagePicker = (options: UseImagePickerOptions = {}) => {
  const [images, setImages] = useState<ImagePickerResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultOptions = {
    allowsEditing: true,
    aspect: [1, 1] as [number, number],
    quality: 0.8,
    allowsMultipleSelection: false,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    ...options,
  };

  const requestPermissions = useCallback(async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === "granted";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Permission request failed"
      );
      return false;
    }
  }, []);

  const pickFromLibrary = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        throw new Error("Media library permission denied");
      }

      const result = await ImagePicker.launchImageLibraryAsync(defaultOptions);

      if (!result.canceled && result.assets) {
        const selectedImages = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.fileName,
          type: asset.type,
          size: asset.fileSize,
        }));

        if (defaultOptions.allowsMultipleSelection) {
          setImages((prev) => [...prev, ...selectedImages]);
        } else {
          setImages(selectedImages);
        }

        return selectedImages;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to pick image";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [defaultOptions, requestPermissions]);

  const takePhoto = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Camera permission denied");
      }

      const result = await ImagePicker.launchCameraAsync(defaultOptions);

      if (!result.canceled && result.assets) {
        const takenImages = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.fileName,
          type: asset.type,
          size: asset.fileSize,
        }));

        if (defaultOptions.allowsMultipleSelection) {
          setImages((prev) => [...prev, ...takenImages]);
        } else {
          setImages(takenImages);
        }

        return takenImages;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to take photo";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [defaultOptions]);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
    setError(null);
  }, []);

  return {
    images,
    loading,
    error,
    pickFromLibrary,
    takePhoto,
    removeImage,
    clearImages,
    setImages,
  };
};
