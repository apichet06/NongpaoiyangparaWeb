// import React from 'react'

import axios from "axios";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { api } from "../../utils/config";
import { showErrorAlert, showSuccessAlert } from "../../utils/alertUtils";
import Swal from "sweetalert2";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { allowOnlyNumbers, formatNumberWithTwoDecimals } from "../../utils/allfunctions";
import DataTable from "react-data-table-component";

interface DatatypeSharePercent {
    autoID: string;
    s_year: string;
    s_percent: string | null;
    s_huatun: string;
    id: string;
}

export default function SharePercent() {


    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);
    const [s_year, setSyear] = useState('')
    const [s_percent, setSpercent] = useState('')
    const [s_huatun, setShuatun] = useState('')
    const [editID, setEditID] = useState('');



    const [validated, setValidated] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const form = e.currentTarget;
            if (form.checkValidity() === false) {
                e.stopPropagation();
            } else {

                const Data = {
                    s_year: s_year, s_percent, s_huatun
                }

                const apiUrl = editID ? `${api}/sharepercent/${editID}` : `${api}/sharepercent`
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


    }


    const handleReset = async () => {
        setEditID('')
        setSpercent('')
        setSyear('')
        setShuatun('')
    }


    const columns = [
        { name: 'ลำดับ', selector: (row: DatatypeSharePercent) => row.autoID, width: '135px' },
        { name: 'ปี', selector: (row: DatatypeSharePercent) => row.s_year, width: '105px' },
        { name: 'เปอร์เซ็นที่ปันผลหุ้น', selector: (row: DatatypeSharePercent) => row.s_percent + '%', width: '140px' },
        { name: 'ปันผลเปอร์เซ็นหัวตัน', selector: (row: DatatypeSharePercent) => Number(row.s_huatun).toLocaleString() + '%' },
        {
            name: "จัดการ",
            cell: (row: DatatypeSharePercent) => (
                <>
                    <button onClick={() => { handleEdit(row.id); }} className="btn btn-warning btn-sm">แก้ไข</button>
                    &nbsp;
                    <button onClick={() => handleDelete(row.id)} className="btn btn-danger btn-sm">ลบ</button>
                </>
            ), center: true
        },
    ];

    const fetchData = useCallback(async () => {

        const response = await axios.get(api + "/sharepercent");

        if (response.status === 200) {
            const newData = await response.data.data.map((item: DatatypeSharePercent, index: number) => ({
                ...item, autoID: index + 1
            }))
            setData(newData);
            setPending(false);
        } else {
            throw new Error("ไม่พบข้อมูล");
        }

    }, [])


    const handleEdit = async (id: string) => {

        setEditID(id)
        const Data = await data.find((data: DatatypeSharePercent) => data.id === id) || {
            s_year: '',
            s_percent: '',
            s_huatun: ''
        };

        if (Data) {
            setSyear(Data.s_year)
            setSpercent(Data.s_percent)
            setShuatun(Data.s_huatun)
        }
    }



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
                        const response = await axios.delete(`${api}/sharepercent/${id}`, {
                            headers: { 'Content-Type': 'application/json' },
                        });

                        if (response.status === 200) {
                            console.log(response.data);
                            await showSuccessAlert(response.data.message)
                            // รีเฟรชข้อมูลหลังจากลบ
                            await fetchData();
                        }
                    } catch (error) {

                        if (typeof error === "object" && error !== null && "response" in error) {
                            const axiosError = error as { response: { data: { message: string } } };
                            showErrorAlert(axiosError.response.data.message);
                        } else {
                            showErrorAlert("เกิดข้อผิดพลาดที่ไม่รู้จัก");
                        }
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    const handleChangeSpercent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = formatNumberWithTwoDecimals(e.target.value);
        setSpercent(newValue);
    };
    const handleChangehuatun = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = allowOnlyNumbers(e.target.value);
        setShuatun(newValue);
    };



    useEffect(() => {
        fetchData();
    }, [fetchData])

    return (
        <>
            <Container fluid>
                <Row className="justify-content-center">
                    <Col md={6} className="text-center">
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Select
                                    value={s_year} name="s_year"
                                    onChange={(e) => setSyear(e.target.value)}
                                    className="shadow"
                                    required>
                                    <option value="">เลือกปีปันผลหุ้น</option>
                                    {Array.from({ length: 4 }, (_, index) => {
                                        const year = new Date().getFullYear() - 2 + index;
                                        return <option key={year} value={year}>{year}</option>;
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="text" placeholder="แบ่งเปอร์เซ็นหุ้น"
                                    value={s_percent} name="s_percent"
                                    className="shadow"
                                    onChange={handleChangeSpercent}
                                    required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="text" placeholder="แบ่งเปอร์เซ็นหัวตัน"
                                    value={s_huatun} name="s_huatun"
                                    className="shadow"
                                    onChange={handleChangehuatun}
                                    required />
                            </Form.Group>
                            <Form.Group as={Row} className="mb-12">
                                <Col sm={12} className="text-center">
                                    <Button type="submit" className='btn btn-primary shadow'>{editID ? 'แก้ไข' : 'เพิ่ม'}</Button> &nbsp;
                                    {editID && <Button type="submit" className='btn btn-info shadow' onClick={handleReset}>คืนค่า</Button>}
                                </Col>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={7} className="mt-5 mb-5">
                        <Card>
                            <Card.Body className=" mb-5">
                                <h3>ข้อมูลเปอร์เซ็นปันผลหุ้น/หัวตันประจำปี</h3>
                                <strong className='text-danger'>***การจัดการข้อมูลการเปอร์เซ็นต์ปันผลหุ้น/เปอร์เซ็นต์หัวตันในแต่ละปี</strong>
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
