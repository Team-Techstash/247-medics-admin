import { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row, Button, Modal, ModalHeader, ModalBody, Alert, Input, FormGroup, Label, Spinner } from "reactstrap";
import Breadcrumbs from "CommonElements/Breadcrumbs";
import { DoctorManage, DoctorManagementHeading } from "utils/Constant";
import { useRouter } from "next/router";
import { doctorService } from "@/services/doctorService";
import { appointmentService } from "@/services/appointmentService";
import { reviewService } from "@/services/reviewService";
import type { Doctor } from "@/services/doctorService";
import type { Appointment } from "@/services/appointmentService";
import type { Review } from "@/services/reviewService";
import Loader from "components/Loader";

const DoctorDetails = () => {
  const router = useRouter();
  const { id, from } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [isProfileVerified, setIsProfileVerified] = useState<boolean | undefined>(doctorData?.data.docProfile?.isProfileVerified);
  const [showSaveVerification, setShowSaveVerification] = useState(false);
  const [savingVerification, setSavingVerification] = useState(false);

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

  useEffect(() => {
    setIsProfileVerified(doctorData?.data.docProfile?.isProfileVerified);
  }, [doctorData]);

  const handleShowReviews = async () => {
    if (typeof id === 'string') {
      try {
        setLoadingReviews(true);
        const reviewsData = await reviewService.getReviewsByDoctorId(id);
        setReviews(reviewsData || []);
        setShowReviews(true);
      } catch (err: any) {
        setBannerError(err.response?.data?.message || "Failed to fetch reviews");
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    }
  };

  const handleToggleVerification = () => {
    setIsProfileVerified((prev) => !prev);
    setShowSaveVerification(true);
  };

  const handleSaveVerification = async () => {
    if (!doctorData) return;
    setSavingVerification(true);
    try {
      await doctorService.updateProfileVerification(doctorData.data._id, !!isProfileVerified, doctorData);
      setShowSaveVerification(false);
      setBannerError(null);
    } catch (err: any) {
      setBannerError(err.response?.data?.message || "Failed to update profile verification");
    } finally {
      setSavingVerification(false);
    }
  };

  if (!id) {
    return null; // Return null on initial render when id is undefined
  }

  if (loading) {
    return (
      <div className="page-body">
        <Container fluid={true}>
          <Row>
            <Col sm={12}>
              <Card>
                <CardBody>
                  <Loader />
                </CardBody>
              </Card>
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

  const handleBackClick = () => {
    if (from === 'appointments') {
      router.push('/dashboard/appointments-management');
    } else {
      router.push('/dashboard/doctor-management');
    }
  };

  return (
    <div className="page-body">
      {bannerError && (
        <Alert color="danger" isOpen={!!bannerError} toggle={() => setBannerError(null)} className="text-center">
          {bannerError}
        </Alert>
      )}
      <Breadcrumbs
        title={DoctorManage}
        mainTitle={DoctorManagementHeading}
        parent="Dashboard"
      />
      <Container fluid={true}>
        <Row className="mb-4">
          <Col sm={6}>
            <Button 
              color="secondary" 
              onClick={handleBackClick}
            >
              {from === 'appointments' ? 'Back to Appointments' : 'Back to Doctor List'}
            </Button>
          </Col>
          <Col sm={6} className="text-end">
            <Button 
              color="primary" 
              onClick={handleShowReviews}
            >
              Show All Reviews
            </Button>
          </Col>
        </Row>

        {/* Reviews Modal */}
        <Modal isOpen={showReviews} toggle={() => setShowReviews(false)} size="lg">
          <ModalHeader toggle={() => setShowReviews(false)}>
            Doctor Reviews
          </ModalHeader>
          <ModalBody>
            {loadingReviews ? (
              <div className="text-center">
                <Loader />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center">No reviews available</div>
            ) : (
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {reviews.map((review) => (
                  <Card key={review._id} className="mb-3">
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-2">
                            {review.patientId.firstName} {review.patientId.lastName}
                          </h6>
                          <div className="text-warning mb-2">
                            {'★'.repeat(Math.floor(review.rating))}
                            {'☆'.repeat(5 - Math.floor(review.rating))}
                            <span className="ms-2 text-dark">({review.rating}/5)</span>
                          </div>
                          <p className="mb-0">{review.comment}</p>
                        </div>
                        <small className="text-muted">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </ModalBody>
        </Modal>

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
                      <p>
                        {`${doctorData?.data.firstName} ${doctorData?.data.lastName}`}
                        {doctorData?.data.averageRating ? (
                          <span className="ms-2 text-warning">
                            ({doctorData.data.averageRating}/5)
                          </span>
                        ) : (
                          <span className="ms-2 text-muted">(N/A)</span>
                        )}
                      </p>
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
                      <p>{doctorData?.data.docProfile?.emergencyContact?.fullName}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Relation:</label>
                      <p>{doctorData?.data.docProfile?.emergencyContact?.relation}</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Phone:</label>
                      <p>{doctorData?.data.docProfile?.emergencyContact?.phone}</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Email:</label>
                      <p>{doctorData?.data.docProfile?.emergencyContact?.email}</p>
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
                      <p>{doctorData?.data.docProfile?.regulatoryDetails?.authorityName}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Allow Status Verification:</label>
                      <p>
                        {doctorData?.data.docProfile?.regulatoryDetails?.allowStatusVerification ? 'Yes' : 'No'}
                        <span className="ms-2 text-muted">
                          ({isProfileVerified ? 'Verified' : 'Unverified'})
                        </span>
                      </p>
                    </div>
                  </Col>
                  <Col md={4}>
                  <div className="mb-3">
                      <label className="form-label fw-bold">Registration Number:</label>
                      <p>{doctorData?.data.docProfile?.regulatoryDetails?.registrationNumber}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Profile Verification:</label>
                      <div className="d-flex align-items-center">
                        <FormGroup switch className="mb-0">
                          <Input
                            type="switch"
                            checked={!!isProfileVerified}
                            onChange={handleToggleVerification}
                            disabled={savingVerification}
                          />
                          <Label switch>{isProfileVerified ? 'Verified' : 'Unverified'}</Label>
                        </FormGroup>
                        {showSaveVerification && (
                          <Button
                            color="primary"
                            size="sm"
                            className="ms-3"
                            onClick={handleSaveVerification}
                            disabled={savingVerification}
                          >
                            {savingVerification ? <Spinner size="sm" /> : 'Save'}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                  </Col>
                  <Col md={4}>
                  <div className="mb-3">
                      <label className="form-label fw-bold">On Specialist Register:</label>
                      <p>{doctorData?.data.docProfile?.regulatoryDetails?.onSpecialistRegister ? 'Yes' : 'No'}</p>
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