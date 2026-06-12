interface CoverPageProps {
  title: string;
  author: string;
}

export default function CoverPage({ title, author }: CoverPageProps) {
  return (
    <div className="w-full h-full bg-[#185A85] text-white flex flex-col items-center justify-center px-4 text-center gap-2 sm:gap-4">

      {/* Logo circle */}
      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/10 flex items-center justify-center mb-1 sm:mb-2">
        <img
          src="/logo.png"
          alt="ZCAD"
          className="w-6 h-6 sm:w-9 sm:h-9 object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      <h1
        className="font-semibold leading-tight tracking-tight"
        style={{ fontSize: "clamp(0.85rem, 4vw, 1.75rem)" }}
      >
        {title}
      </h1>

      <p
        className="text-blue-200"
        style={{ fontSize: "clamp(0.7rem, 3vw, 1rem)" }}
      >
        {author}
      </p>

      <div className="w-6 sm:w-8 h-px bg-white/30 my-1" />

      <span
        className="tracking-[3px] uppercase text-blue-300"
        style={{ fontSize: "clamp(0.55rem, 2vw, 0.625rem)" }}
      >
        Preview Edition
      </span>

      <p
        className="text-blue-300/70 mt-1"
        style={{ fontSize: "clamp(0.55rem, 2vw, 0.75rem)" }}
      >
        ZCAD Publications
      </p>
    </div>
  );
}