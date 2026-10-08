import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "antd";
import { ChevronLeft, ChevronRight, ImageOff, Maximize2 } from "lucide-react";
import { getFullName } from "../../utils/candidate";

const Images = ({ candidate }) => {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const thumbsRef = useRef(null);

  const images = useMemo(
    () =>
      (candidate.files || [])
        .filter(
          (file) => file.contentType?.startsWith("image/") && !file.filename?.includes("video")
        )
        .map((file) => file.filename),
    [candidate.files]
  );

  const name = getFullName(candidate);
  const count = images.length;

  const go = useCallback(
    (step) => setIndex((current) => Math.min(count - 1, Math.max(0, current + step))),
    [count]
  );

  // Arrow keys navigate while the lightbox is open.
  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, go]);

  // Keep the active thumbnail centred in the strip (scrolls the strip only, never the page).
  useEffect(() => {
    const strip = thumbsRef.current;
    const active = strip?.children[index];
    if (!strip || !active) return;
    strip.scrollTo({
      left: active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2,
      behavior: "smooth",
    });
  }, [index]);

  if (count === 0) {
    return (
      <div className="bm-gallery bm-gallery--empty">
        <ImageOff size={32} />
        <p>Aucune photo disponible</p>
      </div>
    );
  }

  return (
    <div className="bm-gallery">
      <div className="bm-gallery__stage">
        <button
          type="button"
          className="bm-gallery__open"
          onClick={() => setLightboxOpen(true)}
          aria-label="Agrandir la photo"
        >
          <img src={images[index]} alt={`${name} (${index + 1}/${count})`} />
        </button>

        <span className="bm-gallery__badge">
          {index + 1} / {count}
        </span>
        <span className="bm-gallery__zoom" aria-hidden="true">
          <Maximize2 size={16} />
        </span>

        {count > 1 && (
          <>
            <button
              type="button"
              className="bm-gallery__nav bm-gallery__nav--prev"
              onClick={() => go(-1)}
              disabled={index === 0}
              aria-label="Photo précédente"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className="bm-gallery__nav bm-gallery__nav--next"
              onClick={() => go(1)}
              disabled={index === count - 1}
              aria-label="Photo suivante"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="bm-gallery__thumbs" ref={thumbsRef}>
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`bm-gallery__thumb${i === index ? " is-active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Afficher la photo ${i + 1}`}
              aria-current={i === index}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <Modal
        open={lightboxOpen}
        onCancel={() => setLightboxOpen(false)}
        footer={null}
        centered
        width="min(96vw, 1200px)"
        className="bm-lightbox"
        destroyOnClose
      >
        <div className="bm-lightbox__stage">
          <img src={images[index]} alt={`${name} — plein écran`} />
          {count > 1 && (
            <>
              <button
                type="button"
                className="bm-gallery__nav bm-gallery__nav--prev"
                onClick={() => go(-1)}
                disabled={index === 0}
                aria-label="Photo précédente"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                className="bm-gallery__nav bm-gallery__nav--next"
                onClick={() => go(1)}
                disabled={index === count - 1}
                aria-label="Photo suivante"
              >
                <ChevronRight size={24} />
              </button>
              <span className="bm-gallery__badge">
                {index + 1} / {count}
              </span>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Images;
