import TopHeader from "@/components/pages/TopHeader";

const page = () => {
    return (
        <div className="pages">
            <TopHeader
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Return Policy', href: null }]}
            />
            <div className="shop-page-wrapper">
                <div className="container">

                    <div className="policy-content">
                        <h2>Return Policy (Damaged Items Only)</h2>
                        <p>At Abeer, we stand behind the quality of our handcrafted luxury ethnic wear. **Returns are accepted only in the case of manufacturing damages or defective products received.**</p>
                        <p>To initiate a return for a damaged item:</p>
                        <p style={{ paddingLeft: '20px' }}>The damage request must be raised within **3 days** of order delivery.</p>
                        <p style={{ paddingLeft: '20px' }}>You must contact customer support via WhatsApp or email with your Order ID.</p>
                        <p>An unboxing video is mandatory. The video must show the package seal being opened for the first time and inspect the item clearly. Claims without a complete, continuous unboxing video will not be accepted.</p>

                        <h2>Exchange Policy (Sizing Only)</h2>
                        <p>We provide exchanges exclusively for **size discrepancies**. If a piece does not fit as desired, you can request a size exchange within **3 days** of delivery.</p>
                        <p>Please note the following exchange criteri</p>

                        <p style={{ paddingLeft: '20px' }}>Exchanges are strictly subject to product size availability in our warehouse.</p>
                        <p style={{ paddingLeft: '20px' }}>The garment must be returned in **unused, unwashed, and original condition** with all brand tags attached.</p>
                        <p style={{ paddingLeft: '20px' }}>Customized order items are ineligible for size exchanges.</p>

                        <h2>Refund Policy (Store Credit)</h2>
                        <p>Abeer **does not offer monetary or bank refunds** for order returns or size discrepancies.</p>
                        <p>Upon validating and processing an eligible return claim, you will be issued **Store Credit** matching the purchase amount. Store credit carries no expiration date and can be applied to any future silhouette releases on our online shop.</p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default page;