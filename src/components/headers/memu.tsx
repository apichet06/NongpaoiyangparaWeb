
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPayloadFromToken } from "../../utils/allfunctions";

export default function Memu() {
    //   const resulteData: any = JSON.parse(localStorage.getItem("resulte") || "{}");
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    const logout = () => {
        localStorage.removeItem("resulte");
        localStorage.removeItem("token");
        navigate("/");
    };
    useEffect(() => {
        setUsername(getPayloadFromToken(localStorage.getItem('token') || '')?.username || '');
    }, []);





    return (
        <>
            <Navbar
                collapseOnSelect
                // bg="secondary"
                style={{ backgroundColor: "#f1f8e9" }}
                data-bs-theme="black"
                expand="lg"
                fixed="top"
                className="shadow navbar-underline"
            >
                <Container>
                    <Navbar.Brand as={Link} to="/home">หน้าหลัก</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/rubberPriceReport">รายการขายยางประจำเดือน</Nav.Link>
                            <Nav.Link as={Link} to="/rubberPricehistory">ประวัติการขายยางพารา</Nav.Link>
                            <Nav.Link as={Link} to="/shareapercentReport">รายงานปันผลประจำปี</Nav.Link>
                            <NavDropdown title="การจัดการ" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/users"> สมาชิก </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/rubberPrice">ราคาประมูลยางพารา</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/sharePercent">
                                    แบ่งเปอร์เซ้นปันผลหุ้น/หัวตันต่อปี
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/weightprice">
                                    น้ำหนักยางพาราช่างได้
                                </NavDropdown.Item>

                            </NavDropdown>

                        </Nav>
                        <Nav>
                            <Nav.Link>{username}</Nav.Link>
                            <Nav.Link eventKey={2} onClick={logout}>
                                ออกจากระบบ
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>

    )
}
