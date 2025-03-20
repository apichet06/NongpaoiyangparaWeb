import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPayloadFromToken } from "../../utils/allfunctions";

export default function Memu() {
    const resulteData = JSON.parse(localStorage.getItem("resulte") || "{}") as { u_status?: string };
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
                style={{ backgroundColor: resulteData.u_status === 'admin' ? "#f1f8e9" : "#f7f9f9" }}
                data-bs-theme="black"
                expand="lg"
                fixed="top"
                className={`shadow ${resulteData.u_status === 'admin' ? "navbar-underline" : "navbar-underline-user"}`}
            >
                <Container>
                    <Navbar.Brand as={Link} to="/home" href="#">หน้าหลัก</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {resulteData?.u_status === 'admin' ? (
                                <>
                                    <Nav.Link as={Link} to="/rubberPriceReport" href="#">รายการขายยางประจำเดือน</Nav.Link>
                                    <Nav.Link as={Link} to="/rubberPricehistory" href="#">ประวัติการขายยางพารา</Nav.Link>
                                    <Nav.Link as={Link} to="/shareapercentReport" href="#">รายงานปันผลประจำปี</Nav.Link>
                                    <NavDropdown title="การจัดการ" id="basic-nav-dropdown">
                                        <NavDropdown.Item as={Link} to="/users" href="#">สมาชิก</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/rubberPrice" href="#">ราคาประมูลยางพารา</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/sharePercent" href="#">แบ่งเปอร์เซ้นปันผลหุ้น/หัวตันต่อปี</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/weightprice" href="#">น้ำหนักยางพาราช่างได้</NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/rubberPriceReport-user" href="#">รายการขายยางประจำเดือน</Nav.Link>
                                    <Nav.Link as={Link} to="/rubberPricehistory-user" href="#">ประวัติการขายยางพารา</Nav.Link>
                                    <Nav.Link as={Link} to="/shareapercentReport-user" href="#">รายงานปันผลประจำปี</Nav.Link>
                                </>
                            )}

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
