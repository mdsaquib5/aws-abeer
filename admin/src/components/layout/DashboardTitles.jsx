import { useState, useEffect } from "react";
import { BsFlower2 } from "react-icons/bs";
import { HiOutlineMenuAlt2, HiOutlineX } from "react-icons/hi";

export default function DashboardTitles({ title }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleStateChange = (e) => setIsSidebarOpen(e.detail);
    window.addEventListener('sidebarStateChange', handleStateChange);
    
    // Initial check (in case component mounts after layout state is set)
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar && sidebar.classList.contains('open')) setIsSidebarOpen(true);
    
    return () => window.removeEventListener('sidebarStateChange', handleStateChange);
  }, []);

  const toggleSidebar = () => {
    window.dispatchEvent(new Event('toggleSidebarEvent'));
  };

  return (
    <div className="page-intro">
      <div className="dashboard-title"><BsFlower2 />{title}</div>
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle-btn"
      >
        {isSidebarOpen ? <HiOutlineX /> : <HiOutlineMenuAlt2 />}
      </button>
    </div>
  );
}