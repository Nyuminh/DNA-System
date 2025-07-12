import axios from "axios";

export interface Course {
  id: string;
  title: string;
  date: string;
  description: string;
  instructor: string;
  duration: string;
  image: string; // Thêm dòng này
}

export async function fetchCourses(): Promise<Course[]> {
  const response = await axios.get("http://localhost:5198/api/Course");
  let coursesArray = [];
  if (response.data && typeof response.data === 'object') {
    if ('$values' in response.data && Array.isArray(response.data.$values)) {
      coursesArray = response.data.$values;
    } else if (Array.isArray(response.data)) {
      coursesArray = response.data;
    } else {
      coursesArray = [response.data];
    }
  }
  return coursesArray.map((course: any) => ({
    id: course.id?.toString() || course.courseId?.toString() || "",
    title: course.title || course.name || "Không có tên",
    date: course.date || course.createdAt || course.ngay || "", 
    description: course.description || "Không có mô tả",
    instructor: course.instructor || course.teacher || "Không rõ",
    duration: course.duration || "",
    image: course.image || "", // Thêm dòng này
  }));
}

// Hàm lấy chi tiết khóa học theo id
export async function fetchCourseById(id: string): Promise<Course | null> {
  try {
    const response = await axios.get(`http://localhost:5198/api/Course/${id}`);
    const course = response.data;
    return {
      id: course.id?.toString() || course.courseId?.toString() || "",
      title: course.title || course.name || "Không có tên",
      date: course.date || course.createdAt || course.ngay || "",
      description: course.description || "Không có mô tả",
      instructor: course.instructor || course.teacher || "Không rõ",
      duration: course.duration || "",
      image: course.image || "",
    };
  } catch (error) {
    console.error("Không thể lấy chi tiết khóa học:", error);
    return null;
  }
}

export async function deleteCourse(id: string, token: string) {
  await axios.delete(`http://localhost:5198/api/Course/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createCourse(
  course: { managerId: string; title: string; date: string; description: string; image: string },
  token: string,
  file?: File
) {
  let payload: any;
  let headers: any;

  if (file) {
    payload = new FormData();
    payload.append("ManagerId", course.managerId);
    payload.append("Title", course.title);
    payload.append("Date", course.date);
    payload.append("Description", course.description);
    payload.append("Image", file.name);
    payload.append("picture", file);
    headers = { Authorization: `Bearer ${token}` };
  } else {
    payload = {
      ManagerId: course.managerId,
      Title: course.title,
      Date: course.date,
      Description: course.description,
      Image: course.image,
    };
    headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  await axios.post("http://localhost:5198/api/Course", payload, { headers });
}

export async function updateCourse(
  id: string,
  course: { managerId: string; title: string; date: string; description: string; image: string },
  token: string,
  file?: File
) {
  let payload: any;
  let headers: any;

  if (file) {
    payload = new FormData();
    payload.append("ManagerId", course.managerId);
    payload.append("Title", course.title);
    payload.append("Date", course.date);
    payload.append("Description", course.description);
    payload.append("Image", file.name);
    payload.append("picture", file);
    headers = { Authorization: `Bearer ${token}` };
  } else {
    payload = {
      ManagerId: course.managerId,
      Title: course.title,
      Date: course.date,
      Description: course.description,
      Image: course.image,
    };
    headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  await axios.put(`http://localhost:5198/api/Course/${id}`, payload, { headers });
}
