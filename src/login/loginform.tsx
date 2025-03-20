// import React from 'react'
import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
  Spinner,
  Stack,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/config";

export default function LoginForm() {

  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    u_number: "",
    u_password: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name === "u_number" ? value.toUpperCase() : value,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.stopPropagation();
    } else {
      setLoading(true);

      try {
        const response = await axios.post(`${api}/users/login`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);

          localStorage.setItem("resulte", JSON.stringify(response.data.user));
          navigate("/home");
        }

      } catch (error: unknown) {
        setShowAlert(true);
        if (axios.isAxiosError(error)) {
          setShowMessage(
            error.response?.status === 400
              ? "Username หรือ Password ไม่ถูกต้อง"
              : error.response?.data?.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
          );
        } else {
          setShowMessage(error instanceof Error ? error.message : "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        }
      } finally {
        setLoading(false);
      }
    }

    setValidated(true);
  };



  return (
    <>
      <Container className="h-100">
        <Row className="justify-content-center h-100">
          <Col className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
            <Stack className="mx-auto text-center my-5 mb-3" gap={2}>
              <Image
                src="/img/logo_rubber.png"
                alt="logo"
                width="140"
                className="mx-auto"
              />
            </Stack>
            <Card className="shadow-lg">
              <Card.Body className="p-4">
                <h1 className="fs-4 card-title fw-bold mb-4">
                  ล็อกอินเข้าสู่ระบบ
                </h1>
                <hr></hr>
                {showAlert && <Alert variant="warning"> {showMessage} </Alert>}
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Form.Group as={Col} className="mb-2" md="12">
                      <Form.Label>ชื่อล็อกอิน</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        autoComplete="off"
                        name="u_number"
                        value={formData.u_number}
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        กรุณากรอกชื่อล็อกอิน!
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="12" className="mb-3">
                      <Form.Label>รหัสผ่าน</Form.Label>
                      <Form.Control
                        required
                        type="password"
                        autoComplete="off"
                        name="u_password"
                        value={formData.u_password}
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        กรุณากรอกรหัสผ่าน!
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row className="justify-content-end">
                    <Col md={12} className="text-end">
                      <Button
                        type="submit"
                        className="btn btn-success text-right ml-auto"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            Loading...{" "}
                            <Spinner
                              animation="border"
                              variant="light"
                              size="sm"
                            />
                          </>
                        ) : (
                          "เข้าสู่ระบบ"
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
              <Card.Footer className="py-3 border-0 text-center">
                Copyright &copy; 2024 &mdash; Mr. Apichet Singnakrong
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
