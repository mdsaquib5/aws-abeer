"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BsBoxSeam, BsBoxes, BsFileEarmarkPlus, BsMegaphone, BsTags } from "react-icons/bs";
import { CiLogout, CiDeliveryTruck, CiViewList, CiGrid41 } from "react-icons/ci";
import Logo from "../shared/Logo";
import useAuthStore from "@/store/authStore";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const navItems = [
    { name: "Dashboard Overview", href: "/dashboard", icon: CiGrid41, exact: true },
    { name: "Add New Product", href: "/dashboard/products/add", icon: BsBoxes, exact: true },
    { name: "Product Catalog", href: "/dashboard/products", icon: BsBoxSeam, exact: true },
    { name: "Manage Collections", href: "/dashboard/collections", icon: BsBoxes, exact: true },
    { name: "Manage Categories", href: "/dashboard/categories", icon: BsTags, exact: true },
    { name: "Customer Orders", href: "/dashboard/orders", icon: CiDeliveryTruck, exact: false },
    { name: "Write a Story", href: "/dashboard/blogs/add", icon: BsFileEarmarkPlus, exact: true },
    { name: "Abeer Stories", href: "/dashboard/blogs", icon: CiViewList, exact: true },
    { name: "Brand Collaborations", href: "/dashboard/collaborations", icon: BsMegaphone, exact: true },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
        ></div>
      )}
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <Logo />
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (window.innerWidth < 992) toggleSidebar();
                    }}
                  >
                    <Icon className="nav-icon" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span>Logout</span>
            <CiLogout />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;