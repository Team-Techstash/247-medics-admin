import { useState, useEffect } from "react";
import { Button, Card, CardBody, Col, Container, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Tooltip, FormGroup } from "reactstrap";
import Breadcrumbs from "CommonElements/Breadcrumbs";
import DataTable from "react-data-table-component";
import { AppointmentManage, AppointmentManagementHeading } from "utils/Constant";
import { useRouter } from "next/router";
import { appointmentService, Appointment } from "../../../services/appointmentService";
import { Info } from "react-feather";
import { ProgressComponent } from "components/Loader";

const AppointmentManagement = () => {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add tooltip state
  const [tooltipOpen, setTooltipOpen] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAdminAppointments({
        status: statusFilter || undefined,
        search: filterText || undefined,
        startDate: dateFilter || undefined
      });
      console.log('Fetched appointments:', data.data);
      setAppointments(data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch appointments. Please try again later.');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTooltip = (id: string) => {
    setTooltipOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter appointments based on search text and date
  const filteredAppointments = Array.isArray(appointments) ? appointments.filter((item) => {
    const matchesSearch = 
      (item.patientId?.email?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
      (item.patientId?.phone?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
      (item.reason?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
      (item.status?.toLowerCase() || '').includes(filterText.toLowerCase());
    
    const matchesDate = !dateFilter || (item.scheduledRange?.start || '').startsWith(dateFilter);
    
    return matchesSearch && matchesDate;
  }) : [];

  // Table columns configuration
  const columns = [
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
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                color: '#0d6efd',
                border: '1px solid rgba(13, 110, 253, 0.2)'
              };
            case 'pending':
              return {
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                color: '#ffc107',
                border: '1px solid rgba(255, 193, 7, 0.2)'
              };
            case 'completed':
              return {
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                color: '#0d6efd',
                border: '1px solid rgba(13, 110, 253, 0.2)'
              };
            case 'cancelled':
              return {
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                color: '#dc3545',
                border: '1px solid rgba(220, 53, 69, 0.2)'
              };
            default:
              return {
                backgroundColor: 'rgba(108, 117, 125, 0.1)',
                color: '#6c757d',
                border: '1px solid rgba(108, 117, 125, 0.2)'
              };
          }
        };

        const statusStyle = getStatusStyle(row.status || '');
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
              {row.status || 'N/A'}
            </span>
            <Tooltip
              placement="top"
              isOpen={tooltipOpen[`status-${row._id}`]}
              target={`status-${row._id}`}
              toggle={() => toggleTooltip(`status-${row._id}`)}
            >
              {row.status || 'N/A'}
            </Tooltip>
          </div>
        );
      },
    },
    {
      name: "Actions",
      width: "205px",
      cell: (row: Appointment) => (
        <div className="d-flex justify-content-center">
          <span 
            id={`info-${row._id}`}
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              if (row._id) {
                router.push(`/dashboard/appointments-management/${row._id}`);
              }
            }}
          >
            <Info size={18} className="text-primary" />
          </span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`info-${row._id}`]}
            target={`info-${row._id}`}
            toggle={() => toggleTooltip(`info-${row._id}`)}
          >
            View Details
          </Tooltip>
        </div>
      ),
    }
  ];

  return (
    <div className="page-body">
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
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="dataTables_filter">
                    <Label>
                      Search:
                      <Input
                        onChange={(e) => setFilterText(e.target.value)}
                        type="search"
                        value={filterText}
                        placeholder="Search appointments..."
                      />
                    </Label>
                  </div>
                  <div className="d-flex gap-3">
                    <FormGroup>
                      <Label>Status:</Label>
                      <Input
                        type="select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All</option>
                        <option value="requested">Requested</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label>Date:</Label>
                      <Input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                      />
                    </FormGroup>
                  </div>
                </div>
                <div className="table-responsive">
                  <DataTable
                    columns={columns}
                    data={filteredAppointments}
                    pagination
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
