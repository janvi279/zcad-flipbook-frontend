interface Props {
  handle: string;
}

const features = [
  "Full book access",
  "All chapters included",
  "Instant delivery",
];

export default function BuyNowPage({ handle }: Props) {
  const handleBuy = () => {
    window.open(
      `https://zcadgroup.myshopify.com/products/${handle}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="relative w-full h-full bg-white flex flex-col items-center justify-center px-4 sm:px-8 text-center gap-3 sm:gap-5 overflow-hidden">

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#185A85]" />

      {/* Icon */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#E6F1FB] flex items-center justify-center">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#185A85"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </div>

      {/* Text */}
      <div>
        <h2
          className="font-semibold text-gray-800 mb-1 sm:mb-2"
          style={{ fontSize: "clamp(0.85rem, 4vw, 1.5rem)" }}
        >
          Preview Complete
        </h2>
        <p
          className="text-gray-400 leading-relaxed max-w-[200px] sm:max-w-xs mx-auto"
          style={{ fontSize: "clamp(0.6rem, 2.5vw, 0.875rem)" }}
        >
          You've reached the end of the preview. Get full access to continue reading.
        </p>
      </div>

      {/* Features list */}
      <div className="w-full max-w-[200px] sm:max-w-xs bg-[#E6F1FB] rounded-lg px-3 sm:px-5 py-3 sm:py-4 text-left space-y-1.5 sm:space-y-2">
        {features.map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 text-[#185A85]"
            style={{ fontSize: "clamp(0.6rem, 2.5vw, 0.875rem)" }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#185A85"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {item}
          </div>
        ))}
      </div>

      {/* Buy button */}
      <button
        onClick={handleBuy}
        className="w-full max-w-[200px] sm:max-w-xs bg-[#185A85] hover:bg-[#0C447C] active:scale-95 text-white rounded-lg font-medium transition-all"
        style={{
          fontSize: "clamp(0.65rem, 2.5vw, 0.875rem)",
          padding: "clamp(6px, 2vw, 12px) 16px",
        }}
      >
        Buy Full Book →
      </button>

      <p
        className="text-gray-300 tracking-widest uppercase"
        style={{ fontSize: "clamp(0.5rem, 1.5vw, 0.625rem)" }}
      >
        ZCAD Publications
      </p>
    </div>
  );
}