"use client";

import DataTable from "@/components/ui/DataTable";

export default function CustomersPage() {
  const customerColumns = [
    { label: "Customer Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Total Orders", key: "orders" },
    { label: "Total Spent", key: "spent" },
    { label: "Status", key: "status", render: (row) => (
      <span style={{ color: row.status === 'Active' ? '#27ae60' : '#e74c3c', fontWeight: 500 }}>
        {row.status}
      </span>
    )}
  ];

  const dummyCustomers = [
    { name: "Sarah Connor", email: "sarah.c@example.com", orders: 12, spent: "₹45,000", status: "Active" },
    { name: "Michael Smith", email: "m.smith@example.com", orders: 3, spent: "₹8,500", status: "Active" },
    { name: "Emma Johnson", email: "emma.j@example.com", orders: 0, spent: "₹0", status: "Inactive" },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header flex-header">
        <div>
          <h1 className="dashboard-title">Customers</h1>
          <p className="dashboard-subtitle">Manage your customer relationships and data.</p>
        </div>
      </div>

      <DataTable 
        columns={customerColumns} 
        data={dummyCustomers} 
        onEdit={(row) => console.log("View Customer", row.name)}
      />
    </div>
  );
}
