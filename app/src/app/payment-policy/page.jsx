import TopHeader from "@/components/pages/TopHeader";

const page = () => {
    return (
        <div className="pages">
            <TopHeader
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Payment Policy', href: null }]}
            />
            <div className="shop-page-wrapper">
                <div className="container">

                    <div className="policy-content">
                        <h2>Order Confirmation</h2>
                        <p>At Abeer, every silhouette is custom crafted to your measurements and choices. An order is officially confirmed only after a successful electronic payment transaction is completed.</p>

                        <h2>Prepaid Only Policy</h2>
                        <p>To maintain the integrity of our slow-crafted handmade workflow, **we do not accept Cash on Delivery (COD)**. All purchases made via the Abeer online storefront must be fully prepaid. We accept all major credit/debit cards, UPI payments, and net banking options.</p>

                        <h2>Cancellation & Alterations</h2>
                        <p>Once your payment is completed and order details are logged, the processing cycle begins, and the order **cannot be cancelled or refunded**.</p>
                        <p>We advise all customers to review sizing specifications, fit drapes, and shipping address details thoroughly prior to order submission. If you make a mistake on your shipping details, contact customer care immediately via WhatsApp (+91 8076006802) within 12 hours.</p>

                        <h2>Customization Guidelines</h2>
                        <p>Orders placed directly on our website are processed with standard dimensions and cannot be customized.</p>
                        <p>Customization requests (length adjustments, sizing tweaks, pattern modifications) are accepted **only through Instagram DM (@abeer.label) or WhatsApp (+91 8076006802)** prior to ordering. Customization charges start from a base fee of **₹200 onwards** depending on the alterations requested.</p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default page;