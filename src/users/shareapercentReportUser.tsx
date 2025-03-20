import axios from 'axios';
import { useCallback, useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import { api } from '../utils/config';
import { formatPrice } from '../utils/allfunctions';

interface DataType {
    r_rubber_year: string
    u_number: string
    u_title: string
    u_firstname: string
    u_lastname: string
    u_address: string
    u_share: number
    percent: number
    Sumpercentshare: number
    Sumweight: number
    percent_yang: number
    sumhuatun: number
    sumPrice: number
    s_year: string
}

export default function ShareapercentReportUser() {
    const resulteData = JSON.parse(localStorage.getItem("resulte") || "{}") as { u_firstname?: string };

    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);
    const [percentYears, setPercentYears] = useState([])
    const [year, setYear] = useState('')

    const percentYear = useCallback(async () => {
        try {

            const response = await axios.get(api + "/sharepercent")
            if (response.status === 200)
                setPercentYears(response.data.data)
        } catch (error) {
            console.log(error);
            throw error
        }
    }, [])


    const columns = [
        { name: 'ปี', selector: (row: DataType) => row.r_rubber_year, width: '65px' },
        { name: 'เลขหุ้น', selector: (row: DataType) => row.u_number, width: '110px' },
        { name: 'ชื่อ-สกุล', selector: (row: DataType) => row.u_title + '' + row.u_firstname + ' ' + row.u_lastname, width: '175px' },
        { name: 'ที่อยู่', selector: (row: DataType) => row.u_address, width: '200px' },
        { name: 'จำนวนหุ้น', selector: (row: DataType) => formatPrice(row.u_share) },
        { name: 'เปอร์เซ็นหุ้น', selector: (row: DataType) => (row.percent) + '%' },
        { name: 'เงินปันผลหุ้น', selector: (row: DataType) => formatPrice(row.Sumpercentshare) },
        { name: 'น้ำหนักหัวตันรวม', selector: (row: DataType) => row.Sumweight },
        { name: 'เปอร์เซ็นหัวตัน', selector: (row: DataType) => (row.percent_yang) + '%' },
        { name: 'เงินปันผลหัวตัน', selector: (row: DataType) => formatPrice(row.sumhuatun) },
        { name: 'เงินปันผลรวม', selector: (row: DataType) => formatPrice(row.sumPrice) },
    ];

    const showData = useCallback(async () => {

        const Data = { year, u_username: resulteData.u_firstname }
        const response = await axios.post(api + "/sharepercent/share", Data);

        if (response.status === 200) {

            setData(response.data.data);
            setPending(false);
        } else {
            throw new Error("ไม่พบข้อมูล");
        }

    }, [resulteData.u_firstname, year])

    useEffect(() => {
        showData();
        percentYear()
    }, [showData, percentYear])


    return (
        <Container fluid>
            <Row className='justify-content-center'>
                <Col className="col-auto mb-3">
                    <input className="form-control shadow" list="percentYear" placeholder="ค้นหาปีปันผล..." onChange={e => setYear(e.target.value)} />
                    <datalist id="percentYear">
                        {percentYears.map((p: DataType) => (
                            <option key={p.s_year} value={p.s_year}></option>
                        ))}
                    </datalist>
                </Col>

                <hr />

                <Col className='col-md-11'>
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
