import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "CommonElements/Breadcrumbs";
import { PatientManage, PatientManagementHeading } from "utils/Constant";

interface Patient {
  patientId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  location: string;
}

const PatientDetail = () => {
  const router = useRouter();
  const { patientId } = router.query;
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    // In a real application, this would be an API call
    // For now, we'll simulate getting the patient data
    const dummyPatients: Patient[] = [
      {
        patientId: "PAT001",
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1 234-567-8900",
        address: "123 Medical Center Dr, Suite 100",
        gender: "Male",
        location: "New York, USA",
      },
      {
        patientId: "PAT002",
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        phone: "+1 234-567-8901",
        address: "456 Health Plaza, Suite 200",
        gender: "Female",
        location: "Los Angeles, USA",
      },
      {
        patientId: "PAT003",
        name: "Michael Brown",
        email: "michael.brown@example.com",
        phone: "+1 234-567-8902",
        address: "789 Medical Way, Unit 300",
        gender: "Male",
        location: "Chicago, USA",
      },
      {
        patientId: "PAT004",
        name: "Emily Davis",
        email: "emily.davis@example.com",
        phone: "+1 234-567-8903",
        address: "321 Healthcare Blvd, Suite 400",
        gender: "Female",
        location: "Houston, USA",
      },
      {
        patientId: "PAT005",
        name: "Robert Wilson",
        email: "robert.wilson@example.com",
        phone: "+1 234-567-8904",
        address: "654 Medical Circle, Unit 500",
        gender: "Male",
        location: "Phoenix, USA",
      },
      {
        patientId: "PAT006",
        name: "Lisa Anderson",
        email: "lisa.anderson@example.com",
        phone: "+1 234-567-8905",
        address: "987 Health Street, Apt 600",
        gender: "Female",
        location: "Philadelphia, USA",
      },
      {
        patientId: "PAT007",
        name: "David Martinez",
        email: "david.martinez@example.com",
        phone: "+1 234-567-8906",
        address: "741 Medical Lane, Suite 700",
        gender: "Male",
        location: "San Antonio, USA",
      },
      {
        patientId: "PAT008",
        name: "Jennifer Taylor",
        email: "jennifer.taylor@example.com",
        phone: "+1 234-567-8907",
        address: "852 Healthcare Road, Unit 800",
        gender: "Female",
        location: "San Diego, USA",
      },
      {
        patientId: "PAT009",
        name: "James Thomas",
        email: "james.thomas@example.com",
        phone: "+1 234-567-8908",
        address: "963 Medical Avenue, Suite 900",
        gender: "Male",
        location: "Dallas, USA",
      },
      {
        patientId: "PAT010",
        name: "Mary Garcia",
        email: "mary.garcia@example.com",
        phone: "+1 234-567-8909",
        address: "159 Health Boulevard, Apt 1000",
        gender: "Female",
        location: "San Jose, USA",
      },
    ];

    if (patientId) {
      const foundPatient = dummyPatients.find((p) => p.patientId === patientId);
      setPatient(foundPatient || null);
    }
  }, [patientId]);

  if (!patient) {
    return (
      <div className="page-body">
        <Container fluid={true}>
          <Row>
            <Col sm={12}>
              <Card>
                <CardBody>
                  <div className="text-center">
                    <h4>Patient not found</h4>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-body">
      <Breadcrumbs
        title={PatientManage}
        mainTitle={PatientManagementHeading}
        parent="Dashboard"
      />
      <Container fluid={true}>
      <Row className="mb-4">
                    <Col sm={12}>
                      <Button
                        color="secondary"
                        onClick={() =>
                          router.push("/dashboard/patient-management")
                        }
                      >
                        Back to Patient List
                      </Button>
                    </Col>
                  </Row>
        <Row>
          <Col sm={12}>
            <Card>
              <CardBody>
                <div className="patient-details">
                  <h4 className="mb-4">Patient Information</h4>
                  <Row>
                    <Col sm={6} className="mb-3">
                      <div className="detail-item">
                        <h6 className="text-muted mb-1">Patient ID</h6>
                        <p className="mb-0">{patient.patientId}</p>
                      </div>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <div className="detail-item">
                        <h6 className="text-muted mb-1">Full Name</h6>
                        <p className="mb-0">{patient.name}</p>
                      </div>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <div className="detail-item">
                        <h6 className="text-muted mb-1">Email</h6>
                        <p className="mb-0">{patient.email}</p>
                      </div>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <div className="detail-item">
                        <h6 className="text-muted mb-1">Phone</h6>
                        <p className="mb-0">{patient.phone}</p>
                      </div>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <div className="detail-item">
                        <h6 className="text-muted mb-1">Gender</h6>
                        <p className="mb-0">{patient.gender}</p>
                      </div>
                    </Col>
                    <Col sm={6} className="mb-3">
                      <div className="detail-item">
                        <h6 className="text-muted mb-1">Location</h6>
                        <p className="mb-0">{patient.location}</p>
                      </div>
                    </Col>
                    <Col sm={12} className="mb-3">
                      <div className="detail-item">
                        <h6 className="text-muted mb-1">Address</h6>
                        <p className="mb-0">{patient.address}</p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PatientDetail;
