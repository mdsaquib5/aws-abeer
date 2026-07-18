import Image from "next/image";
import Titles from "../layout/Titles";
import Link from "next/link";

const Collection = () => {
    return (
        <section className="collection-section section-padding">
            <div className="container">
                <Titles subTitle="Conscious Silhouettes" title="The Collections" />
                <div className="collection-grid">
                    <div className="collection-card">
                        <div className="collection-image">
                            <div className="collection-badge">ACTIVE COLLECTION</div>
                            <Image src={'https://pub-cb079d032bb540259b2f627128c60f40.r2.dev/static%20media/basant-bahar.jpg'} alt="Basant Bahaar" fill sizes="(max-width: 768px) 100vw, 50vw" priority style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="collection-content">
                            <div className="collection-name">BASANT BAHAAR</div>
                            <div className="collection-heading">Reflections of Spring</div>
                            <p>A celebration of Indian craftsmanship and breathing space. Crafted from cotton-silk Mal-Chander, featuring the Geet, Hania, and Qala sets.</p>
                            <Link href={'/shop'} className="btn primary-btn">SHOP NOW</Link>
                        </div>
                    </div>
                    <div className="collection-card">
                        <div className="collection-image">
                            <div className="collection-badge">LAUNCHING SOON</div>
                            <Image src={'https://pub-cb079d032bb540259b2f627128c60f40.r2.dev/static%20media/nargis-profile.jpg'} alt="Nargis" fill sizes="(max-width: 768px) 100vw, 50vw" priority style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="collection-content">
                            <div className="collection-name">FLORAL AFFAIRE — NARGIS</div>
                            <div className="collection-heading">Nostalgia of Summer</div>
                            <p>Soft feminine luxury inspired by the poetry of blooming jasmine and Y2K ethnic silhouettes. Coming soon to the Abeer Muse lookbook.</p>
                            <Link href={'/shop'} className="btn primary-btn">SHOP NOW</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Collection;