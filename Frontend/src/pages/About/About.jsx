import AboutHero from "./Components/AboutHero";
import Story from "./Components/Story";
import Timeline from "./Components/Timeline";
import MissionVision from "./Components/MissionVision";
import Process from "./Components/Process";
import Stats from "./Components/Stats";
import JourneyCTA from "./Components/JourneyCTA";
import Seo from "../../components/common/Seo";

export default function About() {
  return (
    <>
      <Seo
        title="Our Story"
        url="https://mohanmaya.com/about"
        description="The story behind MohanMaya - artisans, mission and craft behind every handcrafted devotional miniature."
      />
      <AboutHero />
      <Story />
      <Timeline />
      <MissionVision />
      <Stats />
      <Process />
      <JourneyCTA />
    </>
  );
}
