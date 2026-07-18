import React from 'react';

const Pagination = () => {
    return (
        <div className="pagination" style={{ margin: '20px' }}>
            <button className="page-btn text-btn disabled">Prev</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span style={{ color: '#888' }}>...</span>
            <button className="page-btn">10</button>
            <button className="page-btn text-btn">Next</button>
        </div>
    );
};

export default Pagination;
