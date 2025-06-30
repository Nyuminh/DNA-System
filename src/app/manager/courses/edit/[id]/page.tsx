// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { 
//   ArrowLeftIcon,
//   CheckIcon,
//   XMarkIcon,
//   PlusIcon,
//   MinusIcon
// } from "@heroicons/react/24/outline";

// interface CourseModule {
//   id: string;
//   title: string;
//   lessons: string[];
//   duration: string;
// }

// interface CourseForm {
//   title: string;
//   description: string;
//   instructor: string;
//   duration: string;
//   category: string;
//   status: "active" | "inactive";
//   level: string;
//   price: number;
//   totalLessons: number;
//   totalHours: string;
//   objectives: string[];
//   curriculum: CourseModule[];
//   requirements: string[];
//   benefits: string[];
//   image?: string; // Thêm trường image
// }

// export default function EditCoursePage() {
//   const params = useParams();
//   const router = useRouter();
//   const courseId = params.id as string;

//   const [formData, setFormData] = useState<CourseForm>({
//     title: "",
//     description: "",
//     instructor: "",
//     duration: "",
//     category: "",
//     status: "active",
//     level: "",
//     price: 0,
//     totalLessons: 0,
//     totalHours: "",
//     objectives: [""],
//     curriculum: [
//       {
//         id: "1",
//         title: "",
//         lessons: [""],
//         duration: ""
//       }
//     ],
//     requirements: [""],
//     benefits: [""],
//     image: ""
//   });

//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);

//   const categories = [
//     { value: "basic", label: "Cơ bản" },
//     { value: "advanced", label: "Nâng cao" },
//     { value: "professional", label: "Chuyên nghiệp" },
//     { value: "specialized", label: "Chuyên ngành" }
//   ];

//   const levels = [
//     "Cơ bản",
//     "Trung bình", 
//     "Nâng cao",
//     "Chuyên gia"
//   ];

//   useEffect(() => {
//     // Mock data - trong thực tế sẽ gọi API để lấy thông tin khóa học
//     const mockCourse = {
//       title: "Kiến thức cơ bản về ADN",
//       description: "Tìm hiểu về cấu trúc, chức năng và vai trò của ADN trong di truyền học. Khóa học cung cấp nền tảng vững chắc về sinh học phân tử và các ứng dụng thực tiễn trong xét nghiệm ADN.",
//       instructor: "TS. Nguyễn Văn A",
//       duration: "8 tuần",
//       category: "basic",
//       status: "active" as const,
//       level: "Cơ bản",
//       price: 2500000,
//       totalLessons: 24,
//       totalHours: "32 giờ",
//       objectives: [
//         "Hiểu cấu trúc và tính chất của ADN",
//         "Nắm vững các nguyên lý di truyền học cơ bản",
//         "Áp dụng kiến thức vào phân tích ADN",
//         "Hiểu các phương pháp xét nghiệm ADN hiện đại"
//       ],
//       curriculum: [
//         {
//           id: "1",
//           title: "Giới thiệu về ADN",
//           lessons: [
//             "Lịch sử khám phá ADN",
//             "Cấu trúc phân tử ADN",
//             "Các loại ADN"
//           ],
//           duration: "1 tuần"
//         },
//         {
//           id: "2", 
//           title: "Di truyền học cơ bản",
//           lessons: [
//             "Nguyên lý di truyền Mendel",
//             "Nhiễm sắc thể và gene",
//             "Đột biến và biến dị"
//           ],
//           duration: "2 tuần"
//         }
//       ],
//       requirements: [
//         "Kiến thức sinh học cơ bản ở trình độ phổ thông",
//         "Có khả năng đọc hiểu tiếng Anh cơ bản",
//         "Máy tính có kết nối internet"
//       ],
//       benefits: [
//         "Chứng chỉ hoàn thành khóa học",
//         "Kiến thức nền tảng vững chắc về ADN",
//         "Hỗ trợ tư vấn từ giảng viên"
//       ]
//     };

//     setFormData(mockCourse);
//     setIsLoading(false);
//   }, [courseId]);
//   const handleInputChange = (field: keyof CourseForm, value: string | number) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleArrayChange = (field: keyof CourseForm, index: number, value: string) => {
//     if (field === 'curriculum') return; // Handle separately
    
//     const newArray = [...(formData[field] as string[])];
//     newArray[index] = value;
//     setFormData(prev => ({
//       ...prev,
//       [field]: newArray
//     }));
//   };

//   const addArrayItem = (field: keyof CourseForm) => {
//     if (field === 'curriculum') {
//       const newModule: CourseModule = {
//         id: Date.now().toString(),
//         title: "",
//         lessons: [""],
//         duration: ""
//       };
//       setFormData(prev => ({
//         ...prev,
//         curriculum: [...prev.curriculum, newModule]
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [field]: [...(prev[field] as string[]), ""]
//       }));
//     }
//   };

//   const removeArrayItem = (field: keyof CourseForm, index: number) => {
//     if (field === 'curriculum') {
//       const newCurriculum = formData.curriculum.filter((_, i) => i !== index);
//       setFormData(prev => ({
//         ...prev,
//         curriculum: newCurriculum
//       }));
//     } else {
//       const newArray = (formData[field] as string[]).filter((_, i) => i !== index);
//       setFormData(prev => ({
//         ...prev,
//         [field]: newArray
//       }));
//     }
//   };  const handleModuleChange = (moduleIndex: number, field: keyof CourseModule, value: string | string[]) => {
//     const newCurriculum = [...formData.curriculum];
//     if (field === 'lessons') {
//       newCurriculum[moduleIndex] = {
//         ...newCurriculum[moduleIndex],
//         lessons: value as string[]
//       };
//     } else {
//       newCurriculum[moduleIndex] = {
//         ...newCurriculum[moduleIndex],
//         [field]: value as string
//       };
//     }
//     setFormData(prev => ({
//       ...prev,
//       curriculum: newCurriculum
//     }));
//   };

//   const addLesson = (moduleIndex: number) => {
//     const newCurriculum = [...formData.curriculum];
//     newCurriculum[moduleIndex].lessons.push("");
//     setFormData(prev => ({
//       ...prev,
//       curriculum: newCurriculum
//     }));
//   };

//   const removeLesson = (moduleIndex: number, lessonIndex: number) => {
//     const newCurriculum = [...formData.curriculum];
//     newCurriculum[moduleIndex].lessons = newCurriculum[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
//     setFormData(prev => ({
//       ...prev,
//       curriculum: newCurriculum
//     }));
//   };

//   const handleLessonChange = (moduleIndex: number, lessonIndex: number, value: string) => {
//     const newCurriculum = [...formData.curriculum];
//     newCurriculum[moduleIndex].lessons[lessonIndex] = value;
//     setFormData(prev => ({
//       ...prev,
//       curriculum: newCurriculum
//     }));
//   };

//   const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (file) {
//       setFormData(prev => ({
//         ...prev,
//         image: file.name // Nếu bạn upload lên server, đổi thành URL trả về
//       }));
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFormData(prev => ({
//         ...prev,
//         image: file.name // Nếu bạn upload lên server, đổi thành URL trả về
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSaving(true);

//     try {
//       // Validate form
//       if (!formData.title || !formData.description || !formData.instructor || !formData.category) {
//         alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
//         return;
//       }

//       // Filter out empty items from arrays
//       const cleanedData = {
//         ...formData,
//         objectives: formData.objectives.filter(item => item.trim() !== ""),
//         requirements: formData.requirements.filter(item => item.trim() !== ""),
//         benefits: formData.benefits.filter(item => item.trim() !== ""),
//         curriculum: formData.curriculum
//           .filter(module => module.title.trim() !== "")
//           .map(module => ({
//             ...module,
//             lessons: module.lessons.filter(lesson => lesson.trim() !== "")
//           }))
//       };

//       // API call to update course
//       console.log("Updating course:", cleanedData);
      
//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       alert("Khóa học đã được cập nhật thành công!");
//       router.push(`/manager/courses/${courseId}`);
//     } catch (error) {
//       console.error("Error updating course:", error);
//       alert("Có lỗi xảy ra khi cập nhật khóa học!");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Đang tải thông tin khóa học...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center">
//               <Link 
//                 href={`/manager/courses/${courseId}`}
//                 className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <ArrowLeftIcon className="h-6 w-6" />
//               </Link>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa khóa học</h1>
//                 <p className="text-sm text-gray-500">Cập nhật thông tin khóa học</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Information */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Tiêu đề khóa học <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.title}
//                   onChange={(e) => handleInputChange("title", e.target.value)}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Giảng viên <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.instructor}
//                   onChange={(e) => handleInputChange("instructor", e.target.value)}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Thời lượng
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.duration}
//                   onChange={(e) => handleInputChange("duration", e.target.value)}
//                   placeholder="Ví dụ: 8 tuần"
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Danh mục <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={formData.category}
//                   onChange={(e) => handleInputChange("category", e.target.value)}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 >
//                   <option value="">Chọn danh mục</option>
//                   {categories.map(category => (
//                     <option key={category.value} value={category.value}>{category.label}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Trình độ
//                 </label>
//                 <select
//                   value={formData.level}
//                   onChange={(e) => handleInputChange("level", e.target.value)}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 >
//                   <option value="">Chọn trình độ</option>
//                   {levels.map(level => (
//                     <option key={level} value={level}>{level}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Học phí (VNĐ)
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.price}
//                   onChange={(e) => handleInputChange("price", parseInt(e.target.value) || 0)}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Số bài học
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.totalLessons}
//                   onChange={(e) => handleInputChange("totalLessons", parseInt(e.target.value) || 0)}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Tổng thời lượng
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.totalHours}
//                   onChange={(e) => handleInputChange("totalHours", e.target.value)}
//                   placeholder="Ví dụ: 32 giờ"
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Trạng thái
//                 </label>
//                 <select
//                   value={formData.status}
//                   onChange={(e) => handleInputChange("status", e.target.value as "active" | "inactive")}
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 >
//                   <option value="active">Đang mở</option>
//                   <option value="inactive">Đã đóng</option>
//                 </select>
//               </div>
//             </div>

//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Mô tả khóa học <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 value={formData.description}
//                 onChange={(e) => handleInputChange("description", e.target.value)}
//                 rows={4}
//                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           </div>

//           {/* Objectives */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Mục tiêu khóa học</h2>
            
//             {formData.objectives.map((objective, index) => (
//               <div key={index} className="flex items-center space-x-2 mb-2">
//                 <input
//                   type="text"
//                   value={objective}
//                   onChange={(e) => handleArrayChange("objectives", index, e.target.value)}
//                   placeholder="Nhập mục tiêu..."
//                   className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeArrayItem("objectives", index)}
//                   className="p-2 text-red-600 hover:bg-red-50 rounded-md"
//                   disabled={formData.objectives.length === 1}
//                 >
//                   <MinusIcon className="h-4 w-4" />
//                 </button>
//               </div>
//             ))}
            
//             <button
//               type="button"
//               onClick={() => addArrayItem("objectives")}
//               className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
//             >
//               <PlusIcon className="h-4 w-4 mr-1" />
//               Thêm mục tiêu
//             </button>
//           </div>

//           {/* Curriculum */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Chương trình học</h2>
            
//             {formData.curriculum.map((module, moduleIndex) => (
//               <div key={module.id} className="border border-gray-200 rounded-lg p-4 mb-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="font-medium text-gray-900">Chương {moduleIndex + 1}</h3>
//                   <button
//                     type="button"
//                     onClick={() => removeArrayItem("curriculum", moduleIndex)}
//                     className="p-1 text-red-600 hover:bg-red-50 rounded-md"
//                     disabled={formData.curriculum.length === 1}
//                   >
//                     <MinusIcon className="h-4 w-4" />
//                   </button>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
//                   <input
//                     type="text"
//                     value={module.title}
//                     onChange={(e) => handleModuleChange(moduleIndex, "title", e.target.value)}
//                     placeholder="Tiêu đề chương..."
//                     className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                   <input
//                     type="text"
//                     value={module.duration}
//                     onChange={(e) => handleModuleChange(moduleIndex, "duration", e.target.value)}
//                     placeholder="Thời lượng (VD: 2 tuần)..."
//                     className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Bài học:</label>
//                   {module.lessons.map((lesson, lessonIndex) => (
//                     <div key={lessonIndex} className="flex items-center space-x-2">
//                       <input
//                         type="text"
//                         value={lesson}
//                         onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, e.target.value)}
//                         placeholder="Tên bài học..."
//                         className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeLesson(moduleIndex, lessonIndex)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-md"
//                         disabled={module.lessons.length === 1}
//                       >
//                         <MinusIcon className="h-3 w-3" />
//                       </button>
//                     </div>
//                   ))}
//                   <button
//                     type="button"
//                     onClick={() => addLesson(moduleIndex)}
//                     className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
//                   >
//                     <PlusIcon className="h-3 w-3 mr-1" />
//                     Thêm bài học
//                   </button>
//                 </div>
//               </div>
//             ))}
            
//             <button
//               type="button"
//               onClick={() => addArrayItem("curriculum")}
//               className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
//             >
//               <PlusIcon className="h-4 w-4 mr-1" />
//               Thêm chương
//             </button>
//           </div>

//           {/* Requirements */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Yêu cầu</h2>
            
//             {formData.requirements.map((requirement, index) => (
//               <div key={index} className="flex items-center space-x-2 mb-2">
//                 <input
//                   type="text"
//                   value={requirement}
//                   onChange={(e) => handleArrayChange("requirements", index, e.target.value)}
//                   placeholder="Nhập yêu cầu..."
//                   className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeArrayItem("requirements", index)}
//                   className="p-2 text-red-600 hover:bg-red-50 rounded-md"
//                   disabled={formData.requirements.length === 1}
//                 >
//                   <MinusIcon className="h-4 w-4" />
//                 </button>
//               </div>
//             ))}
            
//             <button
//               type="button"
//               onClick={() => addArrayItem("requirements")}
//               className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
//             >
//               <PlusIcon className="h-4 w-4 mr-1" />
//               Thêm yêu cầu
//             </button>
//           </div>

//           {/* Benefits */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Lợi ích</h2>
            
//             {formData.benefits.map((benefit, index) => (
//               <div key={index} className="flex items-center space-x-2 mb-2">
//                 <input
//                   type="text"
//                   value={benefit}
//                   onChange={(e) => handleArrayChange("benefits", index, e.target.value)}
//                   placeholder="Nhập lợi ích..."
//                   className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeArrayItem("benefits", index)}
//                   className="p-2 text-red-600 hover:bg-red-50 rounded-md"
//                   disabled={formData.benefits.length === 1}
//                 >
//                   <MinusIcon className="h-4 w-4" />
//                 </button>
//               </div>
//             ))}
            
//             <button
//               type="button"
//               onClick={() => addArrayItem("benefits")}
//               className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
//             >
//               <PlusIcon className="h-4 w-4 mr-1" />
//               Thêm lợi ích
//             </button>
//           </div>

//           {/* Image Upload */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Ảnh khóa học</h2>
            
//             <div
//               className="w-full px-3 py-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer bg-gray-50 hover:bg-gray-100"
//               onDragOver={e => e.preventDefault()}
//               onDrop={handleImageDrop}
//             >
//               {formData.image
//                 ? <span className="text-green-600 font-medium">{formData.image}</span>
//                 : <span className="text-gray-400">Kéo & thả ảnh vào đây hoặc click để chọn</span>
//               }
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 id="course-image-upload"
//                 onChange={handleImageChange}
//               />
//               <label htmlFor="course-image-upload" className="block mt-2 text-blue-600 underline cursor-pointer">
//                 Chọn ảnh
//               </label>
//             </div>
//             <p className="text-xs text-gray-500 mt-1">
//               Kéo & thả hoặc chọn file ảnh. Chỉ lưu tên file ảnh.
//             </p>
//           </div>

//           {/* Action Buttons */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex justify-end space-x-4">
//               <Link
//                 href={`/manager/courses/${courseId}`}
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 <XMarkIcon className="h-4 w-4 mr-2" />
//                 Hủy
//               </Link>
//               <button
//                 type="submit"
//                 disabled={isSaving}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSaving ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     Đang lưu...
//                   </>
//                 ) : (
//                   <>
//                     <CheckIcon className="h-4 w-4 mr-2" />
//                     Lưu thay đổi
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
