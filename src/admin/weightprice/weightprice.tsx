// import React from 'react'

import { FormEvent, useCallback, useEffect, useState } from "react";
import { showErrorAlert, showSuccessAlert } from "../../utils/alertUtils";
import Swal from "sweetalert2";
import axios from "axios";
import { api } from "../../utils/config";
import { formatDate, formatDateTime, formatPrice, getPayloadFromToken } from "../../utils/allfunctions";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { format } from "date-fns";

import Select, { SingleValue } from 'react-select';
interface DataTypeWeigheprice {
    autoID: string;
    w_number: string;
    u_share_id: number;
    username: string;
    r_around: number;
    r_rubber_price: number;
    w_weigth: number;
    w_price: number;
    r_rubber_date: Date;
    uadmin: string;
    w_datetime: Date;
    u_number: number;
    r_number: number;
    u_firstname: string;
    value: string;
}

interface Datatypeusers {
    u_number: number;
    u_share_id: number;
    username: string;
    value: string;
}

export default function Weightprice() {

    const [userId, setUserId] = useState('');

    useEffect(() => {
        setUserId(getPayloadFromToken(localStorage.getItem('token') || '')?.userId || '');
    }, []);

    const columns = [
        { name: 'ลำดับ', selector: (row: DataTypeWeigheprice) => row.autoID, width: '62px' },
        { name: 'ID', selector: (row: DataTypeWeigheprice) => row.w_number, width: '130px' },
        { name: 'เลขหุ้น', selector: (row: DataTypeWeigheprice) => row.u_share_id, width: '110px' },
        { name: 'สามชิก', selector: (row: DataTypeWeigheprice) => row.username, width: '175px' },
        { name: 'รอบขายยางพารา', selector: (row: DataTypeWeigheprice) => row.r_around, width: '120px' },
        { name: 'ราคาประมูลยางพารา', selector: (row: DataTypeWeigheprice) => formatPrice(row.r_rubber_price) },
        { name: 'น้ำหนัก/กิโลกรัม', selector: (row: DataTypeWeigheprice) => Number(row.w_weigth).toFixed(2).toLocaleString() },
        { name: 'จำนวนเงิน', selector: (row: DataTypeWeigheprice) => formatPrice(row.w_price) },
        { name: 'วันขาย', selector: (row: DataTypeWeigheprice) => formatDate(row.r_rubber_date), width: '110px' },
        { name: 'ผู้บันทึก', selector: (row: DataTypeWeigheprice) => row.uadmin, width: '180px' },
        { name: 'วันที่บันทึก', selector: (row: DataTypeWeigheprice) => formatDateTime(row.w_datetime), width: '150px' },
        {
            name: "จัดการ",
            cell: (row: DataTypeWeigheprice) => (
                <>
                    <button onClick={() => { handleEdit(row.w_number); }} className="btn btn-warning btn-sm">แก้ไข</button>
                    &nbsp;
                    <button onClick={() => handleDelete(row.w_number)} className="btn btn-danger btn-sm">ลบ</button>
                </>
            ), center: true, width: '140px'
        },
    ];

    const [data, setData] = useState([]);
    const [editID, setEditID] = useState('');
    const [pending, setPending] = useState(false);
    const [w_weigth, setWweight] = useState('');
    const [u_firstname, setUfirstname] = useState('')
    const [r_number, setRnumber] = useState('');
    const [u_number, setUnumber] = useState('');
    const [rubberprice, setRubberprice] = useState([]);
    const [users, serUsers] = useState([]);
    const [searchuser, setSearchuser] = useState([]);
    const [validated, setValidated] = useState(false);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalRecords, setTotalRecords] = useState(0);

    const fetchData = useCallback(async (r_numberSearch: string, u_firstname: string, page: number, limit: number) => {
        try {
            setPending(true);
            const Data = { r_number: r_numberSearch, u_firstname, page, limit };

            const response = await axios.post(api + "/weightprice/weight", Data);

            if (response.status === 200) {
                const newData = response.data.data.map((item: DataTypeWeigheprice, index: number) => ({
                    ...item, autoID: index + 1
                }));
                setData(newData);
                setTotalRecords(response.data.totalRecords || 0);

            }
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setPending(false);
        }
    }, []);


    const handlerubberpriceChange = useCallback(async () => {
        try {
            const response = await axios.get(api + '/rubberprice')
            if (response.status === 200) {

                setRnumber(response.data.data[0].r_number)
                setRubberprice(response.data.data)

            }

        } catch (error) {
            console.log(error);
        }
    }, [])

    const handleUserschange = useCallback(async () => {
        try {
            const response = await axios.get(api + '/users')
            if (response.status === 200) {

                const uers = response.data.data.map((item: Datatypeusers) => ({
                    value: item.u_number,
                    label: item.username + ' - ' + item.u_share_id
                }))

                serUsers(uers)
                setSearchuser(response.data.data)
            }

        } catch (error) {
            console.log(error);
        }

    }, []);



    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const form = e.currentTarget;
            if (form.checkValidity() === false) {
                e.stopPropagation();
            } else {

                const Data = {
                    w_weigth,
                    r_number,
                    u_number,
                    w_admin: userId
                }

                const apiUrl = editID ? `${api}/weightprice/${editID}` : `${api}/weightprice`
                const response = await (editID ? axios.put(apiUrl, Data) : axios.post(apiUrl, Data));

                if (response.status === 200) {

                    await fetchData(r_number, '', page, limit);
                    await handleReset()

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
                        const response = await axios.delete(`${api}/weightprice/${id}`, {
                            headers: { 'Content-Type': 'application/json' },
                        });

                        if (response.status === 200) {
                            console.log(response.data);
                            await showSuccessAlert(response.data.message)
                            await fetchData(r_number, u_firstname, page, limit);
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

    const handleEdit = async (id: string) => {
        setEditID(id)
        const Data = await data.find((data: DataTypeWeigheprice) => data.w_number === id) || {
            w_weigth: '',
            u_number: '',
            r_number: ''
        };

        if (Data) {
            setWweight(Data.w_weigth)
            setUnumber(Data.u_number)
            setRnumber(Data.r_number)
        }
    }

    const handleReset = async () => {
        setEditID('')
        setWweight('')
        setUnumber('')
        // setUsers({ value: '' });

    }



    const ChangeUsers = (e: SingleValue<Datatypeusers> | null) => setUnumber(e?.value || "");


    useEffect(() => {
        fetchData(r_number, u_firstname, page, limit);
    }, [fetchData, r_number, u_firstname, page, limit]);

    useEffect(() => {
        handlerubberpriceChange()
        handleUserschange()
    }, [handlerubberpriceChange, handleUserschange])

    return (
        <Container fluid>
            <Form noValidate validated={validated} onSubmit={handleSubmit} >
                <Row className="justify-content-center ">
                    <Col className='col-md-7 text-end mb-3'>
                        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                            <Form.Label column sm={3}>
                                รอบขาย/ราคาประมูลยาง
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Select
                                    value={r_number} onChange={(e) => { setRnumber(e.target.value); }} required>
                                    <option value="">เลือกรอบขาย/ราคาประมูลยาง</option>
                                    {rubberprice.map((item: DataTypeWeigheprice, index: number) => (
                                        <option key={index} value={item.r_number}>{format(item.r_rubber_date, 'yyyy/MM/dd') + ' รอบ ' + item.r_around + ' ราคาประมูล ' + item.r_rubber_price}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                            <Form.Label column sm={3}>
                                ชื่อสมาชิก
                            </Form.Label>
                            <Col sm={9}>
                                <Select
                                    instanceId="instanceId"
                                    value={users.find((option: DataTypeWeigheprice) => option.value === u_number) || null}
                                    options={users}
                                    onChange={ChangeUsers}
                                    required
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                            <Form.Label column sm={3}>
                                น้ำหนักยางพาราที่ได้/กิโลกรัม
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control type="number" className="form-control" value={w_weigth} onChange={(e) => setWweight(e.target.value)} />
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={7} className="text-center">
                        <Button type="submit" className='btn btn-primary' >{editID ? 'แก้ไข' : 'เพิ่ม'}</Button> &nbsp;
                        {editID && <Button type="submit" className='btn btn-info' onClick={handleReset}>คืนค่า</Button>}
                    </Col>
                </Row>
            </Form>

            <Row className="justify-content-center mb-4 mt-4">

                <Col md={3}>
                    <Form.Control className="form-control" list="user" placeholder="ค้นหาชื่อสมาชิก" onChange={e => setUfirstname(e.target.value)} />
                    <datalist id="user">
                        {searchuser.map((user: DataTypeWeigheprice) => (
                            <option key={user.u_number} value={user.u_firstname}></option>
                        ))}
                    </datalist>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={12}>
                    <Card>
                        <Card.Body className="shadow">
                            <h3>รายการน้ำหนักยางพาราของสมาชิกที่บันทึกแล้ว</h3>
                            <strong className='text-danger '>***การบันทึกน้ำหนักสามารถกรอกได้ 1 คนต่อ 1 รอบการขายไม่สามารถกรอกข้อมูลการขายซ้ำได้ กรณีกรอกน้ำหนักผิดพลาดสามารถแก้ไขข้อมูลได้ตามรายชื่อสามาชิกด่านล่าง</strong>
                            <DataTable
                                columns={columns}
                                data={data}
                                pagination
                                paginationServer
                                paginationTotalRows={totalRecords}
                                onChangePage={setPage}
                                onChangeRowsPerPage={(newLimit) => {
                                    setLimit(newLimit);
                                    setPage(1); // Reset to page 1 when changing limit
                                }}
                                progressPending={pending}
                            />
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
        </Container>
    )
}
