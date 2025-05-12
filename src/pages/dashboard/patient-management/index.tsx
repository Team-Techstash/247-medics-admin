import { useState } from "react";
import { Button, Card, CardBody, Col, Container, Input, Label, Row, Tooltip } from "reactstrap";
import Breadcrumbs from "CommonElements/Breadcrumbs";
import DataTable from "react-data-table-component";
import { PatientManage, PatientManagementHeading } from "utils/Constant";
import { useRouter } from "next/router";

// Define the patient data type
interface Patient {
  patientId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  location: string;
}

const PatientManagement = () => {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState<{ [key: string]: boolean }>({});
  
  const [patients] = useState<Patient[]>([
    {
      patientId: "PAT001",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 234-567-8900",
      address: "123 Medical Center Dr, Suite 100",
      gender: "Male",
      location: "New York, USA"
    },
    {
      patientId: "PAT002",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 234-567-8901",
      address: "456 Health Plaza, Suite 200",
      gender: "Female",
      location: "Los Angeles, USA"
    },
    {
      patientId: "PAT003",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "+1 234-567-8902",
      address: "789 Medical Way, Unit 300",
      gender: "Male",
      location: "Chicago, USA"
    },
    {
      patientId: "PAT004",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "+1 234-567-8903",
      address: "321 Healthcare Blvd, Suite 400",
      gender: "Female",
      location: "Houston, USA"
    },
    {
      patientId: "PAT005",
      name: "Robert Wilson",
      email: "robert.wilson@example.com",
      phone: "+1 234-567-8904",
      address: "654 Medical Circle, Unit 500",
      gender: "Male",
      location: "Phoenix, USA"
    },
    {
      patientId: "PAT006",
      name: "Lisa Anderson",
      email: "lisa.anderson@example.com",
      phone: "+1 234-567-8905",
      address: "987 Health Street, Apt 600",
      gender: "Female",
      location: "Philadelphia, USA"
    },
    {
      patientId: "PAT007",
      name: "David Martinez",
      email: "david.martinez@example.com",
      phone: "+1 234-567-8906",
      address: "741 Medical Lane, Suite 700",
      gender: "Male",
      location: "San Antonio, USA"
    },
    {
      patientId: "PAT008",
      name: "Jennifer Taylor",
      email: "jennifer.taylor@example.com",
      phone: "+1 234-567-8907",
      address: "852 Healthcare Road, Unit 800",
      gender: "Female",
      location: "San Diego, USA"
    },
    {
      patientId: "PAT009",
      name: "James Thomas",
      email: "james.thomas@example.com",
      phone: "+1 234-567-8908",
      address: "963 Medical Avenue, Suite 900",
      gender: "Male",
      location: "Dallas, USA"
    },
    {
      patientId: "PAT010",
      name: "Mary Garcia",
      email: "mary.garcia@example.com",
      phone: "+1 234-567-8909",
      address: "159 Health Boulevard, Apt 1000",
      gender: "Female",
      location: "San Jose, USA"
    }
  ]);

  const toggleTooltip = (id: string) => {
    setTooltipOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter patients based on search text
  const filteredPatients = patients.filter(
    (item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.patientId.toLowerCase().includes(filterText.toLowerCase()) ||
      item.email.toLowerCase().includes(filterText.toLowerCase()) ||
      item.phone.toLowerCase().includes(filterText.toLowerCase()) ||
      item.address.toLowerCase().includes(filterText.toLowerCase()) ||
      item.location.toLowerCase().includes(filterText.toLowerCase())
  );

  // Handle row click to view patient details
  const handleRowClick = (row: Patient) => {
    router.push(`/dashboard/patient-management/${row.patientId}`);
  };

  // Table columns configuration
  const columns = [
    {
      name: "Patient ID",
      selector: (row: Patient) => row.patientId,
      sortable: true,
      width: "130px",
      cell: (row: Patient) => (
        <div>
          <span id={`patientId-${row.patientId}`}>{row.patientId}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`patientId-${row.patientId}`]}
            target={`patientId-${row.patientId}`}
            toggle={() => toggleTooltip(`patientId-${row.patientId}`)}
          >
            Click to view patient details
          </Tooltip>
        </div>
      ),
    },
    {
      name: "Name",
      selector: (row: Patient) => row.name,
      sortable: true,
      width: "200px",
      cell: (row: Patient) => (
        <div>
          <span id={`name-${row.patientId}`}>{row.name}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`name-${row.patientId}`]}
            target={`name-${row.patientId}`}
            toggle={() => toggleTooltip(`name-${row.patientId}`)}
          >
            {row.name}
          </Tooltip>
        </div>
      ),
    },
    {
      name: "Email",
      selector: (row: Patient) => row.email,
      sortable: true,
      width: "250px",
      cell: (row: Patient) => (
        <div>
          <span id={`email-${row.patientId}`}>{row.email}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`email-${row.patientId}`]}
            target={`email-${row.patientId}`}
            toggle={() => toggleTooltip(`email-${row.patientId}`)}
          >
            {row.email}
          </Tooltip>
        </div>
      ),
    },
    {
      name: "Phone",
      selector: (row: Patient) => row.phone,
      sortable: true,
      width: "150px",
      cell: (row: Patient) => (
        <div>
          <span id={`phone-${row.patientId}`}>{row.phone}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`phone-${row.patientId}`]}
            target={`phone-${row.patientId}`}
            toggle={() => toggleTooltip(`phone-${row.patientId}`)}
          >
            {row.phone}
          </Tooltip>
        </div>
      ),
    },
    {
      name: "Gender",
      selector: (row: Patient) => row.gender,
      sortable: true,
      width: "130px",
      cell: (row: Patient) => (
        <div>
          <span id={`gender-${row.patientId}`}>{row.gender}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`gender-${row.patientId}`]}
            target={`gender-${row.patientId}`}
            toggle={() => toggleTooltip(`gender-${row.patientId}`)}
          >
            {row.gender}
          </Tooltip>
        </div>
      ),
    },
    {
      name: "Location",
      selector: (row: Patient) => row.location,
      sortable: true,
      width: "150px",
      cell: (row: Patient) => (
        <div>
          <span id={`location-${row.patientId}`}>{row.location}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`location-${row.patientId}`]}
            target={`location-${row.patientId}`}
            toggle={() => toggleTooltip(`location-${row.patientId}`)}
          >
            {row.location}
          </Tooltip>
        </div>
      ),
    },
    {
      name: "Address",
      selector: (row: Patient) => row.address,
      sortable: true,
      minWidth: "300px",
      cell: (row: Patient) => (
        <div>
          <span id={`address-${row.patientId}`}>{row.address}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`address-${row.patientId}`]}
            target={`address-${row.patientId}`}
            toggle={() => toggleTooltip(`address-${row.patientId}`)}
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
        title={PatientManage}
        mainTitle={PatientManagementHeading}
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
                        placeholder="Search patients..."
                      />
                    </Label>
                  </div>
                </div>
                <div className="table-responsive">
                  <DataTable
                    columns={columns}
                    data={filteredPatients}
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

export default PatientManagement;
