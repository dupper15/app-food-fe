export const getCoordinatesFromAddress = async (address: string) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=API_KEY`
    );
    const data = await response.json();

    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      throw new Error("Không tìm thấy tọa độ.");
    }
  } catch (error) {
    console.error("Lỗi khi lấy tọa độ:", error);
    return null;
  }
};
