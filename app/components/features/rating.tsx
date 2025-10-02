import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import ratingApi from "@/apis/ratingApi";

interface RatingPopupProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    rating: number,
    feedback: string,
    images: string[],
    ratingId?: string
  ) => void;
  orderId: string;
  userId: string;
}

const RatingPopup = ({
  visible,
  onClose,
  onSubmit,
  orderId,
  userId,
}: RatingPopupProps) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [existingRatingId, setExistingRatingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing rating when the popup becomes visible
  useEffect(() => {
    const checkExistingRating = async () => {
      if (visible && orderId) {
        setIsLoading(true);
        try {
          const existingRating = await ratingApi.fetchRatingByOrderId(orderId);
          if (existingRating) {
            // Pre-populate form with existing data
            setRating(existingRating.rating);
            setFeedback(existingRating.content);
            setImages(existingRating.image || []);
            setExistingRatingId(existingRating._id);
          } else {
            // Reset form for new rating
            resetForm();
            setExistingRatingId(null);
          }
        } catch (error) {
          console.error("Error checking for existing rating:", error);
          resetForm();
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkExistingRating();
  }, [visible, orderId]);

  const resetForm = () => {
    setRating(0);
    setFeedback("");
    setImages([]);
  };

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleAddImage = async () => {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit(rating, feedback, images, existingRatingId || undefined);
    resetForm();
    onClose();
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleStarPress(i)}
          style={styles.starContainer}>
          <Text style={[styles.star, i <= rating ? styles.filledStar : {}]}>
            ★
          </Text>
        </TouchableOpacity>
      );
    }
    return <View style={styles.starsRow}>{stars}</View>;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='fade'
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color='#FFCC00' />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {/* Title - different for new vs editing */}
              <Text style={styles.modalTitle}>
                {existingRatingId ? "Edit Your Rating" : "Rate Your Experience"}
              </Text>

              {/* Rating Section */}
              <View style={styles.ratingSection}>
                <Text style={styles.sectionLabel}>Rating:</Text>
                {renderStars()}
              </View>

              {/* Feedback Section */}
              <View style={styles.feedbackSection}>
                <Text style={styles.sectionLabel}>Feedback:</Text>
                <TextInput
                  style={styles.feedbackInput}
                  placeholder='Share your experience...'
                  value={feedback}
                  onChangeText={setFeedback}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Images Section */}
              <View style={styles.imagesSection}>
                <Text style={styles.sectionLabel}>Photos:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {images.map((uri, index) => (
                    <View key={index} style={styles.imageContainer}>
                      <Image source={{ uri }} style={styles.image} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => handleRemoveImage(index)}>
                        <Text style={styles.removeImageText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  {images.length < 3 && (
                    <TouchableOpacity
                      style={styles.addImageButton}
                      onPress={handleAddImage}>
                      <Text style={styles.addImageButtonText}>+</Text>
                      <Text style={styles.addImageLabel}>Add Photo</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  rating === 0 && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={rating === 0}>
                <Text style={styles.submitButtonText}>
                  {existingRatingId ? "Update Rating" : "Submit Rating"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  removeImageText: { color: "white", fontSize: 12, fontWeight: "bold" },
  addImageLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  scrollContent: {
    paddingBottom: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#888",
  },
  ratingSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  starContainer: {
    marginRight: 8,
  },
  star: {
    fontSize: 30,
    color: "#E0E0E0",
  },
  filledStar: {
    color: "#FFCC00",
  },
  feedbackSection: {
    marginBottom: 20,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  imagesSection: {
    marginBottom: 20,
  },
  imageContainer: {
    width: 120,
    height: 90,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  addImageButton: {
    width: 120,
    height: 90,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  addImageButtonText: {
    fontSize: 30,
    color: "#888",
  },
  submitButton: {
    backgroundColor: "#FFCC00",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#FFE580",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default RatingPopup;
