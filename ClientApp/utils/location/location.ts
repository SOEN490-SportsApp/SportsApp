import axios from "axios";

export const getCoordinatesFromPostalCode = async (postalCode: string) => {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        postalcode: postalCode,
        country: "Canada",
        format: "json",
      },
    });
    
    console.log(response.data);
    if (response.data.length > 0) {
      const location = response.data[0];
      return { latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) };
    } else {
      return { error: "Invalid postal code" };
    }
  } catch (error) {
    return { error: "Error fetching coordinates" };
  }
};

  