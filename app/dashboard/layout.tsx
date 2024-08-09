import { cn } from "@/lib/utils";
import { auth } from "@/server/auth";
import DashboardNavbar from "@/components/DashboardNavBar";
import {
  FaTruck,
  FaCog,
  FaChartBar,
  FaShoppingBasket,
  FaPlusCircle,
} from "react-icons/fa";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userLinks = [
    {
      label: "Orders",
      path: "/dashboard/orders",
      icon: <FaTruck />,
    },
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: <FaCog />,
    },
  ] as const;

  const adminLinks =
    session?.user.role === "admin"
      ? ([
          {
            label: "Analytics",
            path: "/dashboard/analytics",
            icon: <FaChartBar />,
          },
          {
            label: "Create",
            path: "/dashboard/add-product",
            icon: <FaPlusCircle />,
          },
          {
            label: "Products",
            path: "/dashboard/products",
            icon: <FaShoppingBasket />,
          },
        ] as const)
      : [];

  const allLinks = [...userLinks, ...adminLinks];

  return (
    <div>
      <DashboardNavbar allLinks={allLinks} />
      {children}
    </div>
  );
}
