import { useEffect, useCallback, useState } from 'react';
import { formatDate, formatPrice } from '../../utils/allfunctions';
import axios from 'axios';
import { api } from '../../utils/config';
// import ComponentToPrint from './ComponentToPrint';
import DataTable from 'react-data-table-component';
import Select, { SingleValue } from 'react-select';
import { Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { format } from "date-fns";
// import { useReactToPrint } from 'react-to-print'
import * as ReactDOMServer from 'react-dom/server';

interface DataTypeRubberPriceR {
    w_number: number;
    r_around: number;
    w_weigth: number;
    r_rubber_price: number;
    w_price: number;
    username: string;
    w_datetime: Date;
    uadmin: string;
    r_rubber_date: Date;
    u_number: string;
    u_share_id: number;
    r_number: string;
    value: string;
}

export default function RubberPriceReport() {


    const columns = [
        { name: 'ID', selector: (row: DataTypeRubberPriceR) => row.w_number, width: '130px' },
        { name: 'งวด-ปี/เดือน/วัน', selector: (row: DataTypeRubberPriceR) => row.r_around + '-' + formatDate(row.r_rubber_date), width: '150px' },
        { name: 'น้ำหนักรวม', selector: (row: DataTypeRubberPriceR) => Number(row.w_weigth).toLocaleString() },
        { name: 'ราคาประมูลยางพารา', selector: (row: DataTypeRubberPriceR) => formatPrice(row.r_rubber_price) },
        { name: 'จำนวนเงิน', selector: (row: DataTypeRubberPriceR) => formatPrice(row.w_price) },
        { name: 'สมาชิก', selector: (row: DataTypeRubberPriceR) => row.username, width: '220px' },
        { name: 'ผู้บันทึก', selector: (row: DataTypeRubberPriceR) => row.uadmin, width: '175px' },
        { name: 'วันที่บันทึก', selector: (row: DataTypeRubberPriceR) => formatDate(row.w_datetime), width: '175px' },
    ];

    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);
    const [rubberprice, setRubberprice] = useState([]);
    const [u_number, setUnumber] = useState('');
    const [r_number, setRnumber] = useState('');
    const [users, setUsers] = useState<DataTypeRubberPriceR[]>([]);


    // const [isPrinting, setIsPrinting] = useState(false);
    // const componentRef = useRef<HTMLDivElement>(null);




    const showData = useCallback(async () => {

        const Data = { r_number, u_firstname: u_number }
        const response = await axios.post(api + "/weightprice/weight", Data);

        if (response.status === 200) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            const filteredData = response.data.data.filter((item: DataTypeRubberPriceR) => {
                const itemDate = new Date(item.r_rubber_date);
                const itemYear = itemDate.getFullYear();
                const itemMonth = itemDate.getMonth() + 1;
                return itemYear === currentYear && itemMonth === currentMonth;
            });

            setData(filteredData);
            setPending(false);

        } else {
            throw new Error("ไม่พบข้อมูล");
        }

    }, [r_number, u_number])



    const handlerubberpriceChange = useCallback(async () => {
        try {
            const response = await axios.get(api + '/rubberprice')
            if (response.status === 200) {

                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth() + 1;

                const filteredRubber = response.data.data.filter((item: DataTypeRubberPriceR) => {
                    const itemDate = new Date(item.r_rubber_date);
                    const itemYear = itemDate.getFullYear();
                    const itemMonth = itemDate.getMonth() + 1;
                    return itemYear === currentYear && itemMonth === currentMonth;
                });

                setRubberprice(filteredRubber)
            }

        } catch (error) {
            console.log(error);
        }
    }, [])

    const userData = useCallback(async () => {
        try {
            const response = await axios.get(api + "/users");
            if (response.status === 200) {
                const users: DataTypeRubberPriceR[] = [{ value: '', label: '--- เลือกสมาชิก ---' }, ...response.data.data.map((item: DataTypeRubberPriceR) => ({
                    value: item.u_number,
                    label: item.u_share_id + ' - ' + item.username
                }))];
                setUsers(users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, []);


    const dateSearch = rubberprice.filter((item: DataTypeRubberPriceR) => {
        return item.r_number == r_number;
    }) as DataTypeRubberPriceR[];

    const downloadExcelFile = async () => {
        try {
            const Data = { r_number, u_firstname: u_number }
            const response = await axios.post(api + "/weightprice/Export", Data, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `รายการขายยางพาราประจำเดือน${dateSearch.length > 0 ? 'ประจำรอบ ' + formatDate(dateSearch[0].r_rubber_date) : ''} ${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading Excel file:', error);
        }
    }

    const ChangeUsers = (e: SingleValue<DataTypeRubberPriceR> | null) => setUnumber(e?.value || "");

    useEffect(() => {
        showData();
        userData()
        handlerubberpriceChange()
    }, [showData, userData, handlerubberpriceChange])


    const handlePrint = async () => {

        const Data = ReactDOMServer.renderToStaticMarkup(
            <Container fluid>
                <Row className='justify-content-start'>
                    {
                        data.map((item: DataTypeRubberPriceR, index: number) => (
                            <>
                                <Col md={6} sm={6} lg={6} xl={6}>

                                    <Table key={index} striped bordered style={{ border: '1px solid black', fontSize: '14px' }}>
                                        <tbody>
                                            <tr>
                                                <td align='right'>ชื่อ: </td>
                                                <td>{item.username}</td>
                                            </tr>
                                            <tr>
                                                <td align='right'>วันที่ขาย: </td>
                                                <td>{formatDate(item.r_rubber_date)} รอบประจำเดือน : รอบที่ {item.r_around}</td>
                                            </tr>
                                            <tr>
                                                <td align='right'>ราคาประมูล: </td>
                                                <td>{formatPrice(item.r_rubber_price)} น้ำหนักรวม : {item.w_weigth} กิโลกรัม</td>
                                            </tr>
                                            <tr>
                                                <td align='right'>รวมเป็นเงิน: </td>
                                                <td colSpan={2}>{formatPrice(item.w_price)} บาท</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col >



                            </>
                        ))
                    }
                </Row>
            </Container >
        );
        const centeredHtml = ` 
             <html>
                <head>
                    <link rel="stylesheet" 
                          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"> 
                </head>
                <body>${Data}</body>
            </html>

            `;

        const createHtmlUrl = () => {
            const blob = new Blob([centeredHtml], { type: 'text/html' });
            return URL.createObjectURL(blob);
        };

        const htmlUrl = createHtmlUrl();

        let printFrame = document.getElementById('printIframe') as HTMLIFrameElement;
        if (!printFrame) {
            printFrame = document.createElement('iframe');
            printFrame.id = 'printIframe';
            printFrame.style.display = 'none';
            document.body.appendChild(printFrame);
        }

        printFrame.src = htmlUrl;

        printFrame.onload = () => {
            printFrame.contentWindow?.focus();
            printFrame.contentWindow?.print();
        };
    }

    return (
        <Container>
            <Row className='justify-content-center'>
                <Col md={4} className='mt-5' >
                    <Form.Select className='shadow'
                        value={r_number} onChange={(e) => { setRnumber(e.target.value); }} required>
                        <option value="">เลือกรอบขาย/ราคาประมูลยาง</option>
                        {rubberprice.map((item: DataTypeRubberPriceR, index: number) => (
                            <option key={index} value={item.r_number}>{format(item.r_rubber_date, 'yyyy/MM/dd') + ' รอบ ' + item.r_around + ' ราคาประมูล ' + item.r_rubber_price}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col className='mt-5' md={4}>
                    <Select className='shadow'
                        instanceId="instanceId"
                        value={users.find((option: DataTypeRubberPriceR) => option.value === u_number) || null}
                        options={users}
                        onChange={ChangeUsers}
                        required
                    />
                </Col>
            </Row>
            <Row className='justify-content-center'>
                <Col className='col-md-12 mt-5 mb-5'>
                    <hr />
                    <Row>
                        <Col md={7}>
                            <h4>รายการขายยางพาราประจำเดือน {new Date().getFullYear()}/{String(new Date().getMonth() + 1).padStart(2, '0')}</h4>
                        </Col>
                        <Col md={5} className='text-end'>
                            {(r_number || u_number) ?
                                <>
                                    <Button className='btn btn-sm btn-secondary' onClick={downloadExcelFile}>ออกรายงาน Excel</Button>  {' '}
                                    <button className='btn btn-sm btn-dark' onClick={handlePrint} >พิมพ์เอกสาร</button>
                                </> : <strong className='text-danger'>ออกรายงาน Excel จำเป็นต้องค้นข้อมูลทุกครั้ง</strong>
                            }
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
                    <strong className='text-danger '>***การออกรายงานประจำเดือนจะค้นหาได้เฉพาะเดือนปัจจุบันเท่านั้นหากต้องการดูเดือนอื่นๆ สามารถเขาดูได้ที่ เมนู "ประวัติการขายยางพารา"</strong>
                </Col>
            </Row>
        </Container>
    )
}
