import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/icon";

const VOTES_URL = "https://functions.poehali.dev/13ec25b1-0baf-4fd3-9ae0-3e07c0320dce";

// Фото участниц по порядку: образ, еда, напиток
const PARTICIPANTS = [
  {
    id: 1,
    label: "Участница I",
    country: "Япония",
    images: [
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/bucket/c5a9e6a3-0bb7-49af-9d8e-03b8de4293df.jpeg",
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/bucket/6bf61756-2924-4b38-8192-af33f4e890b3.jpeg",
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/bucket/b997a20c-3c39-4962-bd43-038b0d6f8833.jpeg",
    ],
    style: "Загадочный · Утончённый",
    look: "Шёлковое кимоно индиго с золотыми журавлями, лаковые гета, веер из чёрного бамбука",
    drink: "Матча с горьким шоколадом",
    food: "Суши с икрой и трюфелем",
    vibe: "Тишина перед рассветом. Древняя сила в каждом движении.",
  },
  {
    id: 2,
    label: "Участница II",
    country: "Франция",
    images: [
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/bucket/1f7ecc09-7e59-46b1-b823-0cfb4ca7ac54.jpeg",
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/bucket/0268a3c4-8e61-48c8-859b-c60562c723b4.jpeg",
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/bucket/9c340821-b71d-4190-9f28-fc9e40a6d4cf.jpeg",
    ],
    style: "Элегантный · Дерзкий",
    look: "Бордовое мини с открытыми плечами, чёрные перчатки, золотые серьги, берет Dior",
    drink: "Горячий шоколад Ladurée с макаронами",
    food: "Крепы с шоколадным соусом и мороженым, Carette Paris",
    vibe: "Парижская ночь. Полная уверенность без единого слова.",
  },
  {
    id: 3,
    label: "Участница III",
    country: "Италия",
    images: [
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/bucket/80f671a2-8d47-4f1e-a1fd-53397d6776e4.jpeg",
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/bucket/a9264599-4c73-46e5-bb5a-702da040bcfa.jpeg",
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/bucket/3f5599a4-42c0-47e0-9b7c-3d4d65d8eb75.jpeg",
    ],
    style: "Мощный · Чувственный",
    look: "Тёмный бархат с золотым шитьём, барочные украшения, открытые плечи",
    drink: "Aperol Spritz на террасе Чинкве-Терре",
    food: "Паста с видом на итальянское море",
    vibe: "Богиня, сошедшая с фрески. Красота как власть.",
  },
];

// Все фото финального слайда — все 9 вместе
const ALL_PHOTOS = PARTICIPANTS.flatMap(p => p.images);

const TOTAL_SLIDES = 6;

const slideVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { y: "0%", opacity: 1 },
  exit: (dir: number) => ({ y: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

// Фильтр: темно-бирюзовый тон поверх фото
const PHOTO_FILTER = "brightness(0.88) contrast(1.05) saturate(0.8) hue-rotate(5deg)";

function PhotoGallery({ images, onOpen }: { images: string[]; onOpen?: (i: number) => void }) {
  const [active, setActive] = useState(0);
  const [imgDir, setImgDir] = useState(1);
  const isAnim = useRef(false);
  const touchStartX = useRef<number | null>(null);

  const goImg = useCallback((next: number) => {
    if (isAnim.current) return;
    const clamped = Math.max(0, Math.min(images.length - 1, next));
    isAnim.current = true;
    setImgDir(clamped > active ? 1 : -1);
    setActive(clamped);
    setTimeout(() => { isAnim.current = false; }, 420);
  }, [active, images.length]);

  const onTouchStartX = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEndX = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { if (diff > 0) { goImg(active + 1); } else { goImg(active - 1); } }
    touchStartX.current = null;
  };

  const imgVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: "0%", opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none"
      onTouchStart={onTouchStartX} onTouchEnd={onTouchEndX}>
      <AnimatePresence custom={imgDir} mode="wait">
        <motion.img
          key={active}
          src={images[active]}
          alt=""
          custom={imgDir}
          variants={imgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.38, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: PHOTO_FILTER }}
          draggable={false}
        />
      </AnimatePresence>

      {/* Тёмный оверлей для единства тона */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(2,8,16,0.18)", mixBlendMode: "multiply" }} />

      {/* Кнопка fullscreen */}
      {onOpen && (
        <button onClick={(e) => { e.stopPropagation(); onOpen(active); }}
          className="absolute top-2 right-2 z-20 w-7 h-7 flex items-center justify-center rounded-full opacity-50 hover:opacity-90 transition-opacity"
          style={{ background: "rgba(2,6,13,0.7)", border: "1px solid rgba(196,162,74,0.3)" }}>
          <Icon name="Maximize2" size={11} style={{ color: "var(--gold)" }} />
        </button>
      )}

      {/* Точки */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {images.map((_, i) => (
          <button key={i} onClick={(e) => { e.stopPropagation(); goImg(i); }}
            className="rounded-full transition-all duration-300"
            style={{ width: i === active ? 18 : 5, height: 5, background: i === active ? "var(--gold)" : "rgba(255,255,255,0.28)" }} />
        ))}
      </div>
    </div>
  );
}

// Лайтбокс для просмотра на весь экран
function Lightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [active, setActive] = useState(startIndex);
  const touchStartX = useRef<number | null>(null);

  const go = (next: number) => {
    setActive(Math.max(0, Math.min(images.length - 1, next)));
  };

  const onTouchStartX = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEndX = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { if (diff > 0) { go(active + 1); } else { go(active - 1); } }
    touchStartX.current = null;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(active + 1);
      if (e.key === "ArrowLeft") go(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(2,6,13,0.97)" }}
      onTouchStart={onTouchStartX} onTouchEnd={onTouchEndX}>
      <AnimatePresence mode="wait">
        <motion.img key={active} src={images[active]} alt=""
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-full max-h-full object-contain"
          style={{ filter: PHOTO_FILTER }}
          draggable={false} />
      </AnimatePresence>

      {/* Закрыть */}
      <button onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full opacity-60 hover:opacity-100 transition-opacity"
        style={{ border: "1px solid rgba(196,162,74,0.4)", background: "rgba(2,6,13,0.8)" }}>
        <Icon name="X" size={15} style={{ color: "var(--gold)" }} />
      </button>

      {/* Стрелки */}
      {active > 0 && (
        <button onClick={() => go(active - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full opacity-50 hover:opacity-90 transition-opacity"
          style={{ border: "1px solid rgba(196,162,74,0.3)", background: "rgba(2,6,13,0.7)" }}>
          <Icon name="ChevronLeft" size={16} style={{ color: "var(--gold)" }} />
        </button>
      )}
      {active < images.length - 1 && (
        <button onClick={() => go(active + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full opacity-50 hover:opacity-90 transition-opacity"
          style={{ border: "1px solid rgba(196,162,74,0.3)", background: "rgba(2,6,13,0.7)" }}>
          <Icon name="ChevronRight" size={16} style={{ color: "var(--gold)" }} />
        </button>
      )}

      {/* Счётчик */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button key={i} onClick={() => go(i)} className="rounded-full transition-all duration-300"
            style={{ width: i === active ? 18 : 5, height: 5, background: i === active ? "var(--gold)" : "rgba(255,255,255,0.25)" }} />
        ))}
      </div>
    </motion.div>
  );
}

export default function Index() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [voted, setVoted] = useState<number | null>(null);
  const [votes, setVotes] = useState<number[]>([0, 0, 0]);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const isAnimating = useRef(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    fetch(VOTES_URL)
      .then(r => r.json())
      .then(data => {
        const v = data.votes as Record<string, number>;
        setVotes([v["1"] || 0, v["2"] || 0, v["3"] || 0]);
      })
      .catch(() => {});
  }, []);

  const go = useCallback((next: number) => {
    if (isAnimating.current) return;
    if (next < 0 || next >= TOTAL_SLIDES) return;
    isAnimating.current = true;
    setDirection(next > current ? 1 : -1);
    setCurrent(next);
    setTimeout(() => { isAnimating.current = false; }, 700);
  }, [current]);

  const goNext = useCallback(() => go(current + 1), [current, go]);
  const goPrev = useCallback(() => go(current - 1), [current, go]);

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 55) { if (diff > 0) { goNext(); } else { goPrev(); } }
    touchStart.current = null;
  };

  const handleVote = async (idx: number) => {
    if (voted !== null) return;
    setVoted(idx);
    setVotes(v => v.map((c, i) => i === idx ? c + 1 : c));
    try {
      await fetch(VOTES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant_id: idx + 1 }),
      });
      const r = await fetch(VOTES_URL);
      const data = await r.json();
      const v = data.votes as Record<string, number>;
      setVotes([v["1"] || 0, v["2"] || 0, v["3"] || 0]);
    } catch (e) { console.error(e); }
  };

  const totalVotes = votes.reduce((a, b) => a + b, 0) || 1;

  const font: React.CSSProperties = { fontFamily: "Playfair Display, Georgia, serif" };
  const lbl: React.CSSProperties = {
    color: "var(--gold)", opacity: 0.6, fontFamily: "DM Sans",
    fontSize: "0.62rem", letterSpacing: "0.28em", textTransform: "uppercase",
  };
  const bgDark = "radial-gradient(ellipse at 30% 20%, #0e2a2a 0%, #060e18 40%, #020810 100%)";
  const bgDarker = "radial-gradient(ellipse at 70% 80%, #0a2020 0%, #04080f 50%, #020810 100%)";

  const slides = [
    // ── Слайд 0: Обложка ──
    <div key="cover" className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden marble-top"
      style={{ background: bgDark }}>
      <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(20,80,80,0.25) 0%, transparent 65%)" }} />
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 text-center px-6 max-w-lg">
        <p style={{ ...lbl, marginBottom: 28 }}>Интерактивное голосование</p>
        <h1 style={{ ...font, color: "#fff", fontSize: "clamp(3.2rem,14vw,7rem)", fontWeight: 400, lineHeight: 0.95, marginBottom: 6 }}>
          Style
        </h1>
        <h2 style={{ ...font, color: "var(--gold-light, #ddc06e)", fontSize: "clamp(2rem,8vw,3.8rem)", fontWeight: 400, letterSpacing: "0.18em", marginBottom: 36 }}>
          Select
        </h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", fontWeight: 300, lineHeight: 1.9 }}>
          Три участницы. Три страны. Три образа.<br />Кто воплотила своё лучше всех?
        </p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 z-10">
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>листай</p>
        <Icon name="ChevronDown" size={14} className="animate-bounce" style={{ color: "var(--gold)" }} />
      </motion.div>
    </div>,

    // ── Слайды 1-3: Участницы ──
    ...PARTICIPANTS.map((p, idx) => (
      <div key={`p-${idx}`} className="relative w-full h-full flex flex-col md:flex-row overflow-hidden marble-sides"
        style={{ background: bgDarker }}>
        <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse at 65% 40%, rgba(15,60,60,0.30) 0%, transparent 60%)" }} />

        {/* Фото */}
        <div className="relative w-full md:w-[46%] h-[48vh] md:h-full flex-shrink-0">
          <PhotoGallery images={p.images} onOpen={(i) => setLightbox({ images: p.images, index: i })} />
          <div className="absolute inset-0 md:hidden pointer-events-none"
            style={{ background: "linear-gradient(to top, #020810 28%, rgba(2,8,16,0.4) 60%, transparent 80%)" }} />
          <div className="hidden md:block absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to right, transparent 50%, #020810 100%)" }} />
        </div>

        {/* Контент */}
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75, delay: 0.1 }}
          className="relative z-10 flex flex-col justify-center px-7 md:px-10 lg:px-14 pb-10 pt-3 md:pt-0 md:w-[54%]">
          <p style={lbl}>{p.label}</p>
          <h2 style={{ ...font, color: "#fff", fontSize: "clamp(2rem,5.5vw,3.5rem)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.1, marginTop: 10, marginBottom: 20 }}>
            {p.country}
          </h2>
          <p style={{ ...lbl, marginBottom: 5 }}>Стиль</p>
          <p style={{ color: "rgba(255,255,255,0.80)", fontWeight: 300, marginBottom: 16, fontSize: "0.9rem" }}>{p.style}</p>
          <p style={{ ...lbl, marginBottom: 5 }}>Образ</p>
          <p style={{ color: "rgba(255,255,255,0.60)", fontWeight: 300, fontSize: "0.82rem", lineHeight: 1.75, marginBottom: 18 }}>{p.look}</p>
          <div className="flex gap-8 mb-5">
            <div>
              <p style={{ ...lbl, marginBottom: 5 }}>Напиток</p>
              <p style={{ color: "rgba(255,255,255,0.58)", fontWeight: 300, fontSize: "0.8rem" }}>{p.drink}</p>
            </div>
            <div>
              <p style={{ ...lbl, marginBottom: 5 }}>Еда</p>
              <p style={{ color: "rgba(255,255,255,0.58)", fontWeight: 300, fontSize: "0.8rem" }}>{p.food}</p>
            </div>
          </div>
          <div style={{ borderLeft: "2px solid rgba(196,162,74,0.4)", paddingLeft: 14 }}>
            <p style={{ ...font, color: "rgba(255,255,255,0.42)", fontStyle: "italic", fontSize: "0.9rem", lineHeight: 1.65 }}>{p.vibe}</p>
          </div>
        </motion.div>
      </div>
    )),

    // ── Слайд 4: Голосование ──
    <div key="vote" className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden marble-sides"
      style={{ background: bgDark }}>
      <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(15,55,55,0.28) 0%, transparent 65%)" }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-sm px-6">
        <p style={{ ...lbl, textAlign: "center", marginBottom: 18 }}>Финальный выбор</p>
        <h2 style={{ ...font, color: "#fff", fontSize: "clamp(1.7rem,5vw,2.6rem)", fontWeight: 400, textAlign: "center", lineHeight: 1.2, marginBottom: 32 }}>
          Кто лучше всех<br />воплотила образ?
        </h2>
        <div className="flex flex-col gap-3">
          {PARTICIPANTS.map((p, i) => {
            const pct = voted !== null ? Math.round((votes[i] / totalVotes) * 100) : 0;
            const isWinner = voted !== null && votes[i] === Math.max(...votes);
            return (
              <button key={i} onClick={() => handleVote(i)} disabled={voted !== null}
                className="relative overflow-hidden text-left transition-all duration-500 cursor-pointer disabled:cursor-default"
                style={{ border: `1px solid ${voted === i ? "rgba(196,162,74,0.7)" : "rgba(255,255,255,0.10)"}`, borderRadius: 2, background: voted === i ? "rgba(196,162,74,0.07)" : "rgba(255,255,255,0.02)" }}>
                {voted !== null && (
                  <motion.div initial={{ width: "0%" }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0"
                    style={{ background: voted === i ? "rgba(196,162,74,0.15)" : "rgba(40,120,120,0.08)" }} />
                )}
                <div className="relative z-10 flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <p style={{ ...font, color: "#fff", fontSize: "1rem", fontWeight: 400 }}>{p.label}</p>
                      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", letterSpacing: "0.05em" }}>{p.country}</p>
                    </div>
                    {isWinner && (
                      <span style={{ color: "var(--gold)", border: "1px solid rgba(196,162,74,0.5)", fontSize: "0.58rem", letterSpacing: "0.2em", padding: "2px 7px", textTransform: "uppercase" }}>
                        лидер
                      </span>
                    )}
                  </div>
                  {voted !== null
                    ? <span style={{ ...font, color: voted === i ? "var(--gold)" : "rgba(255,255,255,0.38)", fontSize: "1.05rem" }}>{pct}%</span>
                    : <Icon name="ChevronRight" size={13} style={{ color: "rgba(255,255,255,0.22)" }} />
                  }
                </div>
              </button>
            );
          })}
        </div>
        {voted !== null && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.68rem", textAlign: "center", marginTop: 22, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            Голос учтён
          </motion.p>
        )}
      </motion.div>
    </div>,

    // ── Слайд 5: Финал ──
    <div key="final" className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden marble-bottom"
      style={{ background: bgDarker }}>
      <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse at 50% 75%, rgba(15,55,55,0.30) 0%, transparent 65%)" }} />

      {/* Галерея всех фото — свайп */}
      <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center">
        <p style={{ ...lbl, marginBottom: 20, textAlign: "center" }}>Style Select</p>
        <h2 style={{ ...font, color: "#fff", fontSize: "clamp(1.8rem,6vw,3rem)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.2, marginBottom: 24, textAlign: "center" }}>
          Спасибо<br />за участие
        </h2>

        {/* Сетка фото 3x3 со свайпом */}
        <FinalGallery images={ALL_PHOTOS} onOpen={(i) => setLightbox({ images: ALL_PHOTOS, index: i })} />

        <div style={{ border: "1px solid rgba(196,162,74,0.25)", background: "rgba(196,162,74,0.04)", padding: "14px 32px", display: "inline-block", marginTop: 20 }}>
          <p style={{ ...lbl, marginBottom: 6 }}>при поддержке</p>
          <p style={{ ...font, color: "#fff", fontSize: "1.1rem", fontWeight: 400, letterSpacing: "0.06em" }}>Семья Dezzer</p>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="fixed inset-0 overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      style={{ background: "var(--ocean)" }}>
      <AnimatePresence custom={direction} mode="wait">
        <motion.div key={current} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }} className="absolute inset-0">
          {slides[current]}
        </motion.div>
      </AnimatePresence>

      {/* Лайтбокс */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox images={lightbox.images} startIndex={lightbox.index} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>

      {/* Точки-навигация */}
      <div className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button key={i} onClick={() => go(i)} className="rounded-full transition-all duration-300"
            style={{ width: 4, height: i === current ? 20 : 4, background: i === current ? "var(--gold)" : "rgba(255,255,255,0.20)" }} />
        ))}
      </div>

      {current > 0 && (
        <button onClick={goPrev}
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-4 z-50 w-8 h-8 items-center justify-center rounded-full opacity-25 hover:opacity-60 transition-opacity"
          style={{ border: "1px solid rgba(255,255,255,0.18)" }}>
          <Icon name="ChevronUp" size={13} style={{ color: "#fff" }} />
        </button>
      )}
      {current < TOTAL_SLIDES - 1 && (
        <button onClick={goNext}
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 bottom-4 z-50 w-8 h-8 items-center justify-center rounded-full opacity-25 hover:opacity-60 transition-opacity animate-bounce"
          style={{ border: "1px solid rgba(255,255,255,0.18)" }}>
          <Icon name="ChevronDown" size={13} style={{ color: "#fff" }} />
        </button>
      )}
    </div>
  );
}

// Финальная галерея: 3 колонки, по одному фото из каждой участницы в ряду, свайп по строкам
function FinalGallery({ images, onOpen }: { images: string[]; onOpen: (i: number) => void }) {
  const [row, setRow] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const rows = 3;
  const cols = 3;

  const goRow = (next: number) => setRow(Math.max(0, Math.min(rows - 1, next)));

  const onTouchStartX = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEndX = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { if (diff > 0) { goRow(row + 1); } else { goRow(row - 1); } }
    touchStartX.current = null;
  };

  return (
    <div className="w-full" onTouchStart={onTouchStartX} onTouchEnd={onTouchEndX}>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, col) => {
          const imgIndex = row * cols + col;
          const src = images[imgIndex];
          return (
            <div key={col} className="relative aspect-square overflow-hidden rounded-sm cursor-pointer"
              onClick={() => onOpen(imgIndex)}
              style={{ border: "1px solid rgba(196,162,74,0.15)" }}>
              <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                style={{ filter: PHOTO_FILTER }} draggable={false} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(2,8,16,0.12)" }} />
              <div className="absolute bottom-1 right-1 opacity-40">
                <Icon name="Maximize2" size={9} style={{ color: "var(--gold)" }} />
              </div>
            </div>
          );
        })}
      </div>
      {/* Точки рядов */}
      <div className="flex justify-center gap-1.5 mt-3">
        {Array.from({ length: rows }).map((_, i) => (
          <button key={i} onClick={() => goRow(i)} className="rounded-full transition-all duration-300"
            style={{ width: i === row ? 18 : 5, height: 4, background: i === row ? "var(--gold)" : "rgba(255,255,255,0.22)" }} />
        ))}
      </div>
      <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.6rem", textAlign: "center", marginTop: 6, letterSpacing: "0.2em", textTransform: "uppercase" }}>
        свайп → следующий ряд
      </p>
    </div>
  );
}
