import TopHeader from "@/components/pages/TopHeader";
import CollaborationSlider from "@/components/pages/CollaborationSlider";

const page = () => {
    return (
        <div className="pages">
            <TopHeader
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Collaboration', href: null }]}
            />
            <div className="shop-page-wrapper">
                <div>
                    <CollaborationSlider />
                </div>
            </div>
        </div>
    )
}

export default page;