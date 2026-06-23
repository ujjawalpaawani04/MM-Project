import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import { FiExternalLink } from "react-icons/fi";

/**
 * In-page YouTube player built on the shared <Modal>. Embeds the privacy-
 * friendly youtube-nocookie player and autoplays on open. Re-keying the iframe
 * on videoId ensures the player resets between videos.
 */
export default function VideoModal({ video, onClose }) {
  const isOpen = Boolean(video);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={video?.title}
      className="bg-white dark:bg-slate-900"
    >
      {video && (
        <div className="p-4 sm:p-5">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-inner">
            <iframe
              key={video.videoId}
              src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="sm"
              icon={FiExternalLink}
              iconRight
            >
              Watch on YouTube
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
