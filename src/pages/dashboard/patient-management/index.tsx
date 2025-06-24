import { useState, useEffect } from "react";
import { Button, Card, CardBody, Col, Container, Input, Label, Row, Tooltip } from "reactstrap";
import Breadcrumbs from "CommonElements/Breadcrumbs";
import DataTable from "react-data-table-component";
import { PatientManage, PatientManagementHeading } from "utils/Constant";
import { useRouter } from "next/router";
import { patientService, Patient, PaginatedResponse } from "../../../services/patientService";
import { ProgressComponent } from "components/Loader";

const PatientManagement = () => {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState<{ [key: string]: boolean }>({});
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPatients();
  }, [currentPage, perPage]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientService.getAllPatients(currentPage, perPage);
      setPatients(response.data);
      setTotalRows(response.total);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTooltip = (id: string) => {
    setTooltipOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter patients based on search text
  const filteredPatients = patients.filter(
    (item) =>
      `${item.firstName || ''} ${item.lastName || ''}`.toLowerCase().includes(filterText.toLowerCase()) ||
      (item.email?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
      (item.phone?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
      (typeof item.address === 'string' 
        ? item.address.toLowerCase()
        : `${item.address?.streetAddress1 || ''} ${item.address?.streetAddress2 || ''} ${item.address?.city || ''} ${item.address?.state || ''} ${item.address?.postalCode || ''} ${item.address?.country || ''}`.toLowerCase()
      ).includes(filterText.toLowerCase())
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle per page change
  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  // Table columns configuration
  const columns = [
    {
      name: "Patient ID",
      selector: (row: Patient) => row.readableId || row._id,
      sortable: true,
      width: "150px",
      cell: (row: Patient) => (
        <div>
          <span 
            id={`readableId-${row._id}`}
            className="text-primary cursor-pointer"
            onClick={() => router.push(`/dashboard/patient-management/${row._id}`)}
          >
            {row.readableId || row._id}
          </span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen[`readableId-${row._id}`]}
            target={`readableId-${row._id}`}
            toggle={() => toggleTooltip(`readableId-${row._id}`)}
          >
            Click to view patient details
          </Tooltip>
        </div>
      ),
    },
    {
      name: "Name",
      selector: (row: Patient) => `${row.firstName || ''} ${row.lastName || ''}`.trim(),
      sortable: true,
      width: "300px",
      cell: (row: Patient) => {
        const fullName = `${row.firstName || ''} ${row.lastName || ''}`.trim();
        return (
          <div>
            <span id={`name-${row._id}`}>{fullName}</span>
            <Tooltip
              placement="top"
              isOpen={tooltipOpen[`name-${row._id}`]}
              target={`name-${row._id}`}
              toggle={() => toggleTooltip(`name-${row._id}`)}
            >
              {fullName}
            </Tooltip>
          </div>
        );
      },
    },
    {
      name: "Email",
      selector: (row: Patient) => row.email,
      sortable: true,
      width: "300px",
      cell: (row: Patient) => (
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
      selector: (row: Patient) => row.phone,
      sortable: true,
      width: "300px",
      cell: (row: Patient) => (
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
      selector: (row: Patient) => {
        if (typeof row.address === 'string') return row.address;
        if (typeof row.address === 'object' && row.address !== null) {
          const addr = row.address as { streetAddress1?: string; streetAddress2?: string; city?: string; state?: string; postalCode?: string; country?: string };
          return `${addr.streetAddress1 || ''} ${addr.streetAddress2 || ''} ${addr.city || ''} ${addr.state || ''} ${addr.postalCode || ''} ${addr.country || ''}`.trim();
        }
        return '';
      },
      sortable: true,
      width: "300px",
      cell: (row: Patient) => {
        const addressText = typeof row.address === 'string' 
          ? row.address 
          : typeof row.address === 'object' && row.address !== null
            ? `${row.address.streetAddress1 || ''} ${row.address.streetAddress2 || ''} ${row.address.city || ''} ${row.address.state || ''} ${row.address.postalCode || ''} ${row.address.country || ''}`.trim()
            : '';
        
        return (
          <div>
            <span id={`address-${row._id}`}>{addressText}</span>
            <Tooltip
              placement="top"
              isOpen={tooltipOpen[`address-${row._id}`]}
              target={`address-${row._id}`}
              toggle={() => toggleTooltip(`address-${row._id}`)}
            >
              {addressText}
            </Tooltip>
          </div>
        );
      },
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
                    paginationServer
                    paginationTotalRows={totalRows}
                    onChangeRowsPerPage={handlePerRowsChange}
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
    </div>
  );
};

export default PatientManagement;
