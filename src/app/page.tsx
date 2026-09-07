import Hero from "@/components/sections/Hero";
import WaysToPlan from "@/components/sections/WaysToPlan";
import Pillars from "@/components/sections/Pillars";
import Method from "@/components/sections/Method";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimony from "@/components/sections/Testimony";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import ImageBreak from "@/components/sections/ImageBreak";
import { IMAGES } from "@/lib/images";

export default function Home() {
  return (
    <>
      <Hero />
      <WaysToPlan />
      <Pillars />
      <Method />
      <HowItWorks />
      <Testimony />
      <Stats />
      <Services />
      <ImageBreak
        image={IMAGES.happyFamily}
        title="Ready to plan the family you imagine?"
        subtitle="Create your private account and receive your personalised plan within 24 hours. Private, considered, and entirely natural."
        linkText="Plan Baby Gender"
        linkHref="/contact"
      />
    </>
  );
}
