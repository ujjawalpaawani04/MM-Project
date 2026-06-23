import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { AnimatePresence, motion } from "framer-motion";

import { findOrder, getOrderStatus } from "../../utils/orders";
import TrackOrderHero from "./Components/TrackOrderHero";
import TrackForm from "./Components/TrackForm";
import OrderDetails from "./Components/OrderDetails";
import StatusTimeline from "./Components/StatusTimeline";
import OrderSummary from "./Components/OrderSummary";
import TrackingSkeleton from "./Components/TrackingSkeleton";
import NotFound from "./Components/NotFound";
import TrackFaq from "./Components/TrackFaq";
import SupportSection from "./Components/SupportSection";
import Seo from "../../components/common/Seo";

// status: "idle" | "loading" | "found" | "not-found"
export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("idle");
  const [order, setOrder] = useState(null);
  const [query, setQuery] = useState("");
  const resultsRef = useRef(null);
  const autoTracked = useRef(false);

  const runLookup = (value) => {
    const trimmed = value.trim();
    setQuery(trimmed);
    setStatus("loading");
    setOrder(null);
    // Simulated lookup latency so loading states are visible.
    setTimeout(() => {
      const found = findOrder(trimmed);
      if (found) {
        setOrder(found);
        setStatus("found");
      } else {
        setStatus("not-found");
      }
      requestAnimationFrame(() =>
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      );
    }, 900);
  };

  // Auto-track when arriving from checkout with ?tracking=MM-2026-000123.
  useEffect(() => {
    const tracking = searchParams.get("tracking");
    if (tracking && !autoTracked.current) {
      autoTracked.current = true;
      runLookup(tracking);
    }
  }, [searchParams]);

  const statusInfo = order ? getOrderStatus(order) : null;

  return (
    <>
      <Seo
        title="Track Your Order"
        url="https://mohanmaya.com/track-order"
        description="Track your MohanMaya order in real time with your tracking number."
      />
      <TrackOrderHero />

      <section className="bg-ink-50 dark:bg-ink-900 py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <TrackForm
            onTrack={runLookup}
            loading={status === "loading"}
            hasResult={status === "found"}
            defaultValue={query || searchParams.get("tracking") || ""}
          />

          <div ref={resultsRef} className="scroll-mt-24">
            <AnimatePresence mode="wait">
              {status === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TrackingSkeleton />
                </motion.div>
              )}

              {status === "not-found" && (
                <motion.div
                  key="not-found"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <NotFound query={query} />
                </motion.div>
              )}

              {status === "found" && order && (
                <motion.div
                  key={order.trackingNumber}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="grid lg:grid-cols-3 gap-6"
                >
                  <div className="lg:col-span-2 space-y-6">
                    <OrderDetails order={order} status={statusInfo} />
                    <StatusTimeline status={statusInfo} />
                  </div>
                  <div className="lg:col-span-1">
                    <OrderSummary order={order} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <TrackFaq />
      <SupportSection />
    </>
  );
}
