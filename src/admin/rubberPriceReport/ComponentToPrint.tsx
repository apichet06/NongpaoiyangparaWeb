import { forwardRef } from "react";
import { formatDate, formatPrice } from "../../utils/allfunctions";

interface DataTypeComponentToPrint {
    username: string;
    Address: string;
    r_rubber_date: Date;
    r_around: number;
    r_rubber_price: number;
    w_weigth: number;
    w_price: number;
}


const ComponentToPrint = forwardRef<HTMLDivElement, { data: DataTypeComponentToPrint[] }>(
    ({ data }, ref) => (
        <div ref={ref}>
            {data.map((row: DataTypeComponentToPrint, index: number) => (
                <div key={index}>
                    <div className='fs-5 fw-bolder'>ชื่อ : {row.username}</div>
                    <div>ที่อยู่ : {row.Address}</div>
                    <div>วันที่ขาย : {formatDate(row.r_rubber_date)} รอบขายประจำเดือน : รอบที่ {row.r_around}</div>
                    <div className='fs-6'>
                        ราคาประมูล : {formatPrice(row.r_rubber_price)} น้ำหนักรวม : {row.w_weigth} กิโลกรัม
                    </div>
                    <h5 className='fw-bold'>รวมเป็นเงิน : {formatPrice(row.w_price)}</h5>
                    <hr />
                </div>
            ))}
        </div>
    )
);

export default ComponentToPrint;