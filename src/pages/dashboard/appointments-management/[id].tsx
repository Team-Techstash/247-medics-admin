import { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "CommonElements/Breadcrumbs";
import { AppointmentManage, AppointmentManagementHeading } from "utils/Constant";
import { useRouter } from "next/router";

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

const AppointmentDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    // In a real application, this would be an API call
    // For now, we'll use the sample data
    const sampleAppointments: Appointment[] = [
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
    ];

    const foundAppointment = sampleAppointments.find(apt => apt.id === id);
    if (foundAppointment) {
      setAppointment(foundAppointment);
    }
  }, [id]);

  if (!appointment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-body" style={{ transition: 'none' }}>
      <Breadcrumbs
        title={AppointmentManage}
        mainTitle={AppointmentManagementHeading}
        parent="Dashboard"
      />
      <Container fluid={true}>
        <Row className="mb-4">
          <Col sm={12}>
            <Button 
              color="secondary" 
              onClick={() => router.push('/dashboard/appointments-management')}
            >
              Back to Appointment List
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Card style={{ transition: 'none' }} className="mb-4">
              <CardBody style={{ transition: 'none' }}>
                <h4 className="mb-4">Doctor Information</h4>
                <div className="mb-3" style={{ transition: 'none' }}>
                  <strong>Name:</strong> {appointment.doctor.name}
                </div>
                <div className="mb-3" style={{ transition: 'none' }}>
                  <strong>Email:</strong> {appointment.doctor.email}
                </div>
                <div className="mb-3" style={{ transition: 'none' }}>
                  <strong>Phone:</strong> {appointment.doctor.phone}
                </div>
                <div className="mb-3" style={{ transition: 'none' }}>
                  <strong>Location:</strong> {appointment.doctor.location}
                </div>
              </CardBody>
            </Card>

            <Card style={{ transition: 'none' }} className="mb-4">
              <CardBody style={{ transition: 'none' }}>
                <h4 className="mb-4">Patient Information</h4>
                <div className="mb-3" style={{ transition: 'none' }}>
                  <strong>Name:</strong> {appointment.patient.name}
                </div>
                <div className="mb-3" style={{ transition: 'none' }}>
                  <strong>Email:</strong> {appointment.patient.email}
                </div>
                <div className="mb-3" style={{ transition: 'none' }}>
                  <strong>Phone:</strong> {appointment.patient.phone}
                </div>
                <div className="mb-3" style={{ transition: 'none' }}>
                  <strong>Location:</strong> {appointment.patient.location}
                </div>
              </CardBody>
            </Card>

            <Card style={{ transition: 'none' }}>
              <CardBody style={{ transition: 'none' }}>
                <h4 className="mb-4">Appointment Details</h4>
                <div className="mb-3" style={{ transition: 'none' }}>
                  <strong>Date/Time:</strong>{" "}
                  {new Date(appointment.appointmentDateTime).toLocaleString()}
                </div>
                <div className="mb-3" style={{ transition: 'none' }}>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      display: 'inline-block',
                      transition: 'none',
                      ...(() => {
                        switch (appointment.status.toLowerCase()) {
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
                      })()
                    }}
                  >
                    {appointment.status}
                  </span>
                </div>
                <div className="mb-3" style={{ transition: 'none' }}>
                  <strong>Description:</strong>
                  <p className="mt-2" style={{ transition: 'none' }}>{appointment.description}</p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AppointmentDetails; 