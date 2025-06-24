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
import { adminService, DashboardStats } from '../../services/adminService';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/router';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
  {
    label: 'Today',
    range: () => {
      const today = new Date();
      return { startDate: today, endDate: today };
    },
    timeFilter: 'today',
  },
  {
    label: 'Yesterday',
    range: () => {
      const yesterday = subDays(new Date(), 1);
      return { startDate: yesterday, endDate: yesterday };
    },
    timeFilter: 'yesterday',
  },
  {
    label: 'This Week',
    range: () => {
      const now = new Date();
      const firstDayOfWeek = new Date(now);
      firstDayOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as first day
      return { startDate: firstDayOfWeek, endDate: now };
    },
    timeFilter: 'thisWeek',
  },
  {
    label: 'This Month',
    range: () => {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: firstDayOfMonth, endDate: now };
    },
    timeFilter: 'thisMonth',
  },
  {
    label: 'Last Month',
    range: () => {
      const now = new Date();
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      return { startDate: firstDayLastMonth, endDate: lastDayLastMonth };
    },
    timeFilter: 'lastMonth',
  },
];

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
  },
  maintainAspectRatio: false,
};

const Dashboard = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/authentication/login');
    }
  }, [user, router]);

  const [statusFilter, setStatusFilter] = useState('');
  const [appointments, setAppointments] = useState(mockAppointments);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  const [timeFilter, setTimeFilter] = useState('custom');

  // Fetch dashboard stats from API
  const fetchDashboardStats = async (startDate: Date, endDate: Date, filter: string) => {
    try {
      setLoading(true);
      setError(null);
      const startDateStr = format(startDate, 'yyyy-MM-dd');
      const endDateStr = format(endDate, 'yyyy-MM-dd');
      const data = await adminService.getDashboardStats(startDateStr, endDateStr, filter);
      setDashboardStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const { startDate, endDate } = dateRange[0];
    fetchDashboardStats(startDate, endDate, timeFilter);
  }, []);

  const handleQuickRange = (rangeFn: () => { startDate: Date, endDate: Date }, filter: string) => {
    const newRange = rangeFn();
    setDateRange([{ ...newRange, key: 'selection' }]);
    setTimeFilter(filter);
    setQuickDropdownOpen(false);
    
    // Fetch new data with the selected range
    fetchDashboardStats(newRange.startDate, newRange.endDate, filter);
  };

  const handleDateRangeChange = (item: any) => {
    setDateRange([item.selection]);
    setTimeFilter('custom');
    
    // Fetch new data with the custom range
    const { startDate, endDate } = item.selection;
    fetchDashboardStats(startDate, endDate, 'custom');
  };

  // Prepare chart data from API response
  const getChartData = () => {
    if (!dashboardStats?.appointmentTrends) {
      return {
        labels: [],
        datasets: [{
          label: 'Appointments',
          data: [],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true,
        }],
      };
    }

    const labels = dashboardStats.appointmentTrends.map((trend: { _id: string; count: number }) => trend._id);
    const data = dashboardStats.appointmentTrends.map((trend: { _id: string; count: number }) => trend.count);

    return {
      labels,
      datasets: [{
        label: 'Appointments',
        data,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      }],
    };
  };

  // Filter appointments by payment status
  const filteredAppointments = statusFilter
    ? appointments.filter((a) => a.paymentStatus === statusFilter)
    : appointments;

  const { startDate, endDate } = dateRange[0];

  return (
    <div className="page-body">
      <div className="container-fluid">
        <h2 className="mb-4">Dashboard Overview</h2>
        
        {/* Loading and Error States */}
        {loading && (
          <div className="text-center mb-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        {dashboardStats && (
          <Row className="mb-4">
            <Col md={3} sm={6} xs={12}>
              <Card className="h-90">
                <CardBody>
                  <div className="d-flex flex-column align-items-start">
                    <span className="text-muted" style={{ fontSize: '1rem' }}>Total Appointments</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{dashboardStats.totalAppointments}</span>
                    <span style={{ color: '#28a745', fontSize: '1rem' }}>+5%</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md={3} sm={6} xs={12}>
              <Card className="h-90">
                <CardBody>
                  <div className="d-flex flex-column align-items-start">
                    <span className="text-muted" style={{ fontSize: '1rem' }}>Net Revenue</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>${dashboardStats.netRevenue}</span>
                    <span style={{ color: '#28a745', fontSize: '1rem' }}>+0.5%</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md={3} sm={6} xs={12}>
              <Card className="h-90">
                <CardBody>
                  <div className="d-flex flex-column align-items-start">
                    <span className="text-muted" style={{ fontSize: '1rem' }}>Profit</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>${dashboardStats.profit}</span>
                    <span style={{ color: '#28a745', fontSize: '1rem' }}>+4%</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md={3} sm={6} xs={12}>
              <Card className="h-90">
                <CardBody>
                  <div className="d-flex flex-column align-items-start">
                    <span className="text-muted" style={{ fontSize: '1rem' }}>Doctors Onboarded</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{dashboardStats.doctorOnBoarded}</span>
                    <span style={{ color: '#28a745', fontSize: '1rem' }}>+2%</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {/* Date Range Picker */}
        <div className="mb-3" style={{ position: 'relative', zIndex: 10 }}>
          <Button onClick={() => setShowDatePicker(!showDatePicker)}>
            {`${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`}
          </Button>
          {showDatePicker && (
            <div
              style={{
                position: 'absolute',
                top: 48,
                left: 0,
                zIndex: 100,
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.1)',
                padding: 20,
                minWidth: 340,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: 12,
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              {/* Quick selection dropdown */}
              <Dropdown isOpen={quickDropdownOpen} toggle={() => setQuickDropdownOpen(!quickDropdownOpen)}>
                <DropdownToggle caret color="light" style={{ width: '100%' }}>
                  Quick Ranges
                </DropdownToggle>
                <DropdownMenu style={{ width: '100%' }}>
                  {quickRanges.map((q) => (
                    <DropdownItem key={q.label} onClick={() => handleQuickRange(q.range, q.timeFilter)}>
                      {q.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <DateRange
                editableDateInputs={true}
                onChange={handleDateRangeChange}
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
            <h5 className="card-title">Appointments Trend</h5>
            <div style={{ height: '300px' }}>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <Line data={getChartData()} options={chartOptions} />
              )}
            </div>
          </CardBody>
        </Card>

        {/* Appointments Table */}
        {/* <Card>
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
        </Card> */}
      </div>
    </div>
  );
};

export default Dashboard; 