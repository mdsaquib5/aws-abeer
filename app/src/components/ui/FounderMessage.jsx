import Image from "next/image";
import Titles from "../layout/Titles";

const FounderMessage = () => {
    return (
        <section className="founder-section">
            <div className="container">
                <div className="founder-wrapper">
                    <div className="founder-image-container">
                        <Image
                            src="https://pub-cb079d032bb540259b2f627128c60f40.r2.dev/static%20media/logo-image.png"
                            alt="Abeer Founder"
                            fill
                            sizes="(max-width: 992px) 100vw, 50vw"
                            priority={true}
                            className="founder-img"
                        />
                        <div className="founder-image-accent"></div>
                    </div>

                    <div className="founder-content-card">
                        <Titles subTitle="The Vision" title="Founder's Message" />

                        <div className="founder-text">
                            <p>
                                Abeer is a reflection of slow fashion, quiet luxury, and timeless design. Born from a love for Indian craftsmanship, we create consciously made pieces that remain relevant long after trends fade.
                            </p>
                            <p>
                                Our designs carry the nostalgia of the Y2K era while embracing the ease and confidence of the modern woman. Abeer is for the desi muse who finds herself between two worlds—somewhere between 2000 and 2026.
                            </p>
                            <p>
                                She loves ethnic wear but seeks a contemporary edge. She has a modern mindset yet a soft heart. She still pauses for poetry. Chooses chai over coffee. Prefers auto rides over luxury cars. Finds beauty in the little things.
                            </p>
                            <p>
                                Through thoughtful silhouettes, breathable fabrics, handcrafted details, and modern interpretations of traditional wear, we bring her vision to life. At Abeer, we don't just create clothes. We create pieces for women who carry nostalgia in their hearts and confidence in their stride.
                            </p>
                        </div>

                        <div className="founder-signature">
                            <div className="signature-name">- Mariyam Rehan</div>
                            <div className="signature-title">FOUNDER</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FounderMessage;