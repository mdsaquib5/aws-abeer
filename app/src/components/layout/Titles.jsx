import { BsFlower2 } from "react-icons/bs";

const Titles = ({ title, subTitle }) => {
    return (
        <div className="section-title">
            <div className="sub-heading">{subTitle}</div>
            <div className="heading">{title}</div>
            <div className="bottom-style"><BsFlower2 /></div>
        </div>
    )
}

export default Titles;