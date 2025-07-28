// import { NextResponse } from 'next/server';
// import axios from 'axios';

// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;
//     const API_URL = process.env.API_URL || 'http://localhost:5198';
    
//     console.log(`Proxying request for service ID: ${id}`);
//     const response = await axios.get(`${API_URL}/api/Services/${id}`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       }
//     });
    
//     return NextResponse.json(response.data);
//   } catch (error: any) {
//     console.error('API Route error:', error);
    
//     let status = 500;
//     let message = 'Không thể tải thông tin dịch vụ';
    
//     if (error.response) {
//       status = error.response.status;
//       if (status === 404) {
//         message = 'Không tìm thấy dịch vụ với ID này';
//       } else {
//         message = error.response.statusText;
//       }
//     }
    
//     return NextResponse.json(
//       { error: message }, 
//       { status }
//     );
//   }
// }