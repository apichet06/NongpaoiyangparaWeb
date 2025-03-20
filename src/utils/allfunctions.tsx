import { format } from 'date-fns';

export function formatPrice(price: number) {
    const formatted = Number(price).toLocaleString('th-TH', {
        style: 'currency',
        currency: 'THB'
    });
    return formatted.replace('฿', '').trim();
}

export function formatDate(date: Date) {
    return format(date, 'yyyy/MM/dd')
}

const monthsTHShort = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];
export function formatDateThai(date: Date): string {
    const dateObj = new Date(date);
    const day = format(dateObj, 'd');  // วัน
    const month = monthsTHShort[dateObj.getMonth()];  // เดือนย่อภาษาไทย
    const year = dateObj.getFullYear() + 543;  // ปีพุทธศักราช (เพิ่ม 543)

    return `วันที่ ${day} เดือน ${month} พ.ศ. ${year}`;
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


function numberToThaiText(amount: number): string {
    const thaiNumbers = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
    const thaiUnits = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

    const numStr = amount.toString();
    let result = '';
    const length = numStr.length;

    for (let i = 0; i < length; i++) {
        const digit = parseInt(numStr[i]);
        const unitIndex = length - i - 1;

        if (digit !== 0) {
            if (unitIndex === 1 && digit === 1) {
                result += 'สิบ';
            } else if (unitIndex === 1 && digit === 2) {
                result += 'ยี่สิบ';
            } else if (unitIndex === 0 && digit === 1 && length > 1) {
                result += 'เอ็ด';
            } else {
                result += thaiNumbers[digit] + thaiUnits[unitIndex];
            }
        }
    }

    return result;
}

export function formatPriceToThaiText(price: number): string {
    const baht = Math.floor(price);
    const satang = Math.round((price - baht) * 100);

    const bahtText = baht > 0 ? numberToThaiText(baht) + 'บาท' : '';
    const satangText = satang > 0 ? numberToThaiText(satang) + 'สตางค์' : 'ถ้วน';

    return bahtText + (satang > 0 ? satangText : 'ถ้วน');
}

