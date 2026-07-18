import Image from "next/image";
import Link from "next/link";
import { HiOutlineArrowLongRight } from "react-icons/hi2";

const BlogCard = ({ item }) => {
    return (
        <div className="blog-card">
            <div className="blog-img">
                <Image src={item.img} alt="blog" width={640} height={640} loading="lazy" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                <Link href={item.blogLink} className="icon"><HiOutlineArrowLongRight /></Link>
            </div>
            <div className="blog-content">
                <div className="blog-title"><Link href={item.blogLink || "/"}>
                    {item.title}
                </Link></div>
                <p>{item.desc}</p>
                <div className="author-detail">

                    <div className="name-date">
                        <div className="author">{item.author}</div>
                        <div className="date">{item.date}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogCard;