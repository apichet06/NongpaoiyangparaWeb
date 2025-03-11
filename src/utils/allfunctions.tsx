import { format } from 'date-fns';

export function formatPrice(price: number) {
    return Number(price).toLocaleString('th-TH', {
        style: 'currency',
        currency: 'THB'
    });
}

export function formatDate(date: Date) {
    return format(date, 'yyyy/MM/dd')
}

export function formatDateTime(date: Date) {
    return format(date, 'yyyy/MM/dd HH:mm')
}


export function isLeapYear(year: number) {
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    return isLeap ? 29 : 28;
}

export const formatNumberWithTwoDecimals = (value: string) => {
    // อนุญาตเฉพาะตัวเลข และทศนิยมไม่เกิน 2 ตำแหน่ง
    if (/^\d*\.?\d{0,2}$/.test(value)) {
        return value;
    }
    return ''; // ถ้าค่าไม่ถูกต้อง จะไม่เปลี่ยนค่าเดิม
};

export const allowOnlyNumbers = (value: string) => {
    return value.replace(/[^0-9]/g, ""); // ลบทุกอย่างที่ไม่ใช่ตัวเลข
};

export const getPayloadFromToken = (token: string) => {
    if (!token) return null;

    try {
        const base64 = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
        if (!base64) return null;

        const decoded = atob(base64);
        return JSON.parse(new TextDecoder().decode(Uint8Array.from(decoded, c => c.charCodeAt(0))));
    } catch {
        return null;
    }
};
