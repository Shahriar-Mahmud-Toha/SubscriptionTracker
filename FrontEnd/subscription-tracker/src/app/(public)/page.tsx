import heroImage from "../../../public/assets/images/SubscriptionTracker-Overview.webp";
import HomeHero from "@/components/heros/home-hero";
import HeroNotes from "@/components/specialNotes/hero-notes";
import LinkButtonRegular from "@/components/buttons/link-button-regular";

export default function Home() {
  return (
    <div className="mb-20">
      <HomeHero image={heroImage} imgAlt="Subscription Tracker Hero Image" appName="Subscription Tracker" appNameColor="text-custom-violet" heroText="is an online tool designed to help you easily manage your subscription details and receive automatic email reminders before any subscription expires." />
      <HeroNotes noteText="This tool is created for testing purposes only and is not intended for real-world use." customClasses="my-5" />
      <div className="flex justify-center mt-10">
        <LinkButtonRegular href="/login" text="Get Started" />
      </div>
    </div>
  );
}
