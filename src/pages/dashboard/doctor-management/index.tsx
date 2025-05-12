import { useState } from "react";
import { Button, Card, CardBody, Col, Container, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Tooltip } from "reactstrap";
import Breadcrumbs from "CommonElements/Breadcrumbs";
import DataTable from "react-data-table-component";
import { DoctorManage, DoctorManagementHeading } from "utils/Constant";
import { useRouter } from "next/router";

// Define the doctor data type
interface Doctor {
  docId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const DoctorManagement = () => {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [modal, setModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      docId: "DOC001",
      name: "Dr. John Smith",
      email: "john.smith@example.com",
      phone: "+1 234-567-8900",
      address: "123 Medical Center Dr, Suite 100"
    },
    {
      docId: "DOC002",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 234-567-8901",
      address: "456 Health Plaza, Suite 200"
    },
    {
      docId: "DOC003",
      name: "Dr. Michael Brown",
      email: "michael.brown@example.com",
      phone: "+1 234-567-8902",
      address: "789 Medical Way, Unit 300"
    },
    {
      docId: "DOC004",
      name: "Dr. Emily Davis",
      email: "emily.davis@example.com",
      phone: "+1 234-567-8903",
      address: "321 Healthcare Blvd, Suite 400"
    },
    {
      docId: "DOC005",
      name: "Dr. Robert Wilson",
      email: "robert.wilson@example.com",
      phone: "+1 234-567-8904",
      address: "654 Medical Circle, Unit 500"
    }
  ]);
  
  const [formData, setFormData] = useState({
    // Step 1: Health Practitioner Application Form
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetAddress: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    
    // Step 2: Emergency Contact Details
    emergencyFullName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    emergencyEmail: "",
    
    // Step 3: Regulatory Authority Details
    regulatoryAuthorityName: "",
    registrationNumber: "",
    isOnSpecialistRegister: "",
    allowStatusCheck: ""
  });

  // Add tooltip state
  const [tooltipOpen, setTooltipOpen] = useState<{ [key: string]: boolean }>({});

  const toggleTooltip = (id: string) => {
    setTooltipOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter doctors based on search text
  const filteredDoctors = doctors.filter(
    (item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.docId.toLowerCase().includes(filterText.toLowerCase()) ||
      item.email.toLowerCase().includes(filterText.toLowerCase()) ||
      item.phone.toLowerCase().includes(filterText.toLowerCase()) ||
      item.address.toLowerCase().includes(filterText.toLowerCase())
  );

  // Handle row click to view doctor details
  const handleRowClick = (row: Doctor) => {
    router.push(`/dashboard/doctor-management/${row.docId}`);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle next step in the form
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle form submission
      const newDocId = `DOC${String(doctors.length + 1).padStart(3, '0')}`;
      const newDoctor: Doctor = {
        docId: newDocId,
        name: `Dr. ${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.streetAddress}${formData.addressLine2 ? ', ' + formData.addressLine2 : ''}, ${formData.city}, ${formData.state} ${formData.zipCode}`
      };

      // Add to doctors list
      setDoctors([...doctors, newDoctor]);

      // Store full details in localStorage for the details page
      const fullDetails = {
        ...formData
      };
      localStorage.setItem(`doctor_${newDocId}`, JSON.stringify(fullDetails));

      setModal(false);
      setCurrentStep(1);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        streetAddress: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        emergencyFullName: "",
        emergencyRelation: "",
        emergencyPhone: "",
        emergencyEmail: "",
        regulatoryAuthorityName: "",
        registrationNumber: "",
        isOnSpecialistRegister: "",
        allowStatusCheck: ""
      });
    }
  };

  // Handle previous step in the form
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Table columns configuration
  const columns = [
    {
      name: "Doctor ID",
      selector: (row: Doctor) => row.docId,
      sortable: true,
      width: "120px", // Fixed width for ID column
      cell: (row: Doctor) => (
        <div>
          <span id={`docId-${row.docId}`}>{row.docId}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`docId-${row.docId}`]}
            target={`docId-${row.docId}`}
            toggle={() => toggleTooltip(`docId-${row.docId}`)}
          >
            Click to view doctor details
          </Tooltip>
        </div>
      ),
    },
    {
      name: "Name",
      selector: (row: Doctor) => row.name,
      sortable: true,
      width: "200px", // Fixed width for name column
      cell: (row: Doctor) => (
        <div>
          <span id={`name-${row.docId}`}>{row.name}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`name-${row.docId}`]}
            target={`name-${row.docId}`}
            toggle={() => toggleTooltip(`name-${row.docId}`)}
          >
            {row.name}
          </Tooltip>
        </div>
      ),
    },
    {
      name: "Email",
      selector: (row: Doctor) => row.email,
      sortable: true,
      width: "250px", // Fixed width for email column
      cell: (row: Doctor) => (
        <div>
          <span id={`email-${row.docId}`}>{row.email}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`email-${row.docId}`]}
            target={`email-${row.docId}`}
            toggle={() => toggleTooltip(`email-${row.docId}`)}
          >
            {row.email}
          </Tooltip>
        </div>
      ),
    },
    {
      name: "Phone",
      selector: (row: Doctor) => row.phone,
      sortable: true,
      width: "150px", // Fixed width for phone column
      cell: (row: Doctor) => (
        <div>
          <span id={`phone-${row.docId}`}>{row.phone}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`phone-${row.docId}`]}
            target={`phone-${row.docId}`}
            toggle={() => toggleTooltip(`phone-${row.docId}`)}
          >
            {row.phone}
          </Tooltip>
        </div>
      ),
    },
    {
      name: "Address",
      selector: (row: Doctor) => row.address,
      sortable: true,
      minWidth: "300px", // Minimum width for address column
      cell: (row: Doctor) => (
        <div>
          <span id={`address-${row.docId}`}>{row.address}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`address-${row.docId}`]}
            target={`address-${row.docId}`}
            toggle={() => toggleTooltip(`address-${row.docId}`)}
          >
            {row.address}
          </Tooltip>
        </div>
      ),
    }
  ];

  return (
    <div className="page-body">
      <Breadcrumbs
        title={DoctorManage}
        mainTitle={DoctorManagementHeading}
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
                        placeholder="Search doctors..."
                      />
                    </Label>
                  </div>
                  <Button color="primary" onClick={() => setModal(true)}>
                    Add Doctor
                  </Button>
                </div>
                <div className="table-responsive">
                  <DataTable
                    columns={columns}
                    data={filteredDoctors}
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

      {/* Add Doctor Modal */}
      <Modal isOpen={modal} toggle={() => setModal(!modal)} size="lg">
        <ModalHeader toggle={() => setModal(!modal)}>
          {currentStep === 1 && "Health Practitioner Application Form"}
          {currentStep === 2 && "Emergency Contact Details"}
          {currentStep === 3 && "Regulatory Authority/Body Details"}
        </ModalHeader>
        <ModalBody>
          {currentStep === 1 && (
            <div className="row g-3">
              <Col sm={6}>
                <Label>First Name<span className="text-danger">*</span></Label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col sm={6}>
                <Label>Last Name<span className="text-danger">*</span></Label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col sm={6}>
                <Label>Email<span className="text-danger">*</span></Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col sm={6}>
                <Label>Phone<span className="text-danger">*</span></Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col sm={12}>
                <Label>Street Address<span className="text-danger">*</span></Label>
                <Input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col sm={12}>
                <Label>Address Line 2</Label>
                <Input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                />
              </Col>
              <Col sm={6}>
                <Label>City<span className="text-danger">*</span></Label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col sm={6}>
                <Label>State / Province / Region<span className="text-danger">*</span></Label>
                <Input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col sm={6}>
                <Label>ZIP / Postal Code<span className="text-danger">*</span></Label>
                <Input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col sm={6}>
                <Label>Country<span className="text-danger">*</span></Label>
                <Input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </Col>
            </div>
          )}

          {currentStep === 2 && (
            <div className="row g-3">
              <Col sm={12}>
                <Label>Full Name<span className="text-danger">*</span></Label>
                <Input
                  type="text"
                  name="emergencyFullName"
                  value={formData.emergencyFullName}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col sm={12}>
                <Label>Relation<span className="text-danger">*</span></Label>
                <Input
                  type="text"
                  name="emergencyRelation"
                  value={formData.emergencyRelation}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col sm={6}>
                <Label>Phone<span className="text-danger">*</span></Label>
                <Input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col sm={6}>
                <Label>Email<span className="text-danger">*</span></Label>
                <Input
                  type="email"
                  name="emergencyEmail"
                  value={formData.emergencyEmail}
                  onChange={handleInputChange}
                  required
                />
              </Col>
            </div>
          )}

          {currentStep === 3 && (
            <div className="row g-3">
              <Col sm={12}>
                <Label>Regulatory Authority Name<span className="text-danger">*</span></Label>
                <Input
                  type="text"
                  name="regulatoryAuthorityName"
                  value={formData.regulatoryAuthorityName}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col sm={12}>
                <Label>Regulatory Authority Registration Number<span className="text-danger">*</span></Label>
                <Input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col sm={12}>
                <Label>Are You On The Specialist / GP Register?<span className="text-danger">*</span></Label>
                <Input
                  type="text"
                  name="isOnSpecialistRegister"
                  value={formData.isOnSpecialistRegister}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col sm={12}>
                <Label>Are You Happy For 24/7 Medics To Check Your Online Register Status?<span className="text-danger">*</span></Label>
                <Input
                  type="text"
                  name="allowStatusCheck"
                  value={formData.allowStatusCheck}
                  onChange={handleInputChange}
                  required
                />
              </Col>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {currentStep > 1 && (
            <Button color="secondary" onClick={handlePrevStep}>
              Previous
            </Button>
          )}
          <Button color="primary" onClick={handleNextStep}>
            {currentStep === 3 ? "Submit" : "Next"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default DoctorManagement;
