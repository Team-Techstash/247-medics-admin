import { sidebarMenuType } from "Types/LayoutDataType";

export const MenuList: sidebarMenuType[] = [
  {
    title: "General",
    menucontent: "Dashboards,Widgets",
    Items: [
      {
        title: "24/7 Medics",
        id: 1,
        icon: "home",
        pathSlice: "dashboard",
        type: "sub",
        badge: "badge badge-light-primary",
        badgetxt: "4",
        children: [
          {
            path: "/dashboard/default",
            title: "Dashboard",
            type: "link",
          },
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
