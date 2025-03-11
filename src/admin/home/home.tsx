import { api } from "../../utils/config"
import { useCallback, useEffect, useState } from 'react';
import { Chart, ChartOptions, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Loading from "../../utils/loading";

interface MonthData {
    m_number: string;
    m_name: string;
    data: {
        r_around: string;
        r_rubber_price: string;
    }[];
}

Chart.register(...registerables, ChartDataLabels);

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
        data: (number | null)[];
    }[];
}

interface DatatypeYear {
    Year: number;
    value: number;
    label: number;
}

export default function Home() {

    const [s_year, setSyear] = useState(new Date().getFullYear())
    const [DYear, setDYear] = useState([]);

    const [chartData, setChartData] = useState<ChartData>({
        labels: [],
        datasets: []
    });
    const [loading, setLoading] = useState(false);
    const fetchData = useCallback(async () => {
        setLoading(true)
        try {

            const response = await axios.get(api + `/rubberprice/data/chart/${s_year}`); // Adjust the API endpoint if needed
            const data = response.data.data;

            // Sort data by month number
            const sortedData = data.sort((a: MonthData, b: MonthData) =>
                parseInt(a.m_number) - parseInt(b.m_number)
            );

            // Extract labels (month names)
            const labels = sortedData.map((month: MonthData) => month.m_name);

            let maxRounds = 0;
            sortedData.forEach((month: MonthData) => {
                const maxRoundInMonth = month.data.reduce((max, entry) => Math.max(max, parseInt(entry.r_around)), 0);
                maxRounds = Math.max(maxRounds, maxRoundInMonth);
            });

            const getRandomColor = () => {
                const letters = '0123456789ABCDEF';
                let color = '#';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            };

            // Prepare datasets
            const datasets = [];
            for (let round = 1; round <= maxRounds; round++) {
                const backgroundColor = getRandomColor();
                const borderColor = backgroundColor;
                datasets.push({
                    label: `ราคาประมูล รอบที่ ${round}`,
                    backgroundColor: backgroundColor + '95', // Adding transparency
                    borderColor: borderColor,
                    borderWidth: 1,
                    data: sortedData.map((month: MonthData) => {
                        const entry = month.data.find(d => parseInt(d.r_around) === round);
                        return entry ? parseFloat(entry.r_rubber_price) : null;
                    })
                });
            }

            setChartData({
                labels: labels,
                datasets: datasets
            });

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [s_year]);


    const handleYearchange = useCallback(async () => {
        try {
            const response = await axios.get(api + '/rubberprice/data/chartYear')
            if (response.status === 200) {

                const year = response.data.data.map((item: DatatypeYear) => ({
                    value: item.Year,
                    label: item.Year
                }))

                setDYear(year)
            }

        } catch (error) {
            console.log(error);
        }

    }, []);


    useEffect(() => {
        fetchData();
        handleYearchange();
    }, [fetchData, handleYearchange]);

    const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'top',
                formatter: (value: number) => value > 0 ? `฿${value}` : ''
            }
        }
    };

    return (
        <Container className="">
            <Row className="row justify-content-center">
                <Col md={4}>
                    <Form.Select
                        value={s_year} name="s_year"
                        onChange={(e) => setSyear(Number(e.target.value))}
                        className="shadow"
                        required>
                        <option value="">เลือกปีปันผลหุ้น</option>
                        {DYear.map((item: DatatypeYear, index: number) => {
                            return <option key={index} value={item.value}>{item.label}</option>;
                        })}
                    </Form.Select>
                </Col>
                <Col className="col-md-12 mt-5 text-center">
                    {loading ? (
                        <>
                            <Loading />
                        </>
                    ) : (
                        <Card className="shadow">
                            <Card.Body>
                                <h2>ราคาประมูลยางพารา</h2>
                                <Bar data={chartData} options={chartOptions} plugins={[ChartDataLabels]} height="90%" />
                            </Card.Body>
                        </Card>
                    )}

                </Col>
            </Row>
        </Container>
    );
}
