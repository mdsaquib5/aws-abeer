import TopHeader from "@/components/pages/TopHeader";

const page = () => {
    return (
        <div className="pages">
            <TopHeader
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy', href: null }]}
            />
            <div className="shop-page-wrapper">
                <div className="container">

                    <div className="policy-content">
                        <h2>Information Collection</h2>
                        <p>When you purchase our custom silhouettes or join the Abeer Muse newsletter list, we collect essential customer details: your name, shipping address, email address, and phone number.</p>
                        <p>This information is used strictly to fulfill your orders, custom-craft your sizes, process shipments, and send tracking notices or exclusive collection narratives.</p>

                        <h2>Cookies & Cart Persistence</h2>
                        <p>Our storefront uses local storage and cookies to maintain your shopping cart state across browser sessions. This allows your selected items to survive refreshes, session timeouts, and browser restarts.</p>
                        <p>No personal tracking data is stored within these cookies, and they can be cleared at any time via your browser settings.</p>

                        <h2>Payment Security</h2>
                        <p>Transactions processed on Abeer are routed through fully certified, secure, and encrypted payment gateways. Abeer **does not store or inspect credit card numbers, banking log-ins, or UPI credentials** on our servers.</p>

                        <h2>Third-Party Sharing</h2>
                        <p>Your personal information is shared with third-party partners only when necessary (e.g. sharing your shipping address and phone with our courier partners for delivery). We do not sell or trade your details to marketing agencies.</p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default page;