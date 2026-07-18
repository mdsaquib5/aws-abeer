"use client";

export default function SettingsPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header flex-header">
        <div>
          <h1 className="dashboard-title">Settings</h1>
          <p className="dashboard-subtitle">Manage your store preferences and admin configurations.</p>
        </div>
        <button className="btn primary-btn">Save Changes</button>
      </div>

      <div className="form-layout">
        <div className="form-main">
          <div className="admin-card">
            <h3 className="card-title">Store Details</h3>
            <div className="form-group">
              <label>Store Name</label>
              <input type="text" className="form-input" defaultValue="ABEER" />
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input type="email" className="form-input" defaultValue="contact@abeer.label" />
            </div>
            <div className="form-group">
              <label>Currency</label>
              <select className="form-select">
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
