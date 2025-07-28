import axios from "axios";

export interface Feedback {
  id?: string;
  serviceId: string;
  customerId: string;
  bookingId?: string;
  customerName?: string;
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

export async function submitFeedback(feedbackData: Feedback) {
  try {
    const response = await axios.post('http://localhost:5198/api/Feedbacks', feedbackData);
    return response.data;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
}

export async function getAllFeedbacks() {
  try {
    const res = await axios.get('http://localhost:5198/api/Feedbacks');
    if (res.data && res.data.$values) {
      return res.data.$values;
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching all feedbacks:", error);
    return [];
  }
}

export async function getFeedbackById(id: string) {
  try {
    const res = await axios.get(`http://localhost:5198/api/Feedbacks/${id}`);
    // Handle potential .NET format if needed
    if (res.data && res.data.$values) {
      return res.data.$values[0]; // Return first item if it's an array
    }
    return res.data;
  } catch (error) {
    console.error(`Error fetching feedback with ID ${id}:`, error);
    return null;
  }
}

export async function deleteFeedbackById(id: string): Promise<boolean> {
  try {
    const res = await axios.delete(`http://localhost:5198/api/Feedbacks/${id}`);
    // Check if deletion was successful
    return res.status >= 200 && res.status < 300;
  } catch (error) {
    console.error(`Error deleting feedback with ID ${id}:`, error);
    return false;
  }
}