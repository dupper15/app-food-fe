export const getAddressFromCoordinates = async (
  latitude: any,
  longitude: any
) => {
  const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

  try {
    let response = await fetch(url);
    let data = await response.json();

    if (data.results.length > 0) {
      const address = data.results[0].formatted_address;
      return address;
    } else {
      console.log("Không tìm thấy địa chỉ");
    }
  } catch (error) {
    console.error("Lỗi khi lấy địa chỉ:", error);
  }
};
