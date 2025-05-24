import { useState, useEffect } from "react";
import { Button, Card, CardBody, Col, Container, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Tooltip } from "reactstrap";
import Breadcrumbs from "CommonElements/Breadcrumbs";
import DataTable from "react-data-table-component";
import { DoctorManage, DoctorManagementHeading } from "utils/Constant";
import { useRouter } from "next/router";
import { doctorService } from "@/services/doctorService";
import type { Doctor, PaginatedResponse } from "@/services/doctorService";
import { useUser } from "@/context/UserContext";
import { FiInfo } from "react-icons/fi";
import { Info } from "react-feather";
import { ProgressComponent } from "components/Loader";

const DoctorManagement = () => {
  const router = useRouter();
  const { user } = useUser();
  const [filterText, setFilterText] = useState("");
  const [modal, setModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  
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

  // Fetch doctors from API
  const fetchDoctors = async (page: number = 1) => {
    if (!user) {
      setError('Please log in to view doctors');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await doctorService.getDoctors({
        page,
        limit: pagination.limit,
        role: 'doctor'
      });

      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      setDoctors(response.data);
      setPagination(prev => ({
        ...prev,
        page: response.page || 1,
        total: response.total || 0
      }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch doctors. Please try again later.';
      setError(errorMessage);
      console.error('Error fetching doctors:', err);
      // Set empty state
      setDoctors([]);
      setPagination(prev => ({
        ...prev,
        page: 1,
        total: 0
      }));
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors when component mounts and user is available
  useEffect(() => {
    if (user) {
      fetchDoctors();
    }
  }, [user]);

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchDoctors(page);
  };

  // Filter doctors based on search text
  const filteredDoctors = doctors.filter((item) => {
    if (!item) return false;
    
    const searchText = filterText.toLowerCase();
    return (
      (item.firstName?.toLowerCase() || '').includes(searchText) ||
      (item.lastName?.toLowerCase() || '').includes(searchText) ||
      (item.email?.toLowerCase() || '').includes(searchText) ||
      (item.phone?.toLowerCase() || '').includes(searchText) ||
      (item.address?.streetAddress1?.toLowerCase() || '').includes(searchText)
    );
  });

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
      // const newDoctor: Doctor = {
      //   _id: `DOC${String(doctors.length + 1).padStart(3, '0')}`,
      //   firstName: formData.firstName,
      //   lastName: formData.lastName,
      //   email: formData.email,
      //   phone: formData.phone,
      //   address: {
      //     streetAddress1: formData.streetAddress,
      //     city: formData.city,
      //     country: formData.country
      //   },
      //   role: 'doctor',
      //   status: '',
      //   emailVerified: false,
      //   phoneVerified: false,
      //   createdAt: new Date().toISOString()
      // };

      // Add to doctors list
      // setDoctors([...doctors, newDoctor]);

      // Store full details in localStorage for the details page
      const fullDetails = {
        ...formData
      };
      // localStorage.setItem(`doctor_${newDoctor._id}`, JSON.stringify(fullDetails));

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
      name: "Name",
      selector: (row: Doctor) => `${row.firstName} ${row.lastName}`,
      sortable: true,
      width: "300px",
      cell: (row: Doctor) => (
        <div>
          <span id={`name-${row._id}`}>{`${row.firstName} ${row.lastName}`}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`name-${row._id}`]}
            target={`name-${row._id}`}
            toggle={() => toggleTooltip(`name-${row._id}`)}
          >
            {`${row.firstName} ${row.lastName}`}
          </Tooltip>
        </div>
      ),
    },
    {
      name: "Email",
      selector: (row: Doctor) => row.email,
      sortable: true,
      width: "300px",
      cell: (row: Doctor) => (
        <div>
          <span id={`email-${row._id}`}>{row.email}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`email-${row._id}`]}
            target={`email-${row._id}`}
            toggle={() => toggleTooltip(`email-${row._id}`)}
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
      width: "300px",
      cell: (row: Doctor) => (
        <div>
          <span id={`phone-${row._id}`}>{row.phone}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`phone-${row._id}`]}
            target={`phone-${row._id}`}
            toggle={() => toggleTooltip(`phone-${row._id}`)}
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
      width: "300px",
      cell: (row: Doctor) => {
        const addressString = row.address 
          ? `${row.address.streetAddress1 || ''}, ${row.address.city || ''}, ${row.address.country || ''}`
          : '';
        
        return (
          <div>
            <span id={`address-${row._id}`}>{addressString}</span>
            <Tooltip
              placement="top"
              isOpen={tooltipOpen[`address-${row._id}`]}
              target={`address-${row._id}`}
              toggle={() => toggleTooltip(`address-${row._id}`)}
            >
              {addressString}
            </Tooltip>
          </div>
        );
      },
    },
    {
      name: "Actions",
      width: "205px",
      cell: (row: Doctor) => (
        <div className="d-flex justify-content-center">
          <span
            id={`view-${row._id}`}
            style={{ cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center' }}
            onClick={() => router.push(`/dashboard/doctor-management/${row._id}`)}
          >
            <FiInfo size={18} className="text-primary" />
          </span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`view-${row._id}`]}
            target={`view-${row._id}`}
            toggle={() => toggleTooltip(`view-${row._id}`)}
          >
            View doctor details
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
                  {/* <Button color="primary" onClick={() => setModal(true)}>
                    Add Doctor
                  </Button> */}
                </div>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <div className="table-responsive">
                  <DataTable
                    columns={columns as any}
                    data={filteredDoctors}
                    pagination
                    paginationServer
                    paginationTotalRows={pagination.total}
                    onChangePage={handlePageChange}
                    progressPending={loading}
                    progressComponent={<ProgressComponent />}
                    highlightOnHover
                    customStyles={{
                      table: {
                        style: {
                          width: '100%',
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
