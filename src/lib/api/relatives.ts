import axios from 'axios';

// Đảm bảo interface khớp với API
interface Relative {
  userId: string;
  fullname: string;
  relationship: string;
  gender: string;
  birthdate: string;
  phone: string;
  address?: string;
}

/**
 * Creates a new relative in the system
 * @param relativeData The relative data to be created
 * @returns The created relative object or null if creation failed
 */
export async function createRelative(relativeData: Relative): Promise<Relative | null> {
  try {
    const res = await axios.post('http://localhost:5198/api/Relatives', relativeData);
    return res.data;
  } catch (error) {
    console.error("Error creating relative:", error);
    return null;
  }
}



