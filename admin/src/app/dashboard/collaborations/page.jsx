"use client";

import { useState } from "react";
import DashboardTitles from "@/components/layout/DashboardTitles";
import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";
import { BsInstagram, BsYoutube, BsPerson, BsCheckLg, BsXLg, BsClock, BsEye } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";

const FILTERS = ["All", "Pending", "Approved", "Rejected"];

const collabRequests = [
    {
        id: 1,
        name: "Aisha Raza",
        handle: "@aisharaza.style",
        platform: "Instagram",
        followers: "142K",
        niche: "Lifestyle & Fashion",
        types: ["Sponsored Post", "Instagram Reel"],
        budget: "₹15,000 – ₹25,000",
        timeline: "July 2026",
        goals: "I want to showcase your handcrafted home decor pieces to my minimalist lifestyle audience in a 3-post campaign.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
        status: "Pending",
        date: "Jun 18, 2026"
    },
    {
        id: 2,
        name: "Rohan Kapoor",
        handle: "@rohan.creates",
        platform: "YouTube",
        followers: "89K",
        niche: "Home & Interior",
        types: ["YouTube Integration", "Product Review"],
        budget: "₹30,000 – ₹50,000",
        timeline: "August 2026",
        goals: "Looking to create a full 'Home Makeover on a Budget' video featuring Abeer's terracotta and earthen decor collection.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
        status: "Approved",
        date: "Jun 15, 2026"
    },
    {
        id: 3,
        name: "Priya Sharma",
        handle: "@priya.earthyliving",
        platform: "Instagram",
        followers: "67K",
        niche: "Sustainable Living",
        types: ["Brand Ambassador", "Giveaway"],
        budget: "₹10,000 – ₹20,000",
        timeline: "Ongoing",
        goals: "Passionate about sustainable brands. Would love to be a brand ambassador and run monthly giveaways for your audience.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
        status: "Pending",
        date: "Jun 14, 2026"
    },
    {
        id: 4,
        name: "Meera Joshi",
        handle: "@meera.interiors",
        platform: "Instagram",
        followers: "210K",
        niche: "Interior Design",
        types: ["Long-term Partnership", "Sponsored Post"],
        budget: "₹50,000+",
        timeline: "Q3 2026",
        goals: "I feature curated Indian artisan brands in my interior reveals. Your brand fits perfectly for a Q3 campaign.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
        status: "Rejected",
        date: "Jun 10, 2026"
    },
];

export default function CollaborationsPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [requests, setRequests] = useState(collabRequests);
    const [selectedCollab, setSelectedCollab] = useState(null);

    const filtered = activeFilter === "All"
        ? requests
        : requests.filter(r => r.status === activeFilter);

    const updateStatus = (id, newStatus) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        if (selectedCollab?.id === id) setSelectedCollab(prev => ({ ...prev, status: newStatus }));
    };

    const PlatformIcon = ({ platform }) => {
        if (platform === "YouTube") return <BsYoutube style={{ color: "#ff4444" }} />;
        return <BsInstagram style={{ color: "var(--text-light)" }} />;
    };

    return (
        <div className="dashboard-page">
            <DashboardTitles title="Brand Collaborations" subtitle="Outreach • Influencer Requests" />
            <div className="dashboard-wrapper">

                {/* Top Bar */}
                <div className="orders-top-bar">
                    <Searchbar placeholder="Search by name, handle, niche..." />
                    <div className="order-filters">
                        {FILTERS.map(f => (
                            <button
                                key={f}
                                className={`filter-btn ${activeFilter === f ? "active" : ""}`}
                                onClick={() => setActiveFilter(f)}
                            >{f}</button>
                        ))}
                    </div>
                </div>

                {/* Requests Table */}
                <div className="orders-table-wrapper glass-panel" style={{ padding: 0 }}>
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Influencer</th>
                                <th>Platform</th>
                                <th>Followers</th>
                                <th>Niche</th>
                                <th>Budget</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((req) => (
                                <tr key={req.id}>
                                    <td>
                                        <div className="collab-influencer">
                                            <div>
                                                <div className="customer-name">{req.name}</div>
                                                <div className="customer-email">{req.handle}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="collab-platform">
                                            <PlatformIcon platform={req.platform} />
                                            <span className="customer-name" style={{ fontSize: "13px" }}>{req.platform}</span>
                                        </div>
                                    </td>
                                    <td className="customer-name" style={{ fontSize: "13px" }}>{req.followers}</td>
                                    <td className="order-date">{req.niche}</td>
                                    <td className="order-date">{req.budget}</td>
                                    <td className="order-date">{req.date}</td>
                                    <td>
                                        <span className={`collab-status ${req.status.toLowerCase()}`}>{req.status}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button className="details-btn" onClick={() => setSelectedCollab(req)}>
                                                <BsEye />
                                            </button>
                                            {req.status === "Pending" && (
                                                <>
                                                    <button className="collab-approve-btn" onClick={() => updateStatus(req.id, "Approved")}>
                                                        <BsCheckLg />
                                                    </button>
                                                    <button className="collab-reject-btn" onClick={() => updateStatus(req.id, "Rejected")}>
                                                        <BsXLg />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination />
                </div>

            </div>

            {/* Detail Modal */}
            {selectedCollab && (
                <div className="modal-overlay" onClick={() => setSelectedCollab(null)}>
                    <div className="order-modal glass-panel" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Collaboration Request</h2>
                            <button className="modal-close" onClick={() => setSelectedCollab(null)}><RxCross2 /></button>
                        </div>
                        <div className="modal-body">
                            {/* Influencer Info */}
                            <div className="collab-modal-profile">
                                <div>
                                    <div className="modal-product-name">{selectedCollab.name}</div>
                                    <div className="modal-customer-meta">{selectedCollab.handle} • {selectedCollab.followers} followers</div>
                                    <div className="modal-customer-meta">{selectedCollab.niche}</div>
                                    <span className={`collab-status ${selectedCollab.status.toLowerCase()}`} style={{ marginTop: "8px", display: "inline-block" }}>{selectedCollab.status}</span>
                                </div>
                            </div>

                            <div className="modal-grid">
                                <div className="modal-section">
                                    <div className="modal-section-label">Platform</div>
                                    <div className="modal-customer-name">{selectedCollab.platform}</div>
                                </div>
                                <div className="modal-section">
                                    <div className="modal-section-label">Budget Range</div>
                                    <div className="modal-customer-name">{selectedCollab.budget}</div>
                                </div>
                                <div className="modal-section">
                                    <div className="modal-section-label">Timeline</div>
                                    <div className="modal-customer-name">{selectedCollab.timeline}</div>
                                </div>
                                <div className="modal-section">
                                    <div className="modal-section-label">Request Date</div>
                                    <div className="modal-customer-name">{selectedCollab.date}</div>
                                </div>
                            </div>

                            <div className="modal-section">
                                <div className="modal-section-label">Collab Types</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                                    {selectedCollab.types.map((t, i) => (
                                        <span key={i} className="size-badge">{t}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-section">
                                <div className="modal-section-label">Their Message / Goals</div>
                                <div className="collab-goals-text">{selectedCollab.goals}</div>
                            </div>

                            {selectedCollab.status === "Pending" && (
                                <div className="modal-footer">
                                    <button className="collab-approve-btn" style={{ padding: "10px 20px", fontSize: "13px" }} onClick={() => updateStatus(selectedCollab.id, "Approved")}>
                                        <BsCheckLg /> Approve
                                    </button>
                                    <button className="collab-reject-btn" style={{ padding: "10px 20px", fontSize: "13px" }} onClick={() => updateStatus(selectedCollab.id, "Rejected")}>
                                        <BsXLg /> Reject
                                    </button>
                                    <button className="modal-close-btn" onClick={() => setSelectedCollab(null)}>Close</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
