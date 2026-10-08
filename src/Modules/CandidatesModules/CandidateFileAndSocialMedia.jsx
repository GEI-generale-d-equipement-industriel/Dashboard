import React from "react";
import {
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TikTokOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { Link2, Mic, Video } from "lucide-react";

/* ── Social platform meta ──────────────────────────────────────────────── */
const SOCIAL_META = {
  facebook: { icon: FacebookOutlined, label: "Facebook", color: "#1877f2" },
  twitter: { icon: TwitterOutlined, label: "Twitter / X", color: "#1da1f2" },
  x: { icon: TwitterOutlined, label: "X", color: "#14110b" },
  instagram: { icon: InstagramOutlined, label: "Instagram", color: "#c13584" },
  linkedin: { icon: LinkedinOutlined, label: "LinkedIn", color: "#0a66c2" },
  tiktok: { icon: TikTokOutlined, label: "TikTok", color: "#14110b" },
};

// Social links are stored either as objects or as JSON strings.
const parseSocialLinks = (links) =>
  (links || [])
    .map((link) => {
      if (typeof link !== "string") return link;
      try {
        return JSON.parse(link);
      } catch (error) {
        return null;
      }
    })
    .filter((link) => link?.link);

const isVideo = (file) =>
  file.contentType?.startsWith("video/") ||
  (file.filename?.toLowerCase().includes("video") && !file.contentType?.startsWith("image/"));

export const SocialLinks = ({ candidate }) => {
  const links = parseSocialLinks(candidate?.socialMedia);
  if (links.length === 0) return null;

  return (
    <div className="bm-social" aria-label="Réseaux sociaux">
      {links.map((link, index) => {
        const platform = link.type?.toLowerCase();
        const meta = SOCIAL_META[platform];
        const Icon = meta?.icon;

        return (
          <a
            key={`${platform}-${index}`}
            href={link.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bm-social__link"
            style={{ "--social": meta?.color || "#14110b" }}
          >
            <span className="bm-social__icon">{Icon ? <Icon /> : <Link2 size={16} />}</span>
            {meta?.label || platform || "Lien"}
          </a>
        );
      })}
    </div>
  );
};

const CandidateFilesAndSocialMedia = ({ candidate }) => {
  const videoFiles = (candidate?.files || []).filter(isVideo);

  const audioFiles = [
    ...(candidate?.files || []).filter((file) => file.contentType?.startsWith("audio/")),
    candidate?.voiceUrl ? { filename: candidate.voiceUrl } : null,
  ].filter(Boolean);

  if (videoFiles.length === 0 && audioFiles.length === 0) return null;

  return (
    <div className="bm-media">
      {videoFiles.length > 0 && (
        <section>
          <h2 className="bm-section__title">
            <Video size={16} /> Vidéos <span className="bm-count">{videoFiles.length}</span>
          </h2>
          <div className="bm-media__videos">
            {videoFiles.map((file, index) => (
              <video key={file.filename || index} controls preload="metadata" className="bm-media__video">
                <source src={file.filename} type={file.contentType || "video/mp4"} />
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            ))}
          </div>
        </section>
      )}

      {audioFiles.length > 0 && (
        <section>
          <h2 className="bm-section__title">
            <Mic size={16} /> Voix & audio <span className="bm-count">{audioFiles.length}</span>
          </h2>
          <div className="bm-media__audios">
            {audioFiles.map((file, index) => (
              <div key={file.filename || index} className="bm-audio">
                <span className="bm-audio__icon">
                  <Mic size={18} />
                </span>
                <div className="bm-audio__body">
                  <a href={file.filename} target="_blank" rel="noopener noreferrer">
                    Enregistrement {index + 1}
                  </a>
                  <audio controls preload="none">
                    <source src={file.filename} type={file.contentType} />
                    Votre navigateur ne supporte pas la lecture audio.
                  </audio>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CandidateFilesAndSocialMedia;
