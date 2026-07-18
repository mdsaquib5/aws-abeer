import Image from "next/image";
import Link from "next/link";

const BlogCard = ({ item }) => {
    return (
        <div className="blog-card">
            <div className="blog-img">
                <Image src={item.img || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=640&auto=format&fit=crop"} alt="blog" width={600} height={400} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
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