import { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row, Button } from "reactstrap";
import Breadcrumbs from "CommonElements/Breadcrumbs";
import { DoctorManage, DoctorManagementHeading } from "utils/Constant";
import { useRouter } from "next/router";

interface DoctorDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  emergencyFullName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  emergencyEmail: string;
  regulatoryAuthorityName: string;
  registrationNumber: string;
  isOnSpecialistRegister: string;
  allowStatusCheck: string;
}

// Sample data - this would typically come from an API
const doctorsData: Record<string, DoctorDetails> = {
  "DOC001": {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: "+1 234-567-8900",
    streetAddress: "123 Medical Center Dr",
    addressLine2: "Suite 100",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    emergencyFullName: "Jane Smith",
    emergencyRelation: "Spouse",
    emergencyPhone: "+1 234-567-8901",
    emergencyEmail: "jane.smith@example.com",
    regulatoryAuthorityName: "Medical Board of New York",
    registrationNumber: "MB123456",
    isOnSpecialistRegister: "Yes",
    allowStatusCheck: "Yes"
  },
  "DOC002": {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 234-567-8901",
    streetAddress: "456 Health Plaza",
    addressLine2: "Suite 200",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    country: "USA",
    emergencyFullName: "Mike Johnson",
    emergencyRelation: "Brother",
    emergencyPhone: "+1 234-567-8902",
    emergencyEmail: "mike.johnson@example.com",
    regulatoryAuthorityName: "Medical Board of California",
    registrationNumber: "MB789012",
    isOnSpecialistRegister: "Yes",
    allowStatusCheck: "Yes"
  },
  "DOC003": {
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@example.com",
    phone: "+1 234-567-8902",
    streetAddress: "789 Medical Way",
    addressLine2: "Unit 300",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    country: "USA",
    emergencyFullName: "Lisa Brown",
    emergencyRelation: "Sister",
    emergencyPhone: "+1 234-567-8903",
    emergencyEmail: "lisa.brown@example.com",
    regulatoryAuthorityName: "Illinois Medical Board",
    registrationNumber: "MB345678",
    isOnSpecialistRegister: "No",
    allowStatusCheck: "Yes"
  },
  "DOC004": {
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@example.com",
    phone: "+1 234-567-8903",
    streetAddress: "321 Healthcare Blvd",
    addressLine2: "Suite 400",
    city: "Houston",
    state: "TX",
    zipCode: "77001",
    country: "USA",
    emergencyFullName: "James Davis",
    emergencyRelation: "Father",
    emergencyPhone: "+1 234-567-8904",
    emergencyEmail: "james.davis@example.com",
    regulatoryAuthorityName: "Texas Medical Board",
    registrationNumber: "MB901234",
    isOnSpecialistRegister: "Yes",
    allowStatusCheck: "Yes"
  },
  "DOC005": {
    firstName: "Robert",
    lastName: "Wilson",
    email: "robert.wilson@example.com",
    phone: "+1 234-567-8904",
    streetAddress: "654 Medical Circle",
    addressLine2: "Unit 500",
    city: "Miami",
    state: "FL",
    zipCode: "33101",
    country: "USA",
    emergencyFullName: "Mary Wilson",
    emergencyRelation: "Mother",
    emergencyPhone: "+1 234-567-8905",
    emergencyEmail: "mary.wilson@example.com",
    regulatoryAuthorityName: "Florida Medical Board",
    registrationNumber: "MB567890",
    isOnSpecialistRegister: "Yes",
    allowStatusCheck: "Yes"
  }
};

const DoctorDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorData, setDoctorData] = useState<DoctorDetails | null>(null);

  useEffect(() => {
    // Only fetch data when id is available
    if (typeof id === 'string') {
      // First try to get data from localStorage
      const storedData = localStorage.getItem(`doctor_${id}`);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setDoctorData(parsedData);
          setLoading(false);
          return;
        } catch (e) {
          console.error('Error parsing stored data:', e);
        }
      }

      // If not in localStorage, try the hardcoded data
      const data = doctorsData[id];
      if (data) {
        setDoctorData(data);
        setLoading(false);
      } else {
        setError("Doctor not found");
        setLoading(false);
      }
    }
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
          <Col sm={12}>
            {/* Health Practitioner Application Form Section */}
            <Card className="mb-4">
              <CardBody>
                <h4 className="mb-4">Health Practitioner Application Form</h4>
                <Row>
                  <Col sm={6}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">First Name:</label>
                      <p>{doctorData.firstName}</p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Last Name:</label>
                      <p>{doctorData.lastName}</p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Email:</label>
                      <p>{doctorData.email}</p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Phone:</label>
                      <p>{doctorData.phone}</p>
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Street Address:</label>
                      <p>{doctorData.streetAddress}</p>
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Address Line 2:</label>
                      <p>{doctorData.addressLine2}</p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">City:</label>
                      <p>{doctorData.city}</p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">State / Province / Region:</label>
                      <p>{doctorData.state}</p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">ZIP / Postal Code:</label>
                      <p>{doctorData.zipCode}</p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Country:</label>
                      <p>{doctorData.country}</p>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {/* Emergency Contact Details Section */}
            <Card className="mb-4">
              <CardBody>
                <h4 className="mb-4">Emergency Contact Details</h4>
                <Row>
                  <Col sm={12}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Full Name:</label>
                      <p>{doctorData.emergencyFullName}</p>
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Relation:</label>
                      <p>{doctorData.emergencyRelation}</p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Phone:</label>
                      <p>{doctorData.emergencyPhone}</p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Email:</label>
                      <p>{doctorData.emergencyEmail}</p>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {/* Regulatory Authority Details Section */}
            <Card>
              <CardBody>
                <h4 className="mb-4">Regulatory Authority/Body Details</h4>
                <Row>
                  <Col sm={12}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Regulatory Authority Name:</label>
                      <p>{doctorData.regulatoryAuthorityName}</p>
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Regulatory Authority Registration Number:</label>
                      <p>{doctorData.registrationNumber}</p>
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Are You On The Specialist / GP Register?</label>
                      <p>{doctorData.isOnSpecialistRegister}</p>
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Are You Happy For 24/7 Medics To Check Your Online Register Status?</label>
                      <p>{doctorData.allowStatusCheck}</p>
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