import { useState, useEffect, useRef } from "react";
import { Button, Card, CardBody, Col, Container, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Tooltip, FormGroup } from "reactstrap";
import Breadcrumbs from "CommonElements/Breadcrumbs";
import DataTable from "react-data-table-component";
import { AppointmentManage, AppointmentManagementHeading } from "utils/Constant";
import { useRouter } from "next/router";
import { appointmentService, Appointment, PaginatedResponse } from "../../../services/appointmentService";
import { referenceService, AppointmentStatus, PaymentStatus } from "../../../services/referenceService";
import { ProgressComponent } from "components/Loader";
import { DateRange } from 'react-date-range';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const AppointmentManagement = () => {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage] = useState(20);
  // Add tooltip state
  const [tooltipOpen, setTooltipOpen] = useState<{ [key: string]: boolean }>({});

  // Appointment statuses state
  const [appointmentStatuses, setAppointmentStatuses] = useState<AppointmentStatus[]>([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  
  // Payment statuses state
  const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatus[]>([]);
  const [loadingPaymentStatuses, setLoadingPaymentStatuses] = useState(true);

  // Date range picker state - default to current month
  const [dateRange, setDateRange] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: 'selection',
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateBtnRef = useRef(null);

  // Keep startDate and endDate in YYYY-MM-DD format for API
  const startDate = dateRange[0].startDate ? format(dateRange[0].startDate, 'yyyy-MM-dd') : '';
  const endDate = dateRange[0].endDate ? format(dateRange[0].endDate, 'yyyy-MM-dd') : '';

  // Fetch appointment statuses on component mount
  useEffect(() => {
    fetchReferences();
  }, []);

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, [statusFilter, startDate, endDate, currentPage, filterText]);

  // Close popover on outside click
  useEffect(() => {
    if (!showDatePicker) return;
    function handleClick(event: MouseEvent) {
      if (
        dateBtnRef.current &&
        !(dateBtnRef.current as any).contains(event.target) &&
        document.getElementById('date-range-popover') &&
        !document.getElementById('date-range-popover')!.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showDatePicker]);

  const fetchReferences = async () => {
    try {
      setLoadingStatuses(true);
      setLoadingPaymentStatuses(true);
      
      // Fetch both appointment statuses and payment statuses
      const [appointmentStatusesData, paymentStatusesData] = await Promise.all([
        referenceService.getAppointmentStatuses(),
        referenceService.getPaymentStatuses()
      ]);
      
      setAppointmentStatuses(appointmentStatusesData);
      setPaymentStatuses(paymentStatusesData);
    } catch (err) {
      console.error('Error fetching references:', err);
      // Fallback to default statuses if API fails
      setAppointmentStatuses([
        { id: 1, code: "pending", name: "Pending" },
        { id: 2, code: "confirmed", name: "Confirmed" },
        { id: 3, code: "in-progress", name: "In Progress" },
        { id: 4, code: "cancelled", name: "Cancelled" },
        { id: 5, code: "completed", name: "Completed" },
        { id: 6, code: "expired", name: "Expired" },
      ]);
      setPaymentStatuses([
        { id: 1, code: "unpaid", name: "Unpaid" },
        { id: 2, code: "pending", name: "Pending" },
        { id: 3, code: "paid", name: "Paid" },
        { id: 4, code: "failed", name: "Failed" },
        { id: 5, code: "refunded", name: "Refunded" },
      ]);
    } finally {
      setLoadingStatuses(false);
      setLoadingPaymentStatuses(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: perPage,
        status: statusFilter || undefined,
        search: filterText || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      };
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      const data = await appointmentService.getAdminAppointments(params);
      setAppointments(data.data || []);
      setTotalRows(data.total || 0);
      setError(null);
    } catch (err) {
      setError('Failed to fetch appointments. Please try again later.');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleTooltip = (id: string) => {
    setTooltipOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterText("");
    setStatusFilter("");
    setDateRange([{ startDate: startOfMonth(new Date()), endDate: endOfMonth(new Date()), key: 'selection' }]);
    setCurrentPage(1);
  };

  // Table columns configuration
  const columns = [
    {
      name: "Appointment ID",
      selector: (row: Appointment) => row.readableId || row._id,
      sortable: true,
      width: "180px",
      cell: (row: Appointment) => (
        <div>
          <span 
            id={`readableId-${row._id}`}
            className="text-primary cursor-pointer"
            onClick={() => router.push(`/dashboard/appointments-management/${row._id}`)}
          >
            {row.readableId || row._id}
          </span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`readableId-${row._id}`]}
            target={`readableId-${row._id}`}
            toggle={() => toggleTooltip(`readableId-${row._id}`)}
          >
            Click to view appointment details
          </Tooltip>
        </div>
      ),
    },
    {
      name: "Patient",
      selector: (row: Appointment) => `${row.patientId?.firstName || ''} ${row.patientId?.lastName || ''}`.trim(),
      sortable: true,
      width: "300px",
      cell: (row: Appointment) => {
        const fullName = `${row.patientId?.firstName || ''} ${row.patientId?.lastName || ''}`.trim();
        return (
          <div>
            <span 
              id={`patient-name-${row._id}`}
              className="text-primary cursor-pointer"
              onClick={() => router.push(`/dashboard/patient-management/${row.patientId?._id}?from=appointments`)}
            >
              {fullName || 'N/A'}
            </span>
            <Tooltip
              placement="top"
              isOpen={tooltipOpen[`patient-name-${row._id}`]}
              target={`patient-name-${row._id}`}
              toggle={() => toggleTooltip(`patient-name-${row._id}`)}
            >
              {fullName || 'N/A'}
            </Tooltip>
          </div>
        );
      },
    },
    {
      name: "Doctor",
      selector: (row: Appointment) => row.doctorId ? `${row.doctorId.firstName || ''} ${row.doctorId.lastName || ''}`.trim() : 'N/A',
      sortable: true,
      width: "300px",
      cell: (row: Appointment) => {
        if (!row.doctorId) {
          return <div>N/A</div>;
        }
        const fullName = `${row.doctorId.firstName || ''} ${row.doctorId.lastName || ''}`.trim();
        return (
          <div>
            <span 
              id={`doctor-name-${row._id}`}
              className="text-primary cursor-pointer"
              onClick={() => router.push(`/dashboard/doctor-management/${row.doctorId?._id}?from=appointments`)}
            >
              {fullName || 'N/A'}
            </span>
            <Tooltip
              placement="top"
              isOpen={tooltipOpen[`doctor-name-${row._id}`]}
              target={`doctor-name-${row._id}`}
              toggle={() => toggleTooltip(`doctor-name-${row._id}`)}
            >
              {fullName || 'N/A'}
            </Tooltip>
          </div>
        );
      },
    },
    {
      name: "Appointment Time",
      selector: (row: Appointment) => row.scheduledRange?.start || '',
      sortable: true,
      width: "300px",
      cell: (row: Appointment) => (
        <div>
          <span id={`datetime-${row._id}`}>
            {row.scheduledRange?.start ? new Date(row.scheduledRange.start).toLocaleString() : 'N/A'}
          </span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`datetime-${row._id}`]}
            target={`datetime-${row._id}`}
            toggle={() => toggleTooltip(`datetime-${row._id}`)}
          >
            {row.scheduledRange?.start ? new Date(row.scheduledRange.start).toLocaleString() : 'N/A'}
          </Tooltip>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row: Appointment) => row.status || '',
      sortable: true,
      width: "300px",
      cell: (row: Appointment) => {
        const getStatusStyle = (status: string) => {
          switch ((status || '').toLowerCase()) {
            case 'requested':
              return {
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                border: '1px solid #90caf9'
              };
            case 'pending':
              return {
                backgroundColor: '#fff3e0',
                color: '#f57c00',
                border: '1px solid #ffb74d'
              };
            case 'confirmed':
              return {
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                border: '1px solid #81c784'
              };
            case 'in-progress':
              return {
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                border: '1px solid #90caf9'
              };
            case 'completed':
              return {
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                border: '1px solid #81c784'
              };
            case 'cancelled':
              return {
                backgroundColor: '#ffebee',
                color: '#c62828',
                border: '1px solid #ef9a9a'
              };
            case 'expired':
              return {
                backgroundColor: '#fafafa',
                color: '#9e9e9e',
                border: '1px solid #e0e0e0'
              };
            default:
              return {
                backgroundColor: '#f5f5f5',
                color: '#616161',
                border: '1px solid #e0e0e0'
              };
          }
        };

        // Get the status name from the appointment statuses array
        const getStatusName = (statusCode: string) => {
          const status = appointmentStatuses.find(s => s.code === statusCode);
          return status ? status.name : statusCode;
        };

        const statusStyle = getStatusStyle(row.status || '');
        const statusName = getStatusName(row.status || '');
        
        return (
          <div>
            <span 
              id={`status-${row._id}`}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'inline-block',
                ...statusStyle
              }}
            >
              {statusName || 'N/A'}
            </span>
            <Tooltip
              placement="top"
              isOpen={tooltipOpen[`status-${row._id}`]}
              target={`status-${row._id}`}
              toggle={() => toggleTooltip(`status-${row._id}`)}
            >
              {statusName || 'N/A'}
            </Tooltip>
          </div>
        );
      },
    },
    {
      name: "Payment Status",
      selector: (row: Appointment) => row.paymentStatus || '',
      sortable: true,
      width: "200px",
      cell: (row: Appointment) => {
        if (!row.paymentStatus) return null;
        
        const getPaymentStatusStyle = (status: string) => {
          switch ((status || '').toLowerCase()) {
            case 'paid':
              return {
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                border: '1px solid #81c784'
              };
            case 'pending':
              return {
                backgroundColor: '#fff3e0',
                color: '#f57c00',
                border: '1px solid #ffb74d'
              };
            case 'unpaid':
              return {
                backgroundColor: '#ffebee',
                color: '#c62828',
                border: '1px solid #ef9a9a'
              };
            case 'failed':
              return {
                backgroundColor: '#ffebee',
                color: '#c62828',
                border: '1px solid #ef9a9a'
              };
            case 'refunded':
              return {
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                border: '1px solid #90caf9'
              };
            default:
              return {
                backgroundColor: '#f5f5f5',
                color: '#616161',
                border: '1px solid #e0e0e0'
              };
          }
        };

        // Get the payment status name from the payment statuses array
        const getPaymentStatusName = (statusCode: string) => {
          const status = paymentStatuses.find(s => s.code === statusCode);
          return status ? status.name : statusCode;
        };

        const statusStyle = getPaymentStatusStyle(row.paymentStatus);
        const statusName = getPaymentStatusName(row.paymentStatus);
        
        return (
          <div>
            <span 
              id={`payment-status-${row._id}`}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'inline-block',
                ...statusStyle
              }}
            >
              {statusName}
            </span>
            <Tooltip
              placement="top"
              isOpen={tooltipOpen[`payment-status-${row._id}`]}
              target={`payment-status-${row._id}`}
              toggle={() => toggleTooltip(`payment-status-${row._id}`)}
            >
              {statusName}
            </Tooltip>
          </div>
        );
      },
    }
  ];

  return (
    <div className="page-body" style={{ position: 'relative' }}>
      <Breadcrumbs
        title={AppointmentManage}
        mainTitle={AppointmentManagementHeading}
        parent="Dashboard"
      />
      <Container fluid={true}>
        <Row>
          <Col sm={12}>
            <Card>
              <CardBody>
                {/* FILTERS FLEX CONTAINER */}
                <div
                  className="d-flex flex-wrap align-items-center justify-content-between mb-3"
                  style={{ gap: 16 }}
                >
                  {/* Search */}
                  <div className="d-flex align-items-center mb-2 mb-md-0" style={{ minWidth: 260 }}>
                    <Label className="me-2 mb-0" style={{ whiteSpace: 'nowrap' }}>Search:</Label>
                    <Input
                      onChange={(e) => setFilterText(e.target.value)}
                      type="search"
                      value={filterText}
                      placeholder="Search appointments..."
                      style={{ minWidth: 180 }}
                    />
                  </div>
                  {/* Status, Date Range, Clear */}
                  <div className="d-flex flex-wrap align-items-center gap-3" style={{ minWidth: 400, justifyContent: 'flex-end' }}>
                    {/* Status */}
                    <div className="d-flex align-items-center">
                      {/* <Label className="me-2 mb-0" style={{ whiteSpace: 'nowrap' }}>Status:</Label> */}
                      <Input
                        type="select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ minWidth: 120 }}
                        disabled={loadingStatuses}
                      >
                        <option value="">All</option>
                        {appointmentStatuses.map((status) => (
                          <option key={status.id} value={status.code}>
                            {status.name}
                          </option>
                        ))}
                      </Input>
                    </div>
                    {/* Date Range */}
                    <div className="d-flex align-items-center position-relative">
                      {/* <Label className="me-2 mb-0" style={{ whiteSpace: 'nowrap' }}>Date Range:</Label> */}
                      <Button
                        color="primary"
                        outline
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        style={{ minWidth: 180, fontWeight: 500, borderWidth: 2 }}
                        innerRef={dateBtnRef}
                      >
                        {dateRange[0].startDate && dateRange[0].endDate
                          ? `${format(dateRange[0].startDate, 'MMM d, yyyy')} - ${format(dateRange[0].endDate, 'MMM d, yyyy')}`
                          : 'Select Date Range'}
                      </Button>
                      {showDatePicker && (
                        <>
                          {/* Overlay */}
                          <div
                            style={{
                              position: 'fixed',
                              top: 0,
                              left: 0,
                              width: '100vw',
                              height: '100vh',
                              background: 'rgba(0,0,0,0.15)',
                              zIndex: 1040,
                            }}
                          />
                          {/* Popover */}
                          <div
                            id="date-range-popover"
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: '100%',
                              marginTop: 10,
                              zIndex: 1050,
                              background: '#fff',
                              borderRadius: 16,
                              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                              padding: 20,
                              minWidth: 340,
                              maxWidth: '95vw',
                              maxHeight: '80vh',
                              overflow: 'auto',
                            }}
                          >
                            <DateRange
                              editableDateInputs={true}
                              onChange={(item: any) => setDateRange([item.selection])}
                              moveRangeOnFirstSelection={false}
                              ranges={dateRange}
                              className="mb-0"
                            />
                            <Button color="secondary" size="sm" onClick={() => setShowDatePicker(false)} style={{ width: '100%', marginTop: 8 }}>Close</Button>
                          </div>
                        </>
                      )}
                    </div>
                    {/* Clear Filters */}
                    <Button
                      onClick={clearFilters}
                      style={{ 
                        fontWeight: 500, 
                        minWidth: 120,
                        backgroundColor: '#d63384',
                        borderColor: '#d63384',
                        color: 'white'
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
                <div className="table-responsive">
                  <DataTable
                    columns={columns}
                    data={appointments}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    paginationRowsPerPageOptions={[20]}
                    onChangePage={handlePageChange}
                    highlightOnHover
                    progressPending={loading}
                    progressComponent={<ProgressComponent />}
                    customStyles={{
                      table: {
                        style: {
                          minWidth: '100%',
                        },
                      },
                      cells: {
                        style: {
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        },
                      },
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AppointmentManagement;
