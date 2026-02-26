import React from "react";
import { Carousel, Button } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TikTokOutlined,
  LeftOutlined,
  RightOutlined,
  SoundOutlined,
  VideoCameraOutlined,
  LinkOutlined,
} from "@ant-design/icons";

/* ── Social platform meta ──────────────────────────────────────────────── */
const SOCIAL_META = {
  facebook: {
    icon: FacebookOutlined,
    label: "Facebook",
    bg: "bg-[#f0f4ff]",
    iconColor: "text-[#1877F2]",
    border: "border-[#c9d9f5]",
  },
  twitter: {
    icon: TwitterOutlined,
    label: "Twitter / X",
    bg: "bg-[#f0fbff]",
    iconColor: "text-[#1DA1F2]",
    border: "border-[#bde9fd]",
  },
  instagram: {
    icon: InstagramOutlined,
    label: "Instagram",
    bg: "bg-pink-50",
    iconColor: "text-[#C13584]",
    border: "border-pink-200",
  },
  linkedin: {
    icon: LinkedinOutlined,
    label: "LinkedIn",
    bg: "bg-[#f0f7ff]",
    iconColor: "text-[#0A66C2]",
    border: "border-[#b9d9f8]",
  },
  tiktok: {
    icon: TikTokOutlined,
    label: "TikTok",
    bg: "bg-slate-50",
    iconColor: "text-slate-800",
    border: "border-slate-200",
  },
};

/* ── Section label ─────────────────────────────────────────────────────── */
const SectionLabel = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-600">
      <Icon style={{ fontSize: 14 }} />
    </span>
    <h3 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">{label}</h3>
  </div>
);

/* ── Empty state ───────────────────────────────────────────────────────── */
const EmptyState = ({ text }) => (
  <div className="flex flex-col items-center justify-center py-6 gap-2 text-slate-400">
    <span className="text-3xl opacity-40">📁</span>
    <p className="text-sm">{text}</p>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────── */

const CandidateFilesAndSocialMedia = ({ candidate }) => {
  const videoFiles = candidate?.files?.filter((file) =>
    file.filename?.toLowerCase().includes("video") ||
    file.contentType?.startsWith("video/")
  );

  const audioFilesRaw = candidate?.files?.filter((file) =>
    file.contentType?.startsWith("audio/")
  );

  const combinedAudioFiles = [
    ...(audioFilesRaw || []),
    candidate?.voiceUrl ? { filename: candidate.voiceUrl } : null,
  ].filter(Boolean);

  const socialMediaLinks =
    candidate?.socialMedia?.map((link) =>
      typeof link === "string" ? JSON.parse(link) : link
    ) || [];

  const carouselRef = React.useRef();

  const hasMedia = (videoFiles?.length || 0) + (combinedAudioFiles?.length || 0) > 0;

  return (
    <div className="w-full space-y-8">

      {/* ── Video files ─────────────────────────────────────────────────── */}
      {videoFiles && videoFiles.length > 0 && (
        <div>
          <SectionLabel icon={VideoCameraOutlined} label="Vidéos" />
          <div className="relative">
            <Carousel
              ref={carouselRef}
              className="w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100"
              dots={{ className: "custom-carousel-dots" }}
            >
              {videoFiles.map((file, index) => (
                <div key={index}>
                  <video
                    controls
                    tabIndex="-1"
                    className="w-full max-h-[280px] object-contain bg-black"
                  >
                    <source src={file.filename} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                </div>
              ))}
            </Carousel>

            {videoFiles.length > 1 && (
              <>
                <Button
                  icon={<LeftOutlined />}
                  onClick={() => carouselRef.current.prev()}
                  size="small"
                  className="absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-white/90 border border-slate-200 shadow hover:shadow-md backdrop-blur-sm"
                  shape="circle"
                />
                <Button
                  icon={<RightOutlined />}
                  onClick={() => carouselRef.current.next()}
                  size="small"
                  className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-white/90 border border-slate-200 shadow hover:shadow-md backdrop-blur-sm"
                  shape="circle"
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Audio files ─────────────────────────────────────────────────── */}
      {combinedAudioFiles.length > 0 && (
        <div>
          <SectionLabel icon={SoundOutlined} label="Audio" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {combinedAudioFiles.map((file, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-2"
              >
                <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                  <SoundOutlined />
                  <a
                    href={file.filename}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors truncate"
                  >
                    Fichier Audio {index + 1}
                  </a>
                </div>
                <audio controls className="w-full h-9 rounded-lg">
                  <source src={file.filename} type={file.contentType} />
                  Votre navigateur ne supporte pas la lecture audio.
                </audio>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No media */}
      {!hasMedia && (
        <EmptyState text="Aucun fichier audio ou vidéo disponible pour ce candidat." />
      )}

      {/* ── Divider ─────────────────────────────────────────────────────── */}
      <hr className="border-slate-100" />

      {/* ── Social media ────────────────────────────────────────────────── */}
      <div>
        <SectionLabel icon={LinkOutlined} label="Réseaux sociaux" />
        {socialMediaLinks.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {socialMediaLinks.map((link, index) => {
              const platform = link?.type?.toLowerCase();
              const meta = SOCIAL_META[platform];
              const IconComp = meta?.icon;

              return (
                <a
                  key={index}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium
                    transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5
                    ${meta
                      ? `${meta.bg} ${meta.border} ${meta.iconColor}`
                      : "bg-slate-50 border-slate-200 text-slate-600"
                    }
                  `}
                >
                  {IconComp ? (
                    <IconComp style={{ fontSize: 18 }} />
                  ) : (
                    <LinkOutlined style={{ fontSize: 18 }} />
                  )}
                  <span>{meta?.label || platform || "Lien"}</span>
                </a>
              );
            })}
          </div>
        ) : (
          <EmptyState text="Aucun lien de réseau social disponible." />
        )}
      </div>
    </div>
  );
};

export default CandidateFilesAndSocialMedia;
