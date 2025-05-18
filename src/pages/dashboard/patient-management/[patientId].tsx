import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Card, CardBody, Col, Container, Row, Spinner } from "reactstrap";
import Breadcrumbs from "CommonElements/Breadcrumbs";
import { PatientManage, PatientManagementHeading } from "utils/Constant";
import { patientService, Patient } from "../../../services/patientService";

const PatientDetail = () => {
  const router = useRouter();
  const { patientId } = router.query;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!patientId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await patientService.getPatientById(patientId as string);
        setPatient(data);
      } catch (err) {
        console.error('Error fetching patient details:', err);
        setError('Failed to load patient details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [patientId]);

  if (loading) {
    return (
      <div className="page-body">
        <Container fluid={true}>
          <Row>
            <Col sm={12}>
              <Card>
                <CardBody>
                  <div className="text-center">
                    <Spinner color="primary" />
                    <h4 className="mt-2">Loading patient details...</h4>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="page-body">
        <Container fluid={true}>
          <Row>
            <Col sm={12}>
              <Card>
                <CardBody>
                  <div className="text-center">
                    <h4 className="text-danger">{error || 'Patient not found'}</h4>
                    <Button
                      color="primary"
                      className="mt-3"
                      onClick={() => router.push("/dashboard/patient-management")}
                    >
                      Back to Patient List
                    </Button>
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
              onClick={() => router.push("/dashboard/patient-management")}
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
                    <Col md={4} className="mb-3">
                      <div className="detail-item">
                        <h6 className="text-muted mb-1">Patient ID</h6>
                        <p className="mb-0">{patient.data._id}</p>
                      </div>
                      <div className="detail-item mt-3">
                        <h6 className="text-muted mb-1">First Name</h6>
                        <p className="mb-0">{patient.data.firstName}</p>
                      </div>
                      <div className="detail-item mt-3">
                        <h6 className="text-muted mb-1">Last Name</h6>
                        <p className="mb-0">{patient.data.lastName}</p>
                      </div>
                    </Col>
                    <Col md={4} className="mb-3">
                      <div className="detail-item">
                        <h6 className="text-muted mb-1">Phone</h6>
                        <p className="mb-0">{patient.data.phone}</p>
                      </div>
                      <div className="detail-item mt-3">
                        <h6 className="text-muted mb-1">Role</h6>
                        <p className="mb-0">{patient.data.role}</p>
                      </div>
                      <div className="detail-item mt-3">
                        <h6 className="text-muted mb-1">Email</h6>
                        <p className="mb-0">{patient.data.email}</p>
                      </div>
                    </Col>
                    <Col md={4} className="mb-3">
                      <div className="detail-item">
                        <h6 className="text-muted mb-1">Address</h6>
                        <p className="mb-0">
                          {typeof patient.data.address === 'string' 
                            ? patient.data.address 
                            : `${patient.data.address.streetAddress1 || ''} ${patient.data.address.streetAddress2 || ''} ${patient.data.address.city || ''} ${patient.data.address.state || ''} ${patient.data.address.postalCode || ''} ${patient.data.address.country || ''}`.trim()}
                        </p>
                      </div>
                      <div className="detail-item mt-3">
                        <h6 className="text-muted mb-1">Created At</h6>
                        <p className="mb-0">{new Date(patient.data.createdAt).toLocaleString()}</p>
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
