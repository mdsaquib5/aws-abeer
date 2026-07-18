import dynamic from "next/dynamic";
import Category from "@/components/ui/Category";
import Hero from "@/components/ui/Hero";

const Collection = dynamic(() => import("@/components/ui/Collection"), { ssr: true });
const OurProduct = dynamic(() => import("@/components/ui/OurProduct"), { ssr: true });
const Instagram = dynamic(() => import("@/components/ui/Instagram"), { ssr: true });
const Testimonial = dynamic(() => import("@/components/ui/Testimonial"), { ssr: true });
const FounderMessage = dynamic(() => import("@/components/ui/FounderMessage"), { ssr: true });
const Services = dynamic(() => import("@/components/ui/Services"), { ssr: true });

export default function Home() {
  return (
    <>
      <Hero />
      <Category />
      <Collection />
      <OurProduct />
      <Instagram />
      <Testimonial />
      <FounderMessage />
      <Services />
    </>
  );
}
