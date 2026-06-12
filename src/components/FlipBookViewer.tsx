import HTMLFlipBook from "react-pageflip";
import { useRef, useState, useEffect } from "react";

import Page from "../pages/page";
import BuyNowPage from "./BuyNowPage";
import CoverPage from "./admin/CoverPage";

interface Props {
  images?: string[];
  handle: string;
  title: string;
  author: string;
}

interface FlipEvent {
  data: number;
}

type FlipBookRef = {
  pageFlip?: () => {
    flipPrev: () => void;
    flipNext: () => void;
  };
};

function getBookConfig() {
  const w = window.innerWidth;
  if (w < 480) {
    return { width: Math.min(w - 32, 320), height: Math.min(w - 32, 320) * 1.45, portrait: true };
  } else if (w < 768) {
    return { width: 300, height: 420, portrait: true };
  } else if (w < 1024) {
    return { width: 320, height: 450, portrait: true };
  } else {
    return { width: 480, height: 660, portrait: false };
  }
}

const ZOOM_LEVELS = [1, 1.15, 1.3, 1.45, 1.6];

export default function FlipBookViewer({ images = [], handle, title, author }: Props) {
  const flipBookRef = useRef<FlipBookRef | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [config, setConfig] = useState(getBookConfig);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const totalPages = images.length + 2;
  const zoom = ZOOM_LEVELS[zoomIndex];
  const bookW = config.portrait ? config.width : config.width * 2;
  const bookH = config.height;

  // Scaled dimensions — used as scroll canvas size
  const scaledW = Math.round(bookW * zoom);
  const scaledH = Math.round(bookH * zoom);

  useEffect(() => {
    const handleResize = () => setConfig(getBookConfig());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isZoomed ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isZoomed]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsZoomed(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Re-center scroll whenever zoom level changes
  useEffect(() => {
    if (!isZoomed || !scrollRef.current) return;
    const el = scrollRef.current;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollTop  = (el.scrollHeight - el.clientHeight) / 2;
  }, [zoomIndex, isZoomed]);

  const handlePrev = () => flipBookRef.current?.pageFlip?.()?.flipPrev?.();
  const handleNext = () => flipBookRef.current?.pageFlip?.()?.flipNext?.();
  const handleFlip = (e: FlipEvent) => setCurrentPage(e.data);

  const zoomIn  = () => setZoomIndex((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1));
  const zoomOut = () => setZoomIndex((i) => Math.max(i - 1, 0));
  const resetZoom = () => setZoomIndex(0);

  const progressPercent = Math.round(((currentPage + 1) / totalPages) * 100);

  // The single HTMLFlipBook node — rendered once, never unmounted
  const flipBook = (
    <HTMLFlipBook
      key={`${config.width}-${config.height}-${String(config.portrait)}`}
      ref={flipBookRef}
      width={config.width}
      height={config.height}
      size="fixed"
      minWidth={config.width}
      maxWidth={config.width}
      minHeight={config.height}
      maxHeight={config.height}
      showCover={true}
      flippingTime={700}
      className=""
      style={{}}
      startPage={0}
      drawShadow={true}
      usePortrait={config.portrait}
      startZIndex={0}
      autoSize={false}
      clickEventForward={true}
      useMouseEvents={true}
      swipeDistance={30}
      showPageCorners={true}
      disableFlipByClick={false}
      mobileScrollSupport={true}
      maxShadowOpacity={0.4}
      onFlip={handleFlip}
    >
      <Page pageNumber={0}><CoverPage title={title} author={author} /></Page>
      {images.map((img, index) => (
        <Page key={index} image={img} pageNumber={index + 1} />
      ))}
      <Page pageNumber={images.length + 1}><BuyNowPage handle={handle} /></Page>
    </HTMLFlipBook>
  );

  return (
    <>
      {/* ══════════════════════════════════════════
          ZOOM MODAL — full screen, scrollable
      ══════════════════════════════════════════ */}
      {isZoomed && (
        <div className="fixed inset-0 z-40 flex flex-col" style={{ background: "rgba(0,0,0,0.88)" }}>

          {/* Toolbar */}
          <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-sm border-b border-white/10 z-10">
            <p className="text-white text-sm font-medium truncate max-w-[35%]">{title}</p>

            {/* Zoom controls */}
            <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-lg px-1.5 py-1">
              <button
                onClick={zoomOut}
                disabled={zoomIndex === 0}
                className="w-8 h-8 flex items-center justify-center rounded-md text-white hover:bg-white/20 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xl leading-none select-none"
              >−</button>
              <button
                onClick={resetZoom}
                className="min-w-[52px] text-center text-xs font-bold text-white hover:bg-white/20 rounded-md px-2 py-1.5 transition-all"
              >{Math.round(zoom * 100)}%</button>
              <button
                onClick={zoomIn}
                disabled={zoomIndex === ZOOM_LEVELS.length - 1}
                className="w-8 h-8 flex items-center justify-center rounded-md text-white hover:bg-white/20 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xl leading-none select-none"
              >+</button>
            </div>

            <button
              onClick={() => setIsZoomed(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all active:scale-95"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Close
            </button>
          </div>

          {/*
            Scrollable canvas:
            - flex-1 so it fills between toolbar and bottom nav
            - overflow: auto enables both X and Y scroll
            - Inner "canvas" div sized to scaledW × scaledH gives the
              browser real content dimensions → correct scrollbars
            - Book sits inside, scaled via transform from top-left,
              canvas provides the matching space so scroll is accurate
          */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-auto"
            style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            {/* Canvas — real size after zoom so scrollbars are accurate */}
            <div
              style={{
                width: Math.max(scaledW, 100) + 64,   // +64px padding on each side
                height: Math.max(scaledH, 100) + 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Scale wrapper */}
              <div
                style={{
                  width: bookW,
                  height: bookH,
                  transform: `scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: "transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94)",
                  borderRadius: 6,
                  overflow: "hidden",
                  boxShadow: "0 16px 64px rgba(0,0,0,0.55)",
                  flexShrink: 0,
                }}
              >
                {flipBook}
              </div>
            </div>
          </div>

          {/* Bottom nav */}
          <div className="shrink-0 flex items-center justify-center gap-3 px-4 py-3 bg-black/60 backdrop-blur-sm border-t border-white/10">
            <button onClick={handlePrev} className="flex items-center gap-2 px-5 py-2 text-sm border border-white/20 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition text-white">
              ← Prev
            </button>
            <span className="text-xs text-white/50">{currentPage + 1} / {totalPages}</span>
            <button onClick={handleNext} className="flex items-center gap-2 px-5 py-2 text-sm border border-white/20 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition text-white">
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          NORMAL VIEW
      ══════════════════════════════════════════ */}
      <div className="flex flex-col items-center gap-4 py-4 px-2 w-full">

        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-medium tracking-[2px] uppercase text-[#185A85]">ZCAD Publications</p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Flip pages to preview the book</p>
        </div>

        {/* Progress + Zoom button */}
        <div className="flex items-center justify-center gap-4 flex-wrap w-full px-2">
          <div className="flex items-center gap-2">
            <div className="w-20 sm:w-28 h-[3px] bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#185A85] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">{currentPage + 1} / {totalPages}</span>
          </div>

          <button
            onClick={() => { resetZoom(); setIsZoomed(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-blue-50 hover:border-[#185A85] text-gray-500 hover:text-[#185A85] text-xs font-medium transition-all active:scale-95"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Zoom View
          </button>
        </div>

        {/* Book — normal view, no zoom */}
        <div style={{
          width: bookW,
          height: bookH,
          borderRadius: 6,
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(24,90,133,0.18), 0 2px 8px rgba(0,0,0,0.08)",
          flexShrink: 0,
        }}>
          {!isZoomed && flipBook}
        </div>

        {/* Nav */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={handlePrev} className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 active:scale-95 transition text-gray-700">
            ← Prev
          </button>
          <a
            href={`https://zcadgroup.myshopify.com/products/${handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 text-xs sm:text-sm bg-[#185A85] hover:bg-[#0C447C] text-white rounded-lg font-medium transition active:scale-95"
          >
            🛒 <span className="hidden sm:inline">Buy Full Book</span>
            <span className="sm:hidden">Buy Now</span>
          </a>
          <button onClick={handleNext} className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 active:scale-95 transition text-gray-700">
            Next →
          </button>
        </div>

        <p className="text-[10px] tracking-widest uppercase text-gray-300">Preview Copy · ZCAD</p>
      </div>
    </>
  );
}