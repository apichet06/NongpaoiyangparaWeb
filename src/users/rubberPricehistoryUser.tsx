import { useCallback, useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import { formatDate, formatPrice } from '../utils/allfunctions';
import axios from 'axios';
import { api } from '../utils/config';

interface DatatypeRubberReport {
    w_number: string;
    r_rubber_date: Date;
    r_around: string;
    w_weigth: string;
    r_rubber_price: number;
    w_price: number;
    username: string;
    uadmin: string;
    w_datetime: Date;
}


export default function RubberPricehistoryUser() {
    const resulteData = JSON.parse(localStorage.getItem("resulte") || "{}") as { u_number?: string };
    const columns = [
        { name: 'ID', selector: (row: DatatypeRubberReport) => row.w_number },
        { name: 'วันขาย', selector: (row: DatatypeRubberReport) => formatDate(row.r_rubber_date) },
        { name: 'รอบขาย', selector: (row: DatatypeRubberReport) => row.r_around },
        { name: 'น้ำหนัก/กก.', selector: (row: DatatypeRubberReport) => Number(row.w_weigth).toLocaleString() },
        { name: 'ราคาประมูล', selector: (row: DatatypeRubberReport) => formatPrice(row.r_rubber_price) },
        { name: 'จำนวนเงิน', selector: (row: DatatypeRubberReport) => formatPrice(row.w_price) },
        { name: 'สมาชิก', selector: (row: DatatypeRubberReport) => row.username, width: '175px' },
        { name: 'ผู้บันทึก', selector: (row: DatatypeRubberReport) => row.uadmin, width: '175px' },
        { name: 'วันที่บันทึก', selector: (row: DatatypeRubberReport) => formatDate(row.w_datetime), width: '175px' },
    ];



    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);

    const showData = useCallback(async () => {

        const response = await axios.get(api + "/weightprice/users/" + resulteData.u_number);

        if (response.status === 200) {

            setData(response.data.data);
            setPending(false);
        } else {
            throw new Error("ไม่พบข้อมูล");
        }

    }, [resulteData.u_number])

    useEffect(() => {
        showData();
    }, [showData])

    return (
        <Container>
            <Row>
                <Col className='col-md-12'>
                    <Card>
                        <Card.Body className='shadow'>
                            <DataTable
                                title="ประวัติรายการขายยางพาราทั้งหมด"
                                columns={columns}
                                data={data}
                                pagination
                                progressPending={pending}
                            />
                        </Card.Body>
                    </Card>

                </Col>
            </Row>
        </Container>
    )
}
