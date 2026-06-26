import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import Seo from "../../components/common/Seo";
import PageHero from "../../components/common/PageHero";
import useYouTubeVideos from "../../hooks/useYouTubeVideos";
import useChannel from "../../hooks/useChannel";
import useInstagram from "../../hooks/useInstagram";
import { cn } from "../../utils/cn";

import CommunityTabs from "./Components/CommunityTabs";
import ChannelHeader from "./Components/ChannelHeader";
import YouTubeGrid from "./Components/YouTubeGrid";
import ContentPillars from "./Components/ContentPillars";
import SubscribeBanner from "./Components/SubscribeBanner";
import InstagramPanel from "./Components/InstagramPanel";
import ComingSoon from "./Components/ComingSoon";
import VideoModal from "./Components/VideoModal";
import { PLATFORM_THEMES, PLATFORM_ORDER, getTheme } from "./Components/platformThemes";
import { SOCIALS } from "./socials";

const TABS = PLATFORM_ORDER.map((id) => ({
  id,
  label: PLATFORM_THEMES[id].name,
  icon: PLATFORM_THEMES[id].Icon,
}));

const socialUrl = (id) => SOCIALS.find((s) => s.id === id)?.url || "#";

/** Slow-drifting coloured orb that gives each theme its ambient atmosphere. */
function FloatingBlob({ className, index }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full blur-3xl", className)}
      animate={
        reduceMotion ? undefined : { y: [0, -28, 0], x: [0, 18, 0], scale: [1, 1.08, 1] }
      }
      transition={{ duration: 14 + index * 3, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function Community() {
  const [active, setActive] = useState("youtube");
  const [activeVideo, setActiveVideo] = useState(null);

  // Both feeds are fetched once at the page level so switching tabs never
  // re-fetches. pageSize matches the grid's PER_PAGE (one fetch == one page).
  const { videos, status, error, isLoadingMore, total, hasMore, loadMore, retry } =
    useYouTubeVideos({ pageSize: 12 });
  const { channel, loading: channelLoading } = useChannel();
  const {
    profile: igProfile,
    posts: igPosts,
    status: igStatus,
    error: igError,
    retry: igRetry,
  } = useInstagram();

  const theme = getTheme(active);

  return (
    <>
      <Seo
        title="Community"
        url="https://mohanmaya.com/community"
        description="Join the MohanMaya community — watch our latest YouTube stories and behind-the-scenes from the world of handcrafted devotional miniatures."
      />

      {/* ---- Hero (unchanged) ---- */}
      <PageHero
        image="/website/images/heroBg.webp"
        eyebrow="Our Community"
        title="Stories from"
        highlight="MohanMaya"
        description="Heartfelt shorts, devotional stories and behind-the-scenes moments — straight from our channel to you. Follow along and become part of the family."
      />

      {/* ---- Dynamically themed community environment ---- */}
      <section className="relative isolate overflow-hidden py-16 lg:py-24">
        {/* Crossfading per-platform background + floating ambient blobs */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={theme.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={cn("absolute inset-0 -z-10", theme.pageBg)}
          >
            <div className={cn("absolute inset-0", theme.overlay)} />
            {theme.blobs.map((blob, i) => (
              <FloatingBlob key={i} className={blob} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Tab switcher */}
          <CommunityTabs tabs={TABS} active={active} onChange={setActive} theme={theme} />

          {/* Tab panels — each swaps the whole platform environment */}
          <div className="mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                role="tabpanel"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {active === "youtube" && (
                  <>
                    <ChannelHeader
                      channel={channel}
                      loading={channelLoading}
                      href={socialUrl("youtube")}
                    />
                    <YouTubeGrid
                      videos={videos}
                      status={status}
                      error={error}
                      isLoadingMore={isLoadingMore}
                      total={total}
                      hasMore={hasMore}
                      loadMore={loadMore}
                      retry={retry}
                      onPlay={setActiveVideo}
                    />

                    {/* Enrichment sections — only on the YouTube tab */}
                    <ContentPillars />
                    <SubscribeBanner href={socialUrl("youtube")} />
                  </>
                )}

                {active === "instagram" && (
                  <InstagramPanel
                    profile={igProfile}
                    posts={igPosts}
                    status={igStatus}
                    error={igError}
                    retry={igRetry}
                    href={socialUrl("instagram")}
                  />
                )}

                {active === "facebook" && (
                  <ComingSoon theme={theme} href={socialUrl("facebook")} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      </section>
    </>
  );
}
