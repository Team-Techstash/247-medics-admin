import { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Row, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Label } from "reactstrap";
import Breadcrumbs from "CommonElements/Breadcrumbs";
import { AppointmentManage, AppointmentManagementHeading } from "utils/Constant";
import { useRouter } from "next/router";
import { appointmentService, Appointment } from "../../../services/appointmentService";
import Loader from "components/Loader";
import { Edit2 } from "react-feather";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

const AppointmentDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingDateTime, setIsEditingDateTime] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  useEffect(() => {
    if (id) {
      fetchAppointmentDetails();
    }
  }, [id]);

  useEffect(() => {
    if (appointment) {
      const startTime = appointment.scheduledAt || appointment.scheduledRange?.start;
      if (startTime) {
        setSelectedDateTime(new Date(startTime));
      }
    }
  }, [appointment]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAdminAppointmentById(id as string);
      console.log('Fetched appointment data:', data);
      setAppointment(data as Appointment);
      setError(null);
    } catch (err) {
      setError('Failed to fetch appointment details. Please try again later.');
      console.error('Error fetching appointment details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    router.push('/dashboard/appointments-management');
  };

  const handleDateTimeUpdate = async () => {
    if (!selectedDateTime || !appointment) return;

    try {
      const duration = appointment.durationMinutes > 0 ? appointment.durationMinutes : 30;
      const endDateTime = new Date(selectedDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + duration);

      const updatePayload = {
        scheduledAt: selectedDateTime.toISOString(),
      };

      const updatedAppointment = await appointmentService.updateAppointment(appointment._id, updatePayload);

      // Update the local state with the new appointment data
      setAppointment(prev => prev ? {
        ...prev,
        ...updatePayload
      } : null);
      
      setIsEditingDateTime(false);
      toast.success('Appointment date/time updated successfully');
    } catch (err) {
      console.error('Error updating appointment date/time:', err);
      toast.error('Failed to update appointment date/time');
    }
  };

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
    return <div className="text-danger">{error}</div>;
  }

  if (!appointment) {
    return <div>Appointment not found</div>;
  }

  console.log('Current appointment state:', appointment);

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
              onClick={handleBackClick}
            >
              Back to Appointment List
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Card style={{ transition: 'none' }} className="mb-4">
              <CardBody style={{ transition: 'none' }}>
                <h4 className="mb-4">Patient Information</h4>
                {appointment.patientId ? (
                  <Row>
                    <Col md={4}>
                      <div className="mb-3" style={{ transition: 'none' }}>
                        <strong>Email:</strong> {appointment.patientId.email}
                      </div>
                      <div className="mb-3" style={{ transition: 'none' }}>
                        <strong>Phone:</strong> {appointment.patientId.phone}
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-3" style={{ transition: 'none' }}>
                        <strong>Reason:</strong> {appointment.reason}
                      </div>
                      <div className="mb-3" style={{ transition: 'none' }}>
                        <strong>Is For Self:</strong> {appointment.isForSelf ? 'Yes' : 'No'}
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-3" style={{ transition: 'none' }}>
                        <strong>Created At:</strong> {new Date(appointment.createdAt).toLocaleString()}
                      </div>
                      <div className="mb-3" style={{ transition: 'none' }}>
                        <strong>Created By:</strong> {appointment.createdBy}
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <div className="text-muted">No patient information available</div>
                )}
              </CardBody>
            </Card>

            <Card style={{ transition: 'none' }}>
              <CardBody style={{ transition: 'none' }}>
                <h4 className="mb-4">Appointment Details</h4>
                <Row>
                  <Col md={4}>
                    <div className="mb-3" style={{ transition: 'none' }}>
                      <strong>Appointment Date/Time:</strong>{" "}
                      <div className="d-flex align-items-center">
                        {appointment.scheduledAt || appointment.scheduledRange?.start ? (
                          <>
                            <span>{new Date(appointment.scheduledAt || appointment.scheduledRange?.start).toLocaleString()}</span>
                            <Edit2
                              size={16}
                              className="ms-2 cursor-pointer"
                              onClick={() => setIsEditingDateTime(true)}
                              style={{ cursor: 'pointer' }}
                            />
                          </>
                        ) : 'Not specified'}
                      </div>
                    </div>
                    <div className="mb-3" style={{ transition: 'none' }}>
                      <strong>Service Type:</strong> {appointment.serviceType}
                    </div>
                    <div className="mb-3" style={{ transition: 'none' }}>
                      <strong>Visit Type:</strong> {appointment.visitType}
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-3" style={{ transition: 'none' }}>
                      <strong>Appointment Mode:</strong> {appointment.appointmentMode}
                    </div>
                    <div className="mb-3" style={{ transition: 'none' }}>
                      <strong>Duration:</strong> {appointment.durationMinutes} minutes
                    </div>
                    <div className="mb-3" style={{ transition: 'none' }}>
                      <strong>Attended:</strong> {appointment.attended ? 'Yes' : 'No'}
                    </div>
                  </Col>
                  <Col md={4}>
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
                            const status = appointment.status?.toLowerCase() || 'unknown';
                            switch (status) {
                              case 'upcoming':
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
                                  backgroundColor: 'rgba(25, 135, 84, 0.1)',
                                  color: '#198754',
                                  border: '1px solid rgba(25, 135, 84, 0.2)'
                                };
                              case 'cancelled':
                                return {
                                  backgroundColor: 'rgba(220, 53, 69, 0.1)',
                                  color: '#dc3545',
                                  border: '1px solid rgba(220, 53, 69, 0.2)'
                                };
                              case 'requested':
                                return {
                                  backgroundColor: 'rgba(13, 110, 253, 0.1)',
                                  color: '#0d6efd',
                                  border: '1px solid rgba(13, 110, 253, 0.2)'
                                };
                              case 'in-progress':
                                return {
                                  backgroundColor: 'rgba(13, 110, 253, 0.1)',
                                  color: '#0d6efd',
                                  border: '1px solid rgba(13, 110, 253, 0.2)'
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
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {appointment.paymentDetails && (
              <Card style={{ transition: 'none' }} className="mt-4">
                <CardBody style={{ transition: 'none' }}>
                  <h4 className="mb-4">Payment Details</h4>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3" style={{ transition: 'none' }}>
                        <strong>Amount:</strong> {appointment.paymentDetails.amount} {appointment.paymentDetails.currency.toUpperCase()}
                      </div>
                      <div className="mb-3" style={{ transition: 'none' }}>
                        <strong>Payment Method:</strong> {appointment.paymentDetails.paymentMethod}
                      </div>
                      <div className="mb-3" style={{ transition: 'none' }}>
                        <strong>Paid At:</strong> {new Date(appointment.paymentDetails.paidAt).toLocaleString()}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3" style={{ transition: 'none' }}>
                        <strong>Payment Status:</strong>{" "}
                        <span
                          style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            display: 'inline-block',
                            transition: 'none',
                            ...(() => {
                              const status = appointment.paymentStatus?.toLowerCase() || 'unknown';
                              switch (status) {
                                case 'paid':
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
                                case 'failed':
                                  return {
                                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                                    color: '#dc3545',
                                    border: '1px solid rgba(220, 53, 69, 0.2)'
                                  };
                                case 'refunded':
                                  return {
                                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                                    color: '#0d6efd',
                                    border: '1px solid rgba(13, 110, 253, 0.2)'
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
                          {appointment.paymentStatus}
                        </span>
                      </div>
                      {appointment.paymentDetails.receiptUrl && (
                        <Button
                          color="primary"
                          onClick={() => window.open(appointment.paymentDetails?.receiptUrl, '_blank')}
                        >
                          Download Receipt
                        </Button>
                      )}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      <Modal isOpen={isEditingDateTime} toggle={() => setIsEditingDateTime(false)}>
        <ModalHeader toggle={() => setIsEditingDateTime(false)}>
          Edit Appointment Date/Time
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Select Date and Time</Label>
            <DatePicker
              selected={selectedDateTime}
              onChange={(date: Date) => setSelectedDateTime(date)}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className="form-control"
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setIsEditingDateTime(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleDateTimeUpdate}>
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AppointmentDetails; 