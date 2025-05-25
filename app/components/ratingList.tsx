import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { ratingApi } from "../../services/api/ratingApi";

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Icon key={`full-${i}`} name='star' size={16} color='#facc15' />
    );
  }

  if (halfStar) {
    stars.push(
      <Icon key='half' name='star-half-full' size={16} color='#facc15' />
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Icon key={`empty-${i}`} name='star-o' size={16} color='#facc15' />
    );
  }

  return <View className='flex-row mt-1 mb-2'>{stars}</View>;
};

const RatingList = ({ restaurantId }) => {
  const [ratings, setRatings] = useState([]);
  const getRatingMutation = useMutation({
    mutationFn: ratingApi.getAllRatingByRestaurantId,
    onSuccess: (data) => {
      setRatings(data);
    },
    onError: (error) => {
      console.error("Error fetching ratings:", error);
    },
  });

  useEffect(() => {
    getRatingMutation.mutate(restaurantId);
  }, [restaurantId]);

  return (
    <ScrollView className='flex-1 px-4'>
      {ratings.length > 0 && (
        <View>
          <Text className='text-xl font-semibold text-gray-800 mb-4'>
            Customer Ratings
          </Text>
          {ratings.map((rating, index) => (
            <View key={index} className='mb-6 p-4 bg-white rounded-2xl'>
              <View className='flex-row items-center mb-3'>
                <Image
                  source={{
                    uri:
                      rating.customer_id.avatar ||
                      "https://via.placeholder.com/40",
                  }}
                  style={{ width: 44, height: 44, borderRadius: 22 }}
                />
                <View className='ml-3'>
                  <Text className='font-semibold text-base text-gray-800'>
                    {rating.customer_id.name}
                  </Text>
                  <Text className='text-xs text-gray-400'>
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <Text className='text-gray-700 mb-1'>{rating.content}</Text>

              {renderStars(rating.rating)}

              {rating.image?.length > 0 && (
                <ScrollView horizontal className='mb-3'>
                  {rating.image.map((img, i) => (
                    <Image
                      key={i}
                      source={{ uri: img }}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 12,
                        marginRight: 10,
                      }}
                    />
                  ))}
                </ScrollView>
              )}

              {rating.replies_array?.length > 0 && (
                <View className='mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200'>
                  <View className='flex-row items-center mb-2'>
                    <Image
                      source={{ uri: rating.restaurant_id.owner_id.avatar }}
                      style={{ width: 32, height: 32, borderRadius: 16 }}
                    />
                    <View className='flex-1 ml-2'>
                      <Text className='font-medium text-gray-800'>
                        {rating.restaurant_id.name}
                      </Text>
                      <Text className='text-xs text-gray-400'>
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  {rating.replies_array.map((reply, i) => (
                    <View key={i}>
                      <Text className='text-sm text-gray-600 mb-2'>
                        {reply.content}
                      </Text>
                      {reply.images?.length > 0 && (
                        <ScrollView horizontal>
                          {reply.images.map((img, j) => (
                            <Image
                              key={j}
                              source={{ uri: img }}
                              style={{
                                width: 80,
                                height: 80,
                                borderRadius: 8,
                                marginRight: 8,
                              }}
                            />
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default RatingList;
