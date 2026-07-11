interface BookHeroArtProps {
  accent: "emerald" | "violet";
}

const palette = {
  emerald: {
    cover: "bg-emerald-500",
    spine: "bg-emerald-700",
    page: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700",
    shadow: "shadow-emerald-900/20",
  },
  violet: {
    cover: "bg-violet-500",
    spine: "bg-violet-700",
    page: "bg-violet-50",
    badge: "bg-violet-100 text-violet-700",
    shadow: "shadow-violet-900/20",
  },
};

export default function BookHeroArt({ accent }: BookHeroArtProps) {
  const colors = palette[accent];

  return (
    <div className="relative hidden h-32 w-44 shrink-0 md:block" aria-label="Cartoon book illustration">
      <div className={`absolute bottom-2 left-8 h-16 w-28 rotate-[-8deg] rounded-2xl ${colors.cover} shadow-2xl ${colors.shadow}`} />
      <div className={`absolute bottom-4 left-10 h-14 w-24 rotate-[-8deg] rounded-xl ${colors.page} shadow-inner`} />
      <div className={`absolute bottom-0 left-2 h-20 w-10 rotate-[-8deg] rounded-2xl ${colors.spine} shadow-lg`} />
      <div className="absolute bottom-8 left-20 h-2 w-14 rotate-[-8deg] rounded-full bg-white/80" />
      <div className="absolute bottom-14 left-16 h-2 w-20 rotate-[-8deg] rounded-full bg-white/70" />
      <div className="absolute bottom-19 left-22 h-2 w-10 rotate-[-8deg] rounded-full bg-white/70" />
      <div className={`absolute right-0 top-2 rounded-2xl px-3 py-2 text-xs font-extrabold shadow-sm ${colors.badge}`}>
        Learn
      </div>
      <div className="absolute left-24 top-0 h-5 w-5 rounded-full bg-amber-300 shadow-sm" />
      <div className="absolute left-31 top-7 h-3 w-3 rounded-full bg-sky-300 shadow-sm" />
    </div>
  );
}
