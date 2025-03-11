import { FormEvent, useCallback, useEffect, useState } from 'react'
import { showErrorAlert, showSuccessAlert } from '../../utils/alertUtils';
import Swal from 'sweetalert2';
import { api } from '../../utils/config';
import { formatPrice, formatDate } from '../../utils/allfunctions';
import axios from 'axios';
// import { format } from 'date-fns';
import DataTable from 'react-data-table-component';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import DatePicker from "react-datepicker";

interface DataTypeRubberPrice {
    autoID: number;
    r_around: number;
    r_rubber_date: Date;
    r_rubber_price: number;
    username: string;
    r_number: string;
}

export default function RubberPrice() {

    const [r_rubber_price, setRrubberPrice] = useState('');
    const [r_rubber_date, setRrubberDate] = useState<Date | null>(new Date());
    const [editID, setEditID] = useState<string | null>(null);

    const columns = [
        { name: 'ID', selector: (row: DataTypeRubberPrice) => row.autoID, width: '80px' },
        { name: 'รอบขาย', selector: (row: DataTypeRubberPrice) => row.r_around, width: '100px' },
        { name: 'วันขาย', selector: (row: DataTypeRubberPrice) => formatDate(row.r_rubber_date), width: '130px' },
        { name: 'ราคาประมูลยางพารา', selector: (row: DataTypeRubberPrice) => formatPrice(row.r_rubber_price), width: '150px' },
        { name: 'ผู้บันทึก', selector: (row: DataTypeRubberPrice) => row.username, width: '190px' },
        {
            name: "จัดการ",
            cell: (row: DataTypeRubberPrice) => (
                <>
                    <button onClick={() => { handleEdit(row.r_number); }} className="btn btn-warning btn-sm">แก้ไข</button>
                    &nbsp;
                    <button onClick={() => handleDelete(row.r_number)} className="btn btn-danger btn-sm">ลบ</button>
                </>
            ), center: true
        },
    ];

    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);

    const fetchData = useCallback(async () => {

        try {
            const response = await axios.get(api + "/rubberprice");

            if (response.status === 200) {
                const NewData = await response.data.data.map((item: DataTypeRubberPrice, index: number) => ({
                    ...item, autoID: index + 1
                }))
                setData(NewData);
                setPending(false);
            }
        } catch (error) {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "เกิดข้อผิดพลาดที่ไม่รู้จัก";
            showErrorAlert(message);
        }

    }, [])

    const handleDelete = async (id: string) => {


        try {
            Swal.fire({
                title: "ยืนยันการลบ",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ลบ!'
            }).then(async (result) => {
                if (result.isConfirmed) {

                    try {
                        const response = await axios.delete(`${api}/rubberprice/${id}`, {
                            headers: { 'Content-Type': 'application/json' },
                        });

                        if (response.status === 200) {
                            console.log(response.data);
                            await showSuccessAlert(response.data.message)
                            // รีเฟรชข้อมูลหลังจากลบ
                            await fetchData();
                        }
                    } catch (error) {

                        const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "เกิดข้อผิดพลาดที่ไม่รู้จัก";
                        showErrorAlert(message);
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    }



    const handleEdit = async (r_number: string) => {

        setEditID(r_number)
        const Data = await data.find((data: DataTypeRubberPrice) => data.r_number === r_number) || {
            r_rubber_price: '',
            r_rubber_date: new Date()
        };

        if (Data) {

            setRrubberPrice(Data.r_rubber_price)
            setRrubberDate(Data.r_rubber_date);
        }
    }


    const handleReset = async () => {
        setEditID('')
        setRrubberDate(null)
        setRrubberPrice('')
    }
    const [validated, setValidated] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const form = e.currentTarget;
            if (form.checkValidity() === false) {
                e.preventDefault();
                e.stopPropagation();
            } else {


                const Data = {
                    r_rubber_price: r_rubber_price,
                    r_rubber_date: r_rubber_date,
                    u_number: 'U10000001'
                }

                const apiUrl = editID ? `${api}/rubberprice/${editID}` : `${api}/rubberprice`
                const response = await (editID ? axios.put(apiUrl, Data) : axios.post(apiUrl, Data));

                if (response.status === 200) {

                    showSuccessAlert(response.data.message);
                    fetchData();
                    handleReset()

                }
            }

            setValidated(true);
        } catch (error) {
            if (typeof error === "object" && error !== null && "response" in error) {
                const axiosError = error as { response: { data: { message: string } } };
                showErrorAlert(axiosError.response.data.message);
            } else {
                showErrorAlert("เกิดข้อผิดพลาดที่ไม่รู้จัก");
            }
        }

    };

    useEffect(() => {
        fetchData();
    }, [fetchData])


    return (
        <>
            <Container fluid>
                <Row className='justify-content-center' >
                    <Col md={5} className='text-center'>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col} md="6" controlId="validationCustom01">
                                    <Form.Control className='shadow'
                                        required
                                        type="text"
                                        value={r_rubber_price} name="r_rubber_price"
                                        placeholder='ราคาประมูลยางพารา'
                                        onChange={(e) => setRrubberPrice(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">Looks good!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="6" controlId="validationCustom02">
                                    <DatePicker
                                        selected={r_rubber_date}
                                        onChange={(date: Date | null) => date && setRrubberDate(date)}
                                        className="form-control shadow w-100"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">กรุณาระบุวันที่!</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Button className='shadow me-2' type="submit">{editID ? 'แก้ไข' : 'เพิ่ม'}</Button>
                            {editID && <Button type="submit" className='btn btn-info shadow' onClick={handleReset}>คืนค่า</Button>}
                        </Form>
                        <hr />
                    </Col>
                    <Col md={8}>
                        <Card className='shadow'>
                            <Card.Body>
                                <h3>ข้อมูลราคายางพารา</h3>
                                <strong className='text-danger'>***การเพิ่มข้อมูลราคาประมูลยางพารา ระบุวันที่ต้องการขายยางพาราและราคาที่ประมูลได้ในการประมูล</strong>
                                <DataTable
                                    title=""
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

        </>
    )
}
