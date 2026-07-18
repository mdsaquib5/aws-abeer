"use client";

import { useState } from "react";
import { HiOutlineDotsVertical, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

const DataTable = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.label}</th>
            ))}
            <th className="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              <td className="actions-cell">
                <button className="action-btn edit-btn" onClick={() => onEdit && onEdit(row)}>
                  <HiOutlinePencil />
                </button>
                <button className="action-btn delete-btn" onClick={() => onDelete && onDelete(row)}>
                  <HiOutlineTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="empty-state">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;
