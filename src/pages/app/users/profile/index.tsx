import Breadcrumbs from "CommonElements/Breadcrumbs";
import { Users, UserProfile } from "utils/Constant";
import { Container, Row } from "reactstrap";
import Profile from "@/components/Bonus-Ui/Tour/Profile";
import WilliamProfile from "@/components/Bonus-Ui/Tour/WillamProfile";
import Profile2 from "@/components/Bonus-Ui/Tour/Profile2";
import ProfileDetail from "@/components/Bonus-Ui/Tour/ProfileDetail";
import DetailImg from "@/components/Bonus-Ui/Tour/DetailImg";

const UserProfiles = () => {
  return (
    <div className="page-body">
      <Breadcrumbs title={UserProfile} mainTitle={UserProfile} parent={Users} />
      <Container fluid>
        <div className="user-profile">
          <Row>
            <Profile />
            <WilliamProfile />
            <Profile2 />
            <ProfileDetail />
            <DetailImg />
          </Row>  
        </div>
      </Container>
    </div>
  );
};

export default UserProfiles;
