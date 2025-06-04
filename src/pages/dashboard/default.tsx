import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { Card, CardBody, Col, Row } from 'reactstrap';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const Dashboard = () => {
  // Monthly Appointments Data
  const appointmentsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Appointments',
        data: [65, 59, 80, 81, 56, 55],
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  // Payment Statistics Data
  const paymentData = {
    labels: ['Completed', 'Pending', 'Failed'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(255, 99, 132)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Doctor Performance Data
  const doctorPerformanceData = {
    labels: ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis'],
    datasets: [
      {
        label: 'Patients Treated',
        data: [120, 90, 150, 80, 110],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  // Patient Demographics
  const patientDemographicsData = {
    labels: ['0-18', '19-30', '31-45', '46-60', '60+'],
    datasets: [
      {
        label: 'Age Distribution',
        data: [15, 30, 25, 20, 10],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1,
      },
    ],
  };

  // Revenue Trend
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Department Performance
  const departmentData = {
    labels: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology'],
    datasets: [
      {
        label: 'Patient Satisfaction',
        data: [85, 75, 90, 80, 88],
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgb(255, 159, 64)',
        borderWidth: 1,
      },
    ],
  };

  // Doctor Skills Radar
  const doctorSkillsData = {
    labels: ['Patient Care', 'Technical Skills', 'Communication', 'Efficiency', 'Research'],
    datasets: [
      {
        label: 'Dr. Smith',
        data: [90, 85, 88, 92, 75],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="page-body">
      <div className="container-fluid">
        <h2 className="mb-4">Dashboard Overview</h2>
        <Row>
          <Col md={6} className="mb-4">
            <Card>
              <CardBody>
                <h5 className="card-title">Monthly Appointments</h5>
                <div style={{ height: '300px' }}>
                  <Line data={appointmentsData} options={chartOptions} />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card>
              <CardBody>
                <h5 className="card-title">Payment Statistics</h5>
                <div style={{ height: '300px' }}>
                  <Doughnut data={paymentData} options={chartOptions} />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card>
              <CardBody>
                <h5 className="card-title">Doctor Performance</h5>
                <div style={{ height: '300px' }}>
                  <Bar data={doctorPerformanceData} options={chartOptions} />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card>
              <CardBody>
                <h5 className="card-title">Patient Demographics</h5>
                <div style={{ height: '300px' }}>
                  <Bar data={patientDemographicsData} options={chartOptions} />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card>
              <CardBody>
                <h5 className="card-title">Revenue Trend</h5>
                <div style={{ height: '300px' }}>
                  <Line data={revenueData} options={chartOptions} />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card>
              <CardBody>
                <h5 className="card-title">Department Performance</h5>
                <div style={{ height: '300px' }}>
                  <Bar data={departmentData} options={chartOptions} />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card>
              <CardBody>
                <h5 className="card-title">Doctor Skills Assessment</h5>
                <div style={{ height: '300px' }}>
                  <Radar data={doctorSkillsData} options={chartOptions} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard; 