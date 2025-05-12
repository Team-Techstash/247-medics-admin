import { useState } from "react";
import { Button, Card, CardBody, Col, Container, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Tooltip, FormGroup } from "reactstrap";
import Breadcrumbs from "CommonElements/Breadcrumbs";
import DataTable from "react-data-table-component";
import { AppointmentManage, AppointmentManagementHeading } from "utils/Constant";
import { useRouter } from "next/router";

// Define the appointment data type
interface Appointment {
  id: string;
  doctor: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  patient: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  appointmentDateTime: string;
  status: string;
  description: string;
}

const AppointmentManagement = () => {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [appointments] = useState<Appointment[]>([
    {
      id: "APT001",
      doctor: {
        name: "Dr. John Smith",
        email: "john.smith@example.com",
        phone: "+1 234-567-8900",
        location: "123 Medical Center Dr, Suite 100"
      },
      patient: {
        name: "Alice Johnson",
        email: "alice.j@example.com",
        phone: "+1 234-567-8901",
        location: "456 Patient Ave"
      },
      appointmentDateTime: "2024-03-20T10:00:00",
      status: "Upcoming",
      description: "Regular checkup appointment"
    },
    {
      id: "APT002",
      doctor: {
        name: "Dr. Sarah Wilson",
        email: "sarah.w@example.com",
        phone: "+1 234-567-8902",
        location: "789 Health Plaza"
      },
      patient: {
        name: "Bob Brown",
        email: "bob.b@example.com",
        phone: "+1 234-567-8903",
        location: "321 Patient St"
      },
      appointmentDateTime: "2024-03-21T14:30:00",
      status: "Pending",
      description: "Follow-up consultation"
    },
    {
      id: "APT003",
      doctor: {
        name: "Dr. Michael Davis",
        email: "michael.d@example.com",
        phone: "+1 234-567-8904",
        location: "654 Medical Way"
      },
      patient: {
        name: "Carol White",
        email: "carol.w@example.com",
        phone: "+1 234-567-8905",
        location: "987 Patient Blvd"
      },
      appointmentDateTime: "2024-03-22T09:15:00",
      status: "Completed",
      description: "Annual physical examination"
    },
    {
      id: "APT004",
      doctor: {
        name: "Dr. Emily Chen",
        email: "emily.c@example.com",
        phone: "+1 234-567-8906",
        location: "111 Wellness Center"
      },
      patient: {
        name: "David Miller",
        email: "david.m@example.com",
        phone: "+1 234-567-8907",
        location: "222 Health Lane"
      },
      appointmentDateTime: "2024-03-23T11:00:00",
      status: "Cancelled",
      description: "Emergency consultation"
    },
    {
      id: "APT005",
      doctor: {
        name: "Dr. Robert Taylor",
        email: "robert.t@example.com",
        phone: "+1 234-567-8908",
        location: "333 Medical Plaza"
      },
      patient: {
        name: "Emma Wilson",
        email: "emma.w@example.com",
        phone: "+1 234-567-8909",
        location: "444 Care Street"
      },
      appointmentDateTime: "2024-03-24T15:45:00",
      status: "Upcoming",
      description: "Specialist consultation"
    },
    {
      id: "APT006",
      doctor: {
        name: "Dr. Lisa Anderson",
        email: "lisa.a@example.com",
        phone: "+1 234-567-8910",
        location: "555 Health Center"
      },
      patient: {
        name: "Frank Thompson",
        email: "frank.t@example.com",
        phone: "+1 234-567-8911",
        location: "666 Medical Avenue"
      },
      appointmentDateTime: "2024-03-25T09:30:00",
      status: "Pending",
      description: "Post-surgery follow-up"
    },
    {
      id: "APT007",
      doctor: {
        name: "Dr. James Wilson",
        email: "james.w@example.com",
        phone: "+1 234-567-8912",
        location: "777 Wellness Drive"
      },
      patient: {
        name: "Grace Lee",
        email: "grace.l@example.com",
        phone: "+1 234-567-8913",
        location: "888 Health Road"
      },
      appointmentDateTime: "2024-03-26T13:15:00",
      status: "Completed",
      description: "Vaccination appointment"
    },
    {
      id: "APT008",
      doctor: {
        name: "Dr. Patricia Martinez",
        email: "patricia.m@example.com",
        phone: "+1 234-567-8914",
        location: "999 Medical Circle"
      },
      patient: {
        name: "Henry Clark",
        email: "henry.c@example.com",
        phone: "+1 234-567-8915",
        location: "1010 Care Boulevard"
      },
      appointmentDateTime: "2024-03-27T16:00:00",
      status: "Upcoming",
      description: "Dental checkup"
    },
    {
      id: "APT009",
      doctor: {
        name: "Dr. Thomas Brown",
        email: "thomas.b@example.com",
        phone: "+1 234-567-8916",
        location: "1111 Health Street"
      },
      patient: {
        name: "Irene Davis",
        email: "irene.d@example.com",
        phone: "+1 234-567-8917",
        location: "1212 Medical Lane"
      },
      appointmentDateTime: "2024-03-28T10:45:00",
      status: "Cancelled",
      description: "Eye examination"
    },
    {
      id: "APT010",
      doctor: {
        name: "Dr. Jennifer Garcia",
        email: "jennifer.g@example.com",
        phone: "+1 234-567-8918",
        location: "1313 Wellness Avenue"
      },
      patient: {
        name: "Jack Robinson",
        email: "jack.r@example.com",
        phone: "+1 234-567-8919",
        location: "1414 Health Road"
      },
      appointmentDateTime: "2024-03-29T14:30:00",
      status: "Pending",
      description: "Physical therapy session"
    }
  ]);
  
  // Add tooltip state
  const [tooltipOpen, setTooltipOpen] = useState<{ [key: string]: boolean }>({});

  const toggleTooltip = (id: string) => {
    setTooltipOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter appointments based on search text, status, and date
  const filteredAppointments = appointments.filter((item) => {
    const matchesSearch = 
      item.doctor.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.patient.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.status.toLowerCase().includes(filterText.toLowerCase());
    
    const matchesStatus = !statusFilter || item.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesDate = !dateFilter || item.appointmentDateTime.startsWith(dateFilter);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Handle row click to view appointment details
  const handleRowClick = (row: Appointment) => {
    router.push(`/dashboard/appointments-management/${row.id}`);
  };


  // Table columns configuration
  const columns = [
    {
      name: "Doctor Name",
      selector: (row: Appointment) => row.doctor.name,
      sortable: true,
      width: "330px",
      cell: (row: Appointment) => (
        <div>
          <span id={`doctor-${row.id}`}>{row.doctor.name}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`doctor-${row.id}`]}
            target={`doctor-${row.id}`}
            toggle={() => toggleTooltip(`doctor-${row.id}`)}
          >
            {row.doctor.name}
          </Tooltip>
        </div>
      ),
    },
    {
      name: "Patient Name",
      selector: (row: Appointment) => row.patient.name,
      sortable: true,
      width: "330px",
      cell: (row: Appointment) => (
        <div>
          <span id={`patient-${row.id}`}>{row.patient.name}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`patient-${row.id}`]}
            target={`patient-${row.id}`}
            toggle={() => toggleTooltip(`patient-${row.id}`)}
          >
            {row.patient.name}
          </Tooltip>
        </div>
      ),
    },
    {
      name: "Appointment Date/Time",
      selector: (row: Appointment) => row.appointmentDateTime,
      sortable: true,
      width: "330px",
      cell: (row: Appointment) => (
        <div>
          <span id={`datetime-${row.id}`}>
            {new Date(row.appointmentDateTime).toLocaleString()}
          </span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`datetime-${row.id}`]}
            target={`datetime-${row.id}`}
            toggle={() => toggleTooltip(`datetime-${row.id}`)}
          >
            {new Date(row.appointmentDateTime).toLocaleString()}
          </Tooltip>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row: Appointment) => row.status,
      sortable: true,
      width: "305px",
      cell: (row: Appointment) => {
        const getStatusStyle = (status: string) => {
          switch (status.toLowerCase()) {
            case 'upcoming':
              return {
                backgroundColor: 'rgba(25, 135, 84, 0.1)',
                color: '#198754',
                border: '1px solid rgba(25, 135, 84, 0.2)'
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

        const statusStyle = getStatusStyle(row.status);
        return (
          <div>
            <span 
              id={`status-${row.id}`}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'inline-block',
                ...statusStyle
              }}
            >
              {row.status}
            </span>
            <Tooltip
              placement="top"
              isOpen={tooltipOpen[`status-${row.id}`]}
              target={`status-${row.id}`}
              toggle={() => toggleTooltip(`status-${row.id}`)}
            >
              {row.status}
            </Tooltip>
          </div>
        );
      },
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
                        <option value="upcoming">Upcoming</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
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
                    pointerOnHover
                    onRowClicked={handleRowClick}
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
