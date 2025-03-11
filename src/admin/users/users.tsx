// import React from 'react'

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
// import Select from 'react-select';
import { api } from "../../utils/config";
import axios from "axios";
import DataTable from 'react-data-table-component';
import { showErrorAlert, showSuccessAlert } from "../../utils/alertUtils";
import Swal from "sweetalert2";
import Modals from "./modalusers";
import Select, { SingleValue } from 'react-select';

interface DatatypeUsers {
    autoID: number;
    u_title: string;
    u_firstname: string;
    u_lastname: string;
    u_address: string;
    provinces_id: number;
    districts_id: number;
    subdistricts_id: number;
    u_share: string;
    u_status: string;
    u_admin: number;
    u_number: string;
    u_share_id: number;
    username: string;
    u_addressfull: string;
    value: string;
    id_prov: string;
    id_dis: string;
    id_subdis: string;
}

interface Datatypeuser {
    u_number: number;
    u_share_id: number;
    username: string;
}


export default function Users() {

    const [data, setData] = useState<DatatypeUsers[]>([]);
    const [pending, setPending] = useState(true);
    const [editID, setEditID] = useState('');
    const [validated, setValidated] = useState(false);
    // const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState<DatatypeUsers[]>([])
    const [u_number, setUnumber] = useState('');

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);


    const userParams = {
        u_title: '',
        u_firstname: '',
        u_lastname: '',
        u_address: '',
        provinces_id: '',
        districts_id: '',
        subdistricts_id: '',
        u_share: '',
        u_status: '',
        u_admin: 0
    }

    const [userData, setUserData] = useState(userParams);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(api + "/users");
            if (response.status === 200) {
                let newData: DatatypeUsers[] = response.data.data.map((item: Datatypeuser, index: number) => ({
                    ...item,
                    autoID: index + 1
                }));

                if (u_number) {
                    newData = newData.filter((item: DatatypeUsers) => item.u_number === u_number);
                }

                setData(newData);
                setPending(false);
            } else {
                throw new Error("ไม่พบข้อมูล");
            }
        } catch (error) {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "เกิดข้อผิดพลาดที่ไม่รู้จัก";
            showErrorAlert(message);
        }
    }, [u_number]);



    const columns = [
        { name: 'ลำดับ', selector: (row: DatatypeUsers) => row.autoID, width: '65px' },
        { name: 'ID', selector: (row: DatatypeUsers) => row.u_number, width: '135px' },
        { name: 'เลขหุ้น', selector: (row: DatatypeUsers) => row.u_share_id, width: '65px' },
        { name: 'ชื่อ-สกุล', selector: (row: DatatypeUsers) => row.username, width: '175px' },
        { name: 'ที่อยู่', selector: (row: DatatypeUsers) => row.u_addressfull, width: '470px' },
        { name: 'จำนวนหุ้น', selector: (row: DatatypeUsers) => Number(row.u_share).toLocaleString() },
        { name: 'สถานะ', selector: (row: DatatypeUsers) => row.u_status, width: '100px' },
        {
            name: "จัดการ",
            cell: (row: DatatypeUsers) => (
                <>
                    <Button onClick={() => { handleEdit(row.u_number) }} className="btn btn-warning btn-sm">แก้ไข</Button>
                    &nbsp;
                    <Button onClick={() => handleDelete(row.u_number)} className="btn btn-danger btn-sm">ลบ</Button>
                </>
            ), center: true, width: '130px'
        },
    ];

    const usersData = useCallback(async () => {

        try {
            const response = await axios.get(api + "/users");
            if (response.status === 200) {
                const users = [{ value: '', label: '--- เลือกสมาชิก ---' }, ...response.data.data.map((item: Datatypeuser) => ({
                    value: item.u_number,
                    label: item.u_share_id + ' - ' + item.username
                }))];
                setUsers(users);
            }
        } catch (error) {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "เกิดข้อผิดพลาดที่ไม่รู้จัก";
            showErrorAlert(message);
        }
    }, []);

    function ChangeUsers(e: SingleValue<DatatypeUsers>) {
        setUnumber(e ? e.value : '');
    }

    // const testData = {
    //     u_number: '',
    //     u_title: '',
    //     u_firstname: '',
    //     u_lastname: '',
    //     u_address: '',
    //     id_prov: '',
    //     id_dis: '',
    //     id_subdis: '',
    //     u_share: '',
    //     u_status: '',
    //     u_admin: 0,
    //     autoID: 0,
    //     provinces_id: 0,
    //     districts_id: 0,
    //     subdistricts_id: 0,
    //     u_share_id: 0,
    //     username: '',
    //     u_addressfull: '',
    //     value: ''
    // }

    const handleEdit = async (id: string) => {
        try {
            setEditID(id);
            setShow(true);
            const Data = data.find((item: DatatypeUsers) => item.u_number === id);

            if (Data) {
                setUserData({
                    u_title: Data.u_title,
                    u_firstname: Data.u_firstname,
                    u_lastname: Data.u_lastname,
                    u_address: Data.u_address,
                    provinces_id: Data.id_prov,
                    districts_id: Data.id_dis,
                    subdistricts_id: Data.id_subdis,
                    u_share: Data.u_share,
                    u_status: Data.u_status,
                    u_admin: 0
                });
            } else {
                console.log("ไม่พบข้อมูลผู้ใช้ที่ระบุ");
            }
        } catch (error) {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "เกิดข้อผิดพลาดที่ไม่รู้จัก";
            showErrorAlert(message);
        }
    };

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
                        const response = await axios.delete(`${api}/users/${id}`, {
                            headers: { 'Content-Type': 'application/json' },
                        });

                        if (response.status === 200) {
                            console.log(response.data);
                            await showSuccessAlert(response.data.message);
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
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "เกิดข้อผิดพลาดที่ไม่รู้จัก";
            showErrorAlert(message);
        }
    };

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {

            const form = e.currentTarget;
            if (form.checkValidity() === false) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                const apiUrl = editID ? `${api}/users/${editID}` : `${api}/users`;
                const response = await (editID ? axios.put(apiUrl, userData) : axios.post(apiUrl, userData));

                if (response.status === 200) {
                    showSuccessAlert(response.data.message);
                    fetchData();
                    setUserData({
                        u_title: '',
                        u_firstname: '',
                        u_lastname: '',
                        u_address: '',
                        provinces_id: '',
                        districts_id: '',
                        subdistricts_id: '',
                        u_share: '',
                        u_status: '',
                        u_admin: 0
                    });
                    setShow(false);
                }
            }


            setValidated(true);
        } catch (error) {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "เกิดข้อผิดพลาดที่ไม่รู้จัก";
            showErrorAlert(message);
        }
    }, [editID, fetchData, userData]);





    useEffect(() => {
        fetchData()
        usersData()
    }, [fetchData, usersData]);

    const AddForm = () => {
        setEditID('');
        setShow(true)
        setUserData({
            u_title: '',
            u_firstname: '',
            u_lastname: '',
            u_address: '',
            provinces_id: '',
            districts_id: '',
            subdistricts_id: '',
            u_share: '',
            u_status: '',
            u_admin: 1
        });
    };

    return (
        <>
            <Container fluid>
                <Row className="justify-content-md-center">
                    <Col className="col-md-11 text-end">
                        <Button className="btn btn-primary shadow" onClick={AddForm} >เพิ่ม</Button>
                        <hr />
                    </Col>
                    <Col md={6}>
                        <Select className="shadow"
                            instanceId="user-select"
                            value={users.find((option: DatatypeUsers) => option.value === u_number)}
                            options={users}
                            onChange={ChangeUsers}
                            required
                        />

                    </Col>
                    <Col md={11}>
                        <hr />
                        <Card className="shadow">
                            <Card.Body>
                                <DataTable
                                    columns={columns}
                                    data={data}
                                    pagination
                                    progressPending={pending} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Modals editID={editID} handleInputChange={handleInputChange} handleSubmit={handleSubmit}
                userData={userData} show={show} handleClose={handleClose} showModal={false} validated={validated} />
        </>
    )
}
