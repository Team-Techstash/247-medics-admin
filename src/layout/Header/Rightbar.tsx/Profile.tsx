import Image from "next/image";
import Link from "next/link";
import FeatherIconCom from "CommonElements/Icons/FeatherIconCom";
import React from "react";
import { profileListData } from "Data/HeaderData";
import { Logout } from "../../../../utils/Constant/index";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useUser } from "@/context/UserContext";

const Profile = () => {
  const router = useRouter();
  const { user } = useUser();

  const handleLogOut = () => {
    Cookies.remove('token');
    Cookies.remove('userInfo');
    router.push("/authentication/login");
  };

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Guest User';
  const userRole = user?.role || 'Guest';

  return (
    <li className="profile-nav onhover-dropdown pe-0 py-0">
      <div className="media profile-media">
        {/* <Image className="b-r-10" src="/assets/images/dashboard/profile.png" alt="" width={35} height={35}/> */}
        <div className="media-body">
          <span>{fullName}</span>
          <p className="mb-0 font-roboto">
            {userRole} <i className="middle fa fa-angle-down" />
          </p>
        </div>
      </div>
      <ul className="profile-dropdown onhover-show-div">
        {profileListData &&
          profileListData.map((item, index) => (
            <li key={index}>
              <Link href={item.path}>
                <FeatherIconCom iconName={item.icon} />
                <span>{item.text} </span>
              </Link>
            </li>
          ))}
        <li onClick={handleLogOut}>
          <a href="#123">
            <FeatherIconCom iconName={"LogIn"} />
            <span>{Logout}</span>
          </a>
        </li>
      </ul>
    </li>
  );
};

export default Profile;
