import React, { useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Revenueall = () => {
    let BASE_URL = "http://localhost:5000";
    const [statedate, setstartdate] = useState("");
    const [enddate, setenddate] = useState("");
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Total Revenue',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
    });

    const Getrevenueapi = async () => {
        const url = `${BASE_URL}/erika/getrevenu`;

        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };

        const requestBody = {
            startDate: statedate,
            endDate: enddate
        };

        try {
            console.log("request body", requestBody);
            const response = await axios.post(url, requestBody, { headers });
            console.log("response of revenue api", response.data);

            if (!response.data.error) {
                const revenueData = response.data.data;

                // Prepare data for the chart
                const labels = revenueData.map(item => `${item.year}-${item.month}`);
                const data = revenueData.map(item => item.totalRevenue);

                setChartData({
                    labels: labels,
                    datasets: [{
                        label: 'Total Revenue',
                        data: data,
                        backgroundColor: '#0f7c3f',
                    }]
                });
            }
        } catch (error) {
            console.error("Error fetching revenue:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="right-content w-100">
            <div className="row dashboardBoxWrapperRow">
                <div className="col-md-12">
                    <div className="section-heading mb-4 p-4">
                        <h4 className="font-weight-bold text-primary">View Revenue</h4>
                    </div>

                    <div className="form-container bg-white p-4 shadow-sm ">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="billingClientName">Start Date</label>
                                    <input
                                        type="date"
                                        id="billingClientName"
                                        className="form-control"
                                        onChange={(e) => setstartdate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="billingClientEmail">End Date</label>
                                    <input
                                        type="date"
                                        id="billingClientEmail"
                                        className="form-control"
                                        onChange={(e) => setenddate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-2 d-flex align-items-center mt-3">
                                <Button variant="contained" onClick={Getrevenueapi}>Apply</Button>
                            </div>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="chart-container mt-4">
                        <Bar data={chartData} options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Monthly Revenue',
                                },
                            },
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Revenueall;
