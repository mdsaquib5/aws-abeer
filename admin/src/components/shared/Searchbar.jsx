import { CiSearch } from "react-icons/ci";

const Searchbar = ({ placeholder = "Search...", value, onChange }) => {
  return (
    <div className="search-input-container">
        <CiSearch className="admin-search" />
        <input 
            type="text" 
            className="search-input" 
            placeholder={placeholder} 
            value={value}
            onChange={onChange}
        />
    </div>
  )
}

export default Searchbar;