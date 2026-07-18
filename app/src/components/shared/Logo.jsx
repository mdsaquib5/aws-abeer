import Link from "next/link";

const Logo = () => {
    return (
        <div className="logo">
            <Link href={'/'}>
                <div className="logo-text">Abeer</div>
                <span>अबीर</span>
            </Link>
        </div>
    )
}

export default Logo;