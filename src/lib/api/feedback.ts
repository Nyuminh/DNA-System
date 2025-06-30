import axios from "axios";

export interface Feedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export async function getFeedbacksByServiceId(serviceId: string) {
  try {
    const res = await axios.get(`http://localhost:5198/api/Feedbacks/by-service/${serviceId}`);
    // Nếu API trả về .NET $values
    if (res.data && res.data.$values) {
      return res.data.$values;
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return [];
  }
}