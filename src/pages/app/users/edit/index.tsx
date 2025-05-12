import EditMyProfile from "@/components/app/users/EditProfile/EditMyProfile";
import EditProfileForm from "@/components/app/users/EditProfile/EditProfileForm";
import Breadcrumbs from "CommonElements/Breadcrumbs";
import { Container, Row } from "reactstrap";
import { Users, UserEdit } from "utils/Constant";

const UserEdits = () => {
  return (
    <div className="page-body">
      <Breadcrumbs title={UserEdit} mainTitle={UserEdit} parent={Users} />
      <Container fluid>
        <div className="edit-profile">
          <Row>
            <EditMyProfile />
            <EditProfileForm />
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default UserEdits;
