import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { api } from '../../utils/config';
import axios from 'axios';
import Select, { ActionMeta, SingleValue } from 'react-select';

interface Users {
    u_title: string;
    u_firstname: string;
    u_lastname: string;
    u_address: string;
    provinces_id: string;
    districts_id: string;
    subdistricts_id: string;
    u_share: string;
    u_status: string;
    u_admin: number;
}

interface ModalProps {
    editID: string;
    handleInputChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    userData: Users;
    showModal: boolean;
    handleClose: () => void;
    show: boolean;
    validated: boolean;
}

interface DataTypeProvincesAll {
    id: number;
    name_in_thai: string;
    value: string;
}
interface OptionType {
    value: string;
    label: string;
}

export default function Modals({ editID, validated, handleInputChange, handleSubmit, userData, handleClose, show }: ModalProps) {

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);

    const handleprovinctChange = useCallback(async () => {
        try {
            const response = await axios.get(api + '/provincesAll')
            if (response.status === 200) {

                const province = response.data.data.map((province: DataTypeProvincesAll) => ({
                    value: province.id,
                    label: province.name_in_thai
                }
                ))

                setProvinces(province)
            }

        } catch (error) {
            console.log(error);
        }
    }, [])

    const handleDistrict = useCallback(async (id: string) => {
        try {
            const response = await axios.get(api + '/district/' + id)
            if (response.status === 200) {
                setDistricts(response.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }, [])

    const handleSubDistrict = useCallback(async (id: string) => {

        try {
            const response = await axios.get(api + '/subdistrict/' + id)
            if (response.status === 200) {
                setSubdistricts(response.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }, [])

    const handleDistrictChanges = (e: SingleValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
        void actionMeta; // บังคับ TypeScript ให้ไม่แจ้งเตือน unused variable
        if (!e) return;
        handleDistrict(e.value);
        handleInputChange({ target: { name: "provinces_id", value: e.value } } as React.ChangeEvent<HTMLInputElement>);
        handleSubDistrict("3809");
    };



    const handleSubDistrictChanges = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectdistrict = e.target.value;
        handleSubDistrict(selectdistrict);
        handleInputChange({ target: { name: 'districts_id', value: selectdistrict } } as React.ChangeEvent<HTMLInputElement>);

    };

    const fetchDistrictData = useCallback(async () => {

        try {

            const districtResponse = await axios.get(`${api}/district/${userData.provinces_id}`);
            if (districtResponse.status === 200) {
                const districtData = districtResponse.data.data;
                setDistricts(districtData);
            }
        } catch (error) {
            console.log(error);
        }

    }, [userData.provinces_id]);

    const fetchSubdistrictData = useCallback(async () => {
        try {
            const subdistrictResponse = await axios.get(`${api}/subdistrict/${userData.districts_id}`);
            if (subdistrictResponse.status === 200) {
                const subdistrictData = subdistrictResponse.data.data;
                setSubdistricts(subdistrictData);
            }
        } catch (error) {
            console.log(error);
        }

    }, [userData.districts_id]);



    useEffect(() => {
        handleprovinctChange()
        if (editID) {
            fetchDistrictData();
            fetchSubdistrictData();
        }

    }, [handleprovinctChange, editID, fetchDistrictData, fetchSubdistrictData]);




    return (
        <>
            <Modal
                show={show}
                size="xl"
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>{editID ? "แก้ไขข้อมูลสมาชิก" : "เพิ่มข้อมูลสมาชิก"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>State</Form.Label>
                                <Form.Select defaultValue="คำนำหน้า..." name="u_title" value={userData.u_title} onChange={handleInputChange} required>
                                    <option value="">คำนำหน้า</option>
                                    <option value="นาย">นาย</option>
                                    <option value="นาง">นาง</option>
                                    <option value="นางสาว">นางสาว</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    กรุณาระบุคำนำหน้า.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="validationCustom01">
                                <Form.Label>ชื่อ</Form.Label>
                                <Form.Control
                                    onChange={handleInputChange}
                                    value={userData.u_firstname}
                                    name="u_firstname"
                                    required
                                    type="text"
                                    placeholder="ชื่อ"
                                />
                                <Form.Control.Feedback type="invalid">
                                    กรุณาระบุชื่อ.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="validationCustom02">
                                <Form.Label>สกุล</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="สกุล"
                                    name="u_lastname"
                                    onChange={handleInputChange}
                                    value={userData.u_lastname}
                                />
                                <Form.Control.Feedback type="invalid">
                                    กรุณาระบุนามสกุล.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="12" controlId="validationCustomUsername">
                                <Form.Label>ที่อยู่</Form.Label>
                                <Form.Control as="textarea"
                                    type="text"
                                    name="u_address"
                                    placeholder='เช่น เลขที่ 1 หมู่ 1 บ้านหนองป่าอ้อย'
                                    value={userData.u_address}
                                    onChange={handleInputChange}
                                />
                                <Form.Control.Feedback>
                                    ที่อยู่.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="4" controlId="validationCustom03">
                                <Form.Label>จังหวัด</Form.Label>
                                <Select
                                    instanceId="user-select"
                                    value={provinces.find((option: DataTypeProvincesAll) => option.value === userData.provinces_id)}
                                    onChange={handleDistrictChanges}
                                    options={provinces}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid city.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="validationCustom04">
                                <Form.Label>อำเภอ</Form.Label>
                                <Form.Select defaultValue="อำเภอ..." name='districts_id' value={userData.districts_id} onChange={handleSubDistrictChanges} required>
                                    <option value=''>เลือกอำเภอ</option>
                                    {districts.map((districts: DataTypeProvincesAll) => (
                                        <option key={districts.id} value={districts.id}>{districts.name_in_thai}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid state.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="validationCustom05">
                                <Form.Label>ตำบล</Form.Label>
                                <Form.Select defaultValue="ตำบล..." name='subdistricts_id' value={userData.subdistricts_id} onChange={handleInputChange} required>
                                    <option value=''>เลือกตำบล</option>
                                    {subdistricts.map((subdistricts: DataTypeProvincesAll) => (
                                        <option key={subdistricts.id} value={subdistricts.id}>{subdistricts.name_in_thai}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid zip.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="validationCustom05">
                                <Form.Label>จำนวนหุ้น</Form.Label>
                                <Form.Control type="text"
                                    name="u_share"
                                    value={userData.u_share}
                                    placeholder='เช่น 1000'
                                    onChange={handleInputChange} required />
                                <Form.Control.Feedback type="invalid">
                                    กรุณาระบุจำนวนหุ้น.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="validationCustom05">
                                <Form.Label>สถานะ</Form.Label>
                                <Form.Select defaultValue="คำนำหน้า..." name='u_status' value={userData.u_status} onChange={handleInputChange} required>
                                    <option value="">สถานะ</option>
                                    <option value="admin">ผู้ดูแลระบบ</option>
                                    <option value="user">ผู้ใช้งานทั้วไป</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    กรุณาระบุสถานะ.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Modal.Footer>
                            <Button type="submit" variant="primary">{editID ? "แก้ไข" : "บันทึก"}</Button>
                            <Button variant="secondary" onClick={handleClose}>
                                ยกเลิก
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>

            </Modal>
        </>
    )
}
