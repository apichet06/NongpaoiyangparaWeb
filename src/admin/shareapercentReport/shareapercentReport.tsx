import { useEffect } from 'react'
import { useCallback, useState } from "react";
import { api } from "../../utils/config";
import axios from "axios";
import Swal from 'sweetalert2';
import { formatPrice, isLeapYear } from '../../utils/allfunctions';
import DataTable from 'react-data-table-component';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';



interface DataTypeShareaperR {
    r_rubber_year: number;
    u_number: number;
    u_share_id: number;
    u_title: string;
    u_address: string;
    u_share: number;
    percent: number;
    Sumpercentshare: number;
    Sumweight: number;
    percent_yang: number;
    sumhuatun: number;
    sumPrice: number;
    u_firstname: string;
    u_lastname: string;
    s_year: number;
}


export default function ShareapercentReport() {

    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);
    const [users, setUsers] = useState([])
    const [percentYears, setPercentYears] = useState([])
    const [year, setYear] = useState('')
    const [u_username, setUfirstname] = useState('')

    const userData = useCallback(async () => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axios.get(api + "/users")
            if (response.status === 200)
                setUsers(response.data.data)
        } catch (error) {
            throw error
        }

    }, [])

    const percentYear = useCallback(async () => {
        try {
            const response = await axios.get(api + "/sharepercent")
            if (response.status === 200)
                setPercentYears(response.data.data)
        } catch (error) {
            console.error("Error fetching share percent:", error);
        }
    }, [])


    const handleUpdateShareYear = useCallback(async () => {

        try {
            let timerInterval: number | undefined;
            let count = 1;

            Swal.fire({
                title: "อัปเดตหุ้นประจำปี...",
                html: "เวลาประมวลผล: <b></b>",
                didOpen: () => {
                    Swal.showLoading(Swal.getDenyButton())
                    const progress = Swal.getHtmlContainer()?.querySelector("b");
                    if (progress) {
                        progress.textContent = count.toString();
                        timerInterval = setInterval(() => {
                            count++;
                            progress.textContent = count.toString();
                        }, 100);
                    }
                },
                willClose: () => {
                    clearInterval((timerInterval));
                },
                allowOutsideClick: false, // ไม่อนุญาตให้คลิกนอกกล่องเพื่อปิด
                allowEscapeKey: false,    // ไม่อนุญาตให้กดปุ่ม Escape เพื่อปิด
                allowEnterKey: false      // ไม่อนุญาตให้กดปุ่ม Enter เพื่อปิด
            });

            const response = await axios.get(api + "/sharepercent/UdateshareYear", {
                // onDownloadProgress: (progressEvent) => { }
            });
            if (response.status === 200) {
                Swal.close(); // ปิด SweetAlert เมื่อได้รับการตอบกลับที่มีสถานะเป็น 200
            }

        } catch (error) {
            console.error("Error fetching share percent:", error);
        }
    }, []);

    const showData = useCallback(async () => {

        try {

            const Data = { year, u_username }
            const response = await axios.post(api + "/sharepercent/share", Data);
            if (response.status === 200) {
                setData(response.data.data);
                setPending(false);
            }
        } catch (error) {
            console.error("Error fetching share percent:", error);
        }

    }, [year, u_username])

    // ฟังก์ชันสำหรับดาวน์โหลดไฟล์ Excel
    const downloadExcelFile = async () => {
        try {
            const response = await axios.post(api + "/sharepercent/ExportShareToExcel", { year, u_username }, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `รายงานปันผลหุ้นประจำปี ${yearStart} ถึง ${yearEnd + '/' + Date.now()} .xlsx`);
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading Excel file:', error);
        }
    }

    useEffect(() => {
        showData();
        userData()
        percentYear()
    }, [showData, userData, percentYear])

    const currentDate = new Date().getFullYear();
    const nextYear = year === '' ? currentDate + 1 : parseInt(year) + 1;
    const lastDay = isLeapYear(nextYear);

    const yearStart = `${year || currentDate}-03-01`;
    const yearEnd = `${nextYear}-02-${lastDay}`;

    const columns = [
        { name: 'ปี', selector: (row: DataTypeShareaperR) => row.r_rubber_year, width: '65px' },
        { name: 'ID', selector: (row: DataTypeShareaperR) => row.u_number, width: '110px' },
        { name: 'เลขหุ้น', selector: (row: DataTypeShareaperR) => row.u_share_id, width: '70px' },
        { name: 'ชื่อ-สกุล', selector: (row: DataTypeShareaperR) => row.u_title + '' + row.u_firstname + ' ' + row.u_lastname, width: '175px' },
        { name: 'ที่อยู่', selector: (row: DataTypeShareaperR) => row.u_address, width: '410px' },
        { name: 'จำนวนหุ้น', selector: (row: DataTypeShareaperR) => formatPrice(row.u_share) },
        { name: 'เปอร์เซ็นหุ้น', selector: (row: DataTypeShareaperR) => (row.percent) + '%' },
        { name: 'เงินปันผลหุ้น', selector: (row: DataTypeShareaperR) => formatPrice(row.Sumpercentshare) },
        { name: 'น้ำหนักหัวตันรวม', selector: (row: DataTypeShareaperR) => row.Sumweight },
        { name: 'เปอร์เซ็นหัวตัน', selector: (row: DataTypeShareaperR) => (row.percent_yang) + '%' },
        { name: 'เงินปันผลหัวตัน', selector: (row: DataTypeShareaperR) => formatPrice(row.sumhuatun) },
        { name: 'เงินปันผลรวม', selector: (row: DataTypeShareaperR) => formatPrice(row.sumPrice) },
    ];

    return (
        <Container fluid className='mb-5'>
            <Row className='justify-content-center'>
                <Col className="col-auto mt-5">
                    <Form.Control className='shadow' list="percentYear" placeholder="ค้นหาปีปันผล..." onChange={e => setYear(e.target.value)} />
                    <datalist id="percentYear">
                        {percentYears.map((p: DataTypeShareaperR) => (
                            <option key={p.s_year} value={p.s_year}></option>
                        ))}
                    </datalist>
                </Col>
                <Col className="col-auto mt-5">
                    <Form.Control className='shadow' list="user" id="u_number" placeholder="ค้นหาชื่อสมาชิก" onChange={e => setUfirstname(e.target.value)} />
                    <datalist id="user">
                        {users.map((user: DataTypeShareaperR) => (
                            <option key={user.u_number} value={user.u_firstname}></option>
                        ))}
                    </datalist>
                </Col>
                <Col md={10} className='mt-5'>
                    <hr />
                    <Row>
                        <Col md={8}>
                            <h4>รายงานเงินปันผลประจำปี {yearStart + ' ถึง ' + yearEnd}</h4>
                            <strong>
                                <b className='text-danger'>แจ้งเตือน</b>: กรณีไม่พบข้อมูลการปันผล แสดงว่าข้อมูลหุ้นปีนั้นๆ ไม่ถูกอัปเดต <b className='text-danger'><u>จำเป็นต้องกดปุ่ม "อัปเดตหุ้นประจำปี"</u></b> หรือสมาชิกเพิ่มหุ้นหรือถอนหุ้น <b className='text-danger'><u>จำเป็นต้องกดปุ่ม "อัปเดตหุ้นประจำปี"</u></b> เช่นกัน
                            </strong>
                        </Col>
                        <Col className='text-end'>
                            <Button className='btn btn-sm btn-warning shadow' onClick={handleUpdateShareYear}>อัปเดตหุ้นประจำปี</Button>{' '}
                            <Button className='btn btn-sm btn-secondary shadow' onClick={downloadExcelFile}>ออกรายงาน Excel</Button>
                        </Col>
                    </Row>
                    <hr />
                    <Card>
                        <Card.Body className='shadow'>
                            <DataTable
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
