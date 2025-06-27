import axios from 'axios';

export interface Course {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  authorRole: string;
  readTime: string;
  imageUrl: string;
  featured: boolean;
  content: string;
}

export async function getCourses(): Promise<Course[]> {
  const res = await axios.get('/api/course');
  return res.data;
}
