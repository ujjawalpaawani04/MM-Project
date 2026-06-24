import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiYoutube, FiInstagram, FiFacebook } from "react-icons/fi";

import Seo from "../../components/common/Seo";
import PageHero from "../../components/common/PageHero";
import useYouTubeVideos from "../../hooks/useYouTubeVideos";

import CommunityTabs from "./Components/CommunityTabs";
import ChannelStats from "./Components/ChannelStats";
import YouTubeGrid from "./Components/YouTubeGrid";
import SocialPanel from "./Components/SocialPanel";
import VideoModal from "./Components/VideoModal";
import { SOCIALS } from "./socials";

const TABS = [
  { id: "youtube", label: "YouTube", icon: FiYoutube },
  { id: "instagram", label: "Instagram", icon: FiInstagram },
  { id: "facebook", label: "Facebook", icon: FiFacebook },
];

const socialUrl = (id) => SOCIALS.find((s) => s.id === id)?.url || "#";

export default function Community() {
  const [active, setActive] = useState("youtube");
  const [activeVideo, setActiveVideo] = useState(null);

  // Fetched once at the page level so switching tabs never re-fetches the feed.
  const {
    videos,
    status,
    error,
    isLoadingMore,
    hasMore,
    loadMore,
    retry,
  } = useYouTubeVideos({ pageSize: 9 });

  return (
    <>
      <Seo
        title="Community"
        url="https://mohanmaya.com/community"
        description="Join the MohanMaya community - watch our latest YouTube stories, shorts and behind-the-scenes from the world of handcrafted devotional miniatures."
      />

      <PageHero
        image="/website/images/heroBg.webp"
        eyebrow="Our Community"
        title="Stories from"
        highlight="MohanMaya"
        description="Heartfelt shorts, devotional stories and behind-the-scenes moments - straight from our channel to you. Follow along and become part of the family."
      />

      <section className="relative bg-ink-50 py-16 dark:bg-ink-900 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Live channel stats */}
          <div className="mx-auto max-w-3xl">
            <ChannelStats />
          </div>

          {/* Tab switcher */}
          <div className="mt-12">
            <CommunityTabs tabs={TABS} active={active} onChange={setActive} />
          </div>

          {/* Tab panels */}
          <div className="mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                role="tabpanel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {active === "youtube" && (
                  <YouTubeGrid
                    videos={videos}
                    status={status}
                    error={error}
                    isLoadingMore={isLoadingMore}
                    hasMore={hasMore}
                    loadMore={loadMore}
                    retry={retry}
                    onPlay={setActiveVideo}
                  />
                )}

                {active === "instagram" && (
                  <SocialPanel
                    icon={FiInstagram}
                    accent="instagram"
                    network="Instagram"
                    href={socialUrl("instagram")}
                    description="Daily moments, reels and miniature close-ups. Our Instagram feed will live here soon - in the meantime, come say hello."
                  />
                )}

                {active === "facebook" && (
                  <SocialPanel
                    icon={FiFacebook}
                    accent="facebook"
                    network="Facebook"
                    href={socialUrl("facebook")}
                    description="Join the conversation, events and community stories. Our Facebook feed will appear here soon - follow our page to stay connected."
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  );
}
