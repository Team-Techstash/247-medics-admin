import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardBody, Col, Row, Input, Label, Table, Badge, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays, subDays, format, parse } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Mock summary data
const summaryData = [
  { label: 'Sessions', value: 3985, change: '+5%' },
  { label: 'Total sales', value: '$11,585.29', change: '+0.5%' },
  { label: 'Orders', value: 102, change: '+4%' },
  { label: 'Conversion rate', value: '2.21%', change: '+8%' },
];

// Mock chart data
const chartData = {
  labels: [
    'May 12', 'May 15', 'May 18', 'May 21', 'May 24', 'May 27', 'May 30', 'Jun 2', 'Jun 5', 'Jun 8'
  ],
  datasets: [
    {
      label: 'Sessions',
      data: [150, 130, 140, 145, 160, 200, 170, 220, 180, 120],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4,
      fill: true,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
  },
  maintainAspectRatio: false,
};

// Mock appointments data
const mockAppointments = [
  {
    _id: '1',
    patient: 'John Doe',
    doctor: 'Dr. Smith',
    time: '2025-06-10T10:00:00Z',
    status: 'completed',
    paymentStatus: 'paid',
  },
  {
    _id: '2',
    patient: 'Jane Roe',
    doctor: 'Dr. Johnson',
    time: '2025-06-09T14:30:00Z',
    status: 'pending',
    paymentStatus: 'pending',
  },
  {
    _id: '3',
    patient: 'Alice Smith',
    doctor: 'Dr. Brown',
    time: '2025-06-08T09:00:00Z',
    status: 'cancelled',
    paymentStatus: 'failed',
  },
  {
    _id: '4',
    patient: 'Bob Lee',
    doctor: 'Dr. Davis',
    time: '2025-06-07T16:00:00Z',
    status: 'completed',
    paymentStatus: 'paid',
  },
];

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
];

const statusColors: Record<string, string> = {
  paid: 'success',
  pending: 'warning',
  failed: 'danger',
  completed: 'primary',
  cancelled: 'secondary',
};

const quickRanges = [
  { label: 'Yesterday', range: () => {
      const yesterday = subDays(new Date(), 1);
      return { startDate: yesterday, endDate: yesterday };
    }
  },
  { label: 'Last 7 days', range: () => ({
      startDate: subDays(new Date(), 6),
      endDate: new Date(),
    })
  },
  { label: 'Last 30 days', range: () => ({
      startDate: subDays(new Date(), 29),
      endDate: new Date(),
    })
  },
  { label: 'Last 90 days', range: () => ({
      startDate: subDays(new Date(), 89),
      endDate: new Date(),
    })
  },
  { label: 'Last 365 days', range: () => ({
      startDate: subDays(new Date(), 364),
      endDate: new Date(),
    })
  },
  { label: 'Last Month', range: () => {
      const now = new Date();
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      return { startDate: firstDayLastMonth, endDate: lastDayLastMonth };
    }
  },
  { label: 'Last 12 months', range: () => ({
      startDate: subDays(new Date(), 364),
      endDate: new Date(),
    })
  },
  { label: 'Last Year', range: () => {
      const now = new Date();
      const firstDayLastYear = new Date(now.getFullYear() - 1, 0, 1);
      const lastDayLastYear = new Date(now.getFullYear() - 1, 11, 31);
      return { startDate: firstDayLastYear, endDate: lastDayLastYear };
    }
  },
];

const Dashboard = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [appointments, setAppointments] = useState(mockAppointments);

  // Date range picker state
  const [dateRange, setDateRange] = useState([
    {
      startDate: subDays(new Date(), 29),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [quickDropdownOpen, setQuickDropdownOpen] = useState(false);

  const handleQuickRange = (rangeFn: () => { startDate: Date, endDate: Date }) => {
    setDateRange([{ ...rangeFn(), key: 'selection' }]);
    setQuickDropdownOpen(false);
  };

  // Filter chart data based on date range
  const { startDate, endDate } = dateRange[0];
  // Helper to parse label to date (assumes year 2025 for mock data)
  const parseLabelToDate = (label: string) => parse(label + ', 2025', 'MMM d, yyyy', new Date());
  // Find indices for slicing data
  const startIdx = chartData.labels.findIndex(label => parseLabelToDate(label) >= startDate);
  const endIdx = chartData.labels.findIndex(label => parseLabelToDate(label) > endDate);
  const filteredLabels = chartData.labels.slice(
    startIdx === -1 ? 0 : startIdx,
    endIdx === -1 ? chartData.labels.length : endIdx
  );
  const filteredData = chartData.datasets[0].data.slice(
    startIdx === -1 ? 0 : startIdx,
    endIdx === -1 ? chartData.labels.length : endIdx
  );
  const filteredChartData = {
    ...chartData,
    labels: filteredLabels,
    datasets: [
      {
        ...chartData.datasets[0],
        data: filteredData,
      },
    ],
  };

  // Filter appointments by payment status
  const filteredAppointments = statusFilter
    ? appointments.filter((a) => a.paymentStatus === statusFilter)
    : appointments;

  return (
    <div className="page-body">
      <div className="container-fluid">
        <h2 className="mb-4">Dashboard Overview</h2>
        {/* Summary Cards */}
        <Row className="mb-4">
          {summaryData.map((item) => (
            <Col md={3} sm={6} xs={12} key={item.label}>
              <Card className="h-90">
                <CardBody>
                  <div className="d-flex flex-column align-items-start">
                    <span className="text-muted" style={{ fontSize: '1rem' }}>{item.label}</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{item.value}</span>
                    <span style={{ color: '#28a745', fontSize: '1rem' }}>{item.change}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
        {/* Date Range Picker */}
        <div className="mb-3" style={{ position: 'relative', zIndex: 10 }}>
          <Button onClick={() => setShowDatePicker(!showDatePicker)}>
            {`${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`}
          </Button>
          {showDatePicker && (
            <div
              style={{
                position: 'absolute',
                zIndex: 100,
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                padding: 20,
                minWidth: 340,
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: 12,
              }}
            >
              {/* Quick selection dropdown */}
              <Dropdown isOpen={quickDropdownOpen} toggle={() => setQuickDropdownOpen(!quickDropdownOpen)}>
                <DropdownToggle caret color="light" style={{ width: '100%' }}>
                  Quick Ranges
                </DropdownToggle>
                <DropdownMenu style={{ width: '100%' }}>
                  {quickRanges.map((q) => (
                    <DropdownItem key={q.label} onClick={() => handleQuickRange(q.range)}>
                      {q.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <DateRange
                editableDateInputs={true}
                onChange={(item: any) => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                maxDate={new Date()}
                className="mb-0"
              />
              <Button color="secondary" size="sm" onClick={() => setShowDatePicker(false)} style={{ width: '100%' }}>Close</Button>
            </div>
          )}
        </div>
        {/* Line Chart */}
        <Card className="mb-4">
          <CardBody>
            <h5 className="card-title">Sessions Trend</h5>
            <div style={{ height: '300px' }}>
              <Line data={filteredChartData} options={chartOptions} />
            </div>
          </CardBody>
        </Card>
        {/* Appointments Table */}
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title mb-0">Appointments</h5>
              <div className="d-flex align-items-center gap-2">
                <Label for="statusFilter" className="mb-0 me-2">Payment Status:</Label>
                <Input
                  id="statusFilter"
                  type="select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: 140 }}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Input>
              </div>
            </div>
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length === 0 ? (
                    <tr><td colSpan={5} className="text-center">No appointments found.</td></tr>
                  ) : (
                    filteredAppointments.map((a) => (
                      <tr key={a._id}>
                        <td>{a.patient}</td>
                        <td>{a.doctor}</td>
                        <td>{new Date(a.time).toLocaleString()}</td>
                        <td>
                          <Badge color={statusColors[a.status] || 'secondary'}>{a.status}</Badge>
                        </td>
                        <td>
                          <Badge color={statusColors[a.paymentStatus] || 'secondary'}>{a.paymentStatus}</Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 