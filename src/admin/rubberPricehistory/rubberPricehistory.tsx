// import React from 'react'

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../utils/config";
import { formatDate, formatDateTime, formatPrice } from "../../utils/allfunctions";
import DataTable from "react-data-table-component";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

interface DatatypeRupperHistory {
    w_number: string;
    r_rubber_date: Date;
    r_around: number;
    w_weigth: number;
    r_rubber_price: number;
    w_price: number;
    username: string;
    uadmin: string;
    w_datetime: Date;
    r_number: string;
    u_number: string;
    u_firstname: string;
}

export default function RubberPricehistory() {

    const columns = [
        { name: 'ID', selector: (row: DatatypeRupperHistory) => row.w_number },
        { name: 'ปี/เดือน/วัน', selector: (row: DatatypeRupperHistory) => formatDate(row.r_rubber_date) },
        { name: 'รอบขาย', selector: (row: DatatypeRupperHistory) => row.r_around },
        { name: 'น้ำหนัก', selector: (row: DatatypeRupperHistory) => Number(row.w_weigth).toLocaleString() },
        { name: 'ราคาประมูลยางพารา', selector: (row: DatatypeRupperHistory) => formatPrice(row.r_rubber_price) },
        { name: 'จำนวนเงิน', selector: (row: DatatypeRupperHistory) => formatPrice(row.w_price) },
        { name: 'สมาชิก', selector: (row: DatatypeRupperHistory) => row.username, width: '175px' },
        { name: 'ผู้บันทึก', selector: (row: DatatypeRupperHistory) => row.uadmin, width: '175px' },
        { name: 'วันที่บันทึก', selector: (row: DatatypeRupperHistory) => formatDateTime(row.w_datetime), width: '175px' },
    ];

    const [data, setData] = useState([]);
    const [pending, setPending] = useState(false); // เปลี่ยนค่าเริ่มต้นเป็น false
    const [rubberprice, setRubberprice] = useState([]);
    const [u_firstname, setUfirstname] = useState('');
    const [r_number, setRnumber] = useState('');
    const [users, setUsers] = useState([]);

    const fetchRubberPrice = useCallback(async () => {
        try {
            const response = await axios.get(api + '/rubberprice');
            if (response.status === 200) {
                setRubberprice(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    const showData = async () => {
        if (!r_number || !u_firstname) return;

        setPending(true);
        try {
            const Data = { r_number, u_firstname };
            const response = await axios.post(api + "/weightprice/weight", Data);
            if (response.status === 200) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setPending(false);
        }
    };

    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get(api + "/users");
            if (response.status === 200) {
                setUsers(response.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchRubberPrice();
    }, [fetchUsers, fetchRubberPrice]);


    const dateSearch = (rubberprice.filter((item: DatatypeRupperHistory) => item.r_number === r_number) as DatatypeRupperHistory[]) || [{ r_rubber_date: '' }];


    const downloadExcelFile = async () => {
        try {
            const Data = { r_number, u_firstname };
            const response = await axios.post(api + "/weightprice/Export", Data, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ประวัติการขายยางพาราทั้งหมด ${dateSearch.length > 0 ? 'ประจำรอบ ' + formatDate(dateSearch[0].r_rubber_date) : ''} ${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading Excel file:', error);
        }
    };


    return (
        <Container className="mb-5">
            <Row className="justify-content-center">
                <Col className="col-md-3 mt-md-5 mt-lg-5 mt-sm-5">
                    <Form.Select className="shadow" onChange={(e) => setRnumber(e.target.value)} required>
                        <option value="">เลือกรอบขาย/ราคาประมูลยาง</option>
                        {rubberprice.map((item: DatatypeRupperHistory) => (
                            <option key={item.r_number} value={item.r_number}>
                                {formatDate(item.r_rubber_date) + ' รอบ ' + item.r_around + ' ราคาประมูล ' + item.r_rubber_price}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col className="col-md-3 mt-md-5 mt-lg-5 mt-sm-2">
                    <Form.Control className="shadow" list="user" placeholder="ค้นหาชื่อสมาชิก" onChange={e => setUfirstname(e.target.value)} />
                    <datalist id="user">
                        {users.map((user: DatatypeRupperHistory) => (
                            <option key={user.u_number} value={user.u_firstname}></option>
                        ))}
                    </datalist>
                </Col>
                <Col className="col-md-1 mt-md-5 mt-lg-5 mt-sm-2 col-sm-12 text-center">
                    <Button className="shadow" onClick={showData}>ค้นหา</Button>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col className="col-md-12 mt-5">
                    <hr />
                    <Row>
                        <Col md={7}>
                            <h4>ประวัติการขายยางพาราทั้งหมด {dateSearch.length > 0 ? 'ประจำรอบ ' + formatDate(dateSearch[0].r_rubber_date) : ''}</h4>
                        </Col>
                        <Col md={5} className="text-end">
                            <Button className="btn btn-sm btn-secondary shadow" onClick={downloadExcelFile}>ออกรายงาน Excel</Button>
                        </Col>

                    </Row>
                    <hr />
                    <Card>
                        <Card.Body className="shadow">
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
