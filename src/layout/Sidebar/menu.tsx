import { sidebarMenuType } from "Types/LayoutDataType";

export const MenuList: sidebarMenuType[] = [
  {
    title: "General",
    menucontent: "Dashboards,Widgets",
    Items: [
      {
        title: "Dashboards",
        id: 1,
        icon: "home",
        pathSlice: "dashboard",
        type: "sub",
        badge: "badge badge-light-primary",
        badgetxt: "3",
        children: [
          {
            path: "/dashboard/doctor-management",
            title: "Doctor Management",
            type: "link",
          },
          {
            path: "/dashboard/patient-management",
            title: "Patient Management",
            type: "link",
          },
          {
            path: "/dashboard/appointments-management",
            title: "Appointment Management",
            type: "link",
          },
        ],
      },
    ],
  },
];
