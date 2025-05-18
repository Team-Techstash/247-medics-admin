import { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row, Button } from "reactstrap";
import Breadcrumbs from "CommonElements/Breadcrumbs";
import { DoctorManage, DoctorManagementHeading } from "utils/Constant";
import { useRouter } from "next/router";
import { doctorService } from "@/services/doctorService";
import { appointmentService } from "@/services/appointmentService";
import type { Doctor } from "@/services/doctorService";
import type { Appointment } from "@/services/appointmentService";

const DoctorDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (typeof id === 'string') {
        try {
          setLoading(true);
          const [doctorResponse, appointmentsResponse] = await Promise.all([
            doctorService.getDoctorById(id),
            appointmentService.getAdminAppointments({ doctorId: id, limit: 5 })
          ]);
          setDoctorData(doctorResponse);
          setAppointments(appointmentsResponse.data);
          setError(null);
        } catch (err: any) {
          setError(err.response?.data?.message || "Failed to fetch data");
          setDoctorData(null);
          setAppointments([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id]);

  if (!id) {
    return null; // Return null on initial render when id is undefined
  }

  if (loading) {
    return (
      <div className="page-body">
        <Container fluid={true}>
          <Row>
            <Col sm={12}>
              <div className="text-center">Loading...</div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-body">
        <Container fluid={true}>
          <Row>
            <Col sm={12}>
              <div className="text-center text-danger">{error}</div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (!doctorData) {
    return (
      <div className="page-body">
        <Container fluid={true}>
          <Row>
            <Col sm={12}>
              <div className="text-center">No doctor data available</div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-body">
      <Breadcrumbs
        title={DoctorManage}
        mainTitle={DoctorManagementHeading}
        parent="Dashboard"
      />
      <Container fluid={true}>
        <Row className="mb-4">
          <Col sm={12}>
            <Button 
              color="secondary" 
              onClick={() => router.push('/dashboard/doctor-management')}
            >
              Back to Doctor List
            </Button>
          </Col>
        </Row>
        <Row>
          {/* Doctor Information Card */}
          <Col sm={12}>
            <Card className="mb-4">
              <CardBody>
                <h4 className="mb-4">Doctor Information</h4>
                <Row>
                  <Col md={4}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Full Name:</label>
                      <p>{`${doctorData?.data.firstName} ${doctorData?.data.lastName}`}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Email:</label>
                      <p>{doctorData?.data.email}</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Phone:</label>
                      <p>{doctorData?.data.phone}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">City:</label>
                      <p>{doctorData?.data.address?.city}</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Country:</label>
                      <p>{doctorData?.data.address?.country}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Street Address:</label>
                      <p>{doctorData?.data.address?.streetAddress1}</p>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          {/* Emergency Contact Card */}
          <Col sm={12}>
            <Card className="mb-4">
              <CardBody>
                <h4 className="mb-4">Emergency Contact</h4>
                <Row>
                  <Col md={4}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Full Name:</label>
                      <p>{doctorData?.data.docProfile?.emergencyContact.fullName}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Relation:</label>
                      <p>{doctorData?.data.docProfile?.emergencyContact.relation}</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Phone:</label>
                      <p>{doctorData?.data.docProfile?.emergencyContact.phone}</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Email:</label>
                      <p>{doctorData?.data.docProfile?.emergencyContact.email}</p>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          {/* Regulatory Details Card */}
          <Col sm={12}>
            <Card className="mb-4">
              <CardBody>
                <h4 className="mb-4">Regulatory Details</h4>
                <Row>
                  <Col md={4}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Authority Name:</label>
                      <p>{doctorData?.data.docProfile?.regulatoryDetails.authorityName}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Registration Number:</label>
                      <p>{doctorData?.data.docProfile?.regulatoryDetails.registrationNumber}</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">On Specialist Register:</label>
                      <p>{doctorData?.data.docProfile?.regulatoryDetails.onSpecialistRegister ? 'Yes' : 'No'}</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Allow Status Verification:</label>
                      <p>{doctorData?.data.docProfile?.regulatoryDetails.allowStatusVerification ? 'Yes' : 'No'}</p>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DoctorDetails; 