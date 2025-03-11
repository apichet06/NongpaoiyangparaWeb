// alertUtils.tsx

import Swal from 'sweetalert2';

export function showSuccessAlert(message: string) {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 2000,
    });
}

export function showErrorAlert(message: string) {
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 5000,
    });
}


// export const handleError = (error: unknown) => {
//     const message = axios.isAxiosError(error)
//         ? error.response?.data?.message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์"
//         : error instanceof Error
//             ? error.message
//             : "เกิดข้อผิดพลาดที่ไม่รู้จัก";

//     console.error("Error:", message);
//     showErrorAlert(message);
// };


export function showDeleteAlert(message: string) {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 2000,
    });
}

