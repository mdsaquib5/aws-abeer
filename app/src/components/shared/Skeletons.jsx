import React from "react";

export const BlogSkeleton = () => (
  <div className="blog-card skeleton" style={{ animation: "pulse 1.5s infinite ease-in-out" }}>
    <div className="blog-img" style={{ background: "#1b1414", height: "350px", width: "100%", borderRadius: "8px" }} />
    <div className="blog-content" style={{ padding: "20px 0" }}>
      <div style={{ background: "#1b1414", height: "24px", width: "80%", marginBottom: "12px", borderRadius: "4px" }} />
      <div style={{ background: "#1b1414", height: "14px", width: "100%", marginBottom: "8px", borderRadius: "4px" }} />
      <div style={{ background: "#1b1414", height: "14px", width: "90%", marginBottom: "16px", borderRadius: "4px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ background: "#1b1414", height: "12px", width: "80px", borderRadius: "4px" }} />
        <div style={{ background: "#1b1414", height: "10px", width: "60px", borderRadius: "4px" }} />
      </div>
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="category-card skeleton" style={{ animation: "pulse 1.5s infinite ease-in-out" }}>
    <div className="category-img" style={{ background: "#1b1414", borderRadius: "50%" }} />
    <div style={{ background: "#1b1414", height: "16px", width: "60%", margin: "12px auto 6px auto", borderRadius: "4px" }} />
    <div style={{ background: "#1b1414", height: "12px", width: "40%", margin: "0 auto", borderRadius: "4px" }} />
  </div>
);

export const ProductSkeleton = () => (
  <div className="product-card skeleton" style={{ animation: "pulse 1.5s infinite ease-in-out" }}>
    <div className="product-image" style={{ background: "#1a1a1a", height: "320px", display: "block" }} />
    <div className="product-details-area" style={{ padding: "16px" }}>
      <div style={{ background: "#1a1a1a", height: "10px", width: "40%", marginBottom: "8px" }} />
      <div style={{ background: "#1a1a1a", height: "16px", width: "70%", marginBottom: "8px" }} />
      <div style={{ background: "#1a1a1a", height: "12px", width: "100%", marginBottom: "12px" }} />
      <div style={{ background: "#1a1a1a", height: "16px", width: "30%" }} />
    </div>
  </div>
);
