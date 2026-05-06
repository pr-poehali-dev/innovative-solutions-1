import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/icon";

const PARTICIPANTS = [
  {
    id: 1,
    label: "Участница I",
    country: "Япония",
    flag: "🇯🇵",
    images: [
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/files/1bb95c55-a528-4207-aed2-7de038769925.jpg",
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/files/9c48084f-6923-4118-aedc-2d905b1c4ef7.jpg",
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/files/11277449-dcc9-447e-a584-ffdbe3f1361d.jpg",
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
    flag: "🇫🇷",
    images: [
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/files/d1198458-382a-4193-b8a1-e6b600da419b.jpg",
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/files/bafe3f7f-ff44-42b8-a1fe-510934d206a7.jpg",
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/files/7bff60e9-cb49-4ce1-9e81-a6af6f86cb67.jpg",
    ],
    style: "Элегантный · Дерзкий",
    look: "Чёрное платье от кутюр, тонкий золотой браслет, красная помада — единственный акцент",
    drink: "Шампанское Blanc de Noirs",
    food: "Устрицы с лимонным сорбе",
    vibe: "Парижская ночь. Полная уверенность без единого слова.",
  },
  {
    id: 3,
    label: "Участница III",
    country: "Италия",
    flag: "🇮🇹",
    images: [
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/files/92ebcc28-84e1-4898-96c5-0db29eb11d60.jpg",
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/files/0520fba9-bbe8-48ca-8eb7-a32f4d6e72b0.jpg",
      "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/files/e39e356b-b3b8-413f-94b5-315a777ccb61.jpg",
    ],
    style: "Мощный · Чувственный",
    look: "Тёмный бархат с золотым шитьём, барочные украшения, открытые плечи",
    drink: "Тёмный Amarone della Valpolicella",
    food: "Трюфельное ризотто и горький шоколад",
    vibe: "Богиня, сошедшая с фрески. Красота как власть.",
  },
];

const TOTAL_SLIDES = 6;

const slideVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { y: "0%", opacity: 1 },
  exit:  (dir: number) => ({ y: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

function PhotoGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [imgDir, setImgDir] = useState(1);
  const isAnim = useRef(false);

  const goImg = useCallback((next: number) => {
    if (isAnim.current) return;
    isAnim.current = true;
    setImgDir(next > active ? 1 : -1);
    setActive(next);
    setTimeout(() => { isAnim.current = false; }, 450);
  }, [active]);

  const imgVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: "0%", opacity: 1 },
    exit:  (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
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
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0 w-full h-full object-cover object-top"
          draggable={false}
        />
      </AnimatePresence>

      {/* Стрелки */}
      {active > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); goImg(active - 1); }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full transition-opacity hover:opacity-100 opacity-60"
          style={{ background: "rgba(2,6,13,0.6)", border: "1px solid rgba(196,162,74,0.3)" }}
        >
          <Icon name="ChevronLeft" size={14} style={{ color: "var(--gold)" }} />
        </button>
      )}
      {active < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goImg(active + 1); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full transition-opacity hover:opacity-100 opacity-60"
          style={{ background: "rgba(2,6,13,0.6)", border: "1px solid rgba(196,162,74,0.3)" }}
        >
          <Icon name="ChevronRight" size={14} style={{ color: "var(--gold)" }} />
        </button>
      )}

      {/* Точки */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); goImg(i); }}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? 16 : 5,
              height: 5,
              background: i === active ? "var(--gold)" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Index() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [voted, setVoted] = useState<number | null>(null);
  const [votes, setVotes] = useState([0, 0, 0]);
  const isAnimating = useRef(false);
  const touchStart = useRef<number | null>(null);

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

  const handleVote = (idx: number) => {
    if (voted !== null) return;
    setVoted(idx);
    setVotes((v) => v.map((c, i) => (i === idx ? c + 1 : c)));
  };

  const totalVotes = votes.reduce((a, b) => a + b, 0) || 1;

  // ── Стили общие ──
  const goldDivider = <div className="w-12 h-px my-5" style={{ background: "var(--gold)", opacity: 0.6 }} />;
  const labelStyle: React.CSSProperties = { color: "var(--gold)", opacity: 0.65, fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase" };
  const font = { fontFamily: "Playfair Display, Georgia, serif" };

  const slides = [
    // ── Слайд 0: Обложка ──
    <div key="cover" className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden marble-top"
      style={{ background: "linear-gradient(180deg, #0a2e2e 0%, var(--ocean) 50%, #000 100%)" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(58,153,153,0.20) 0%, transparent 60%)" }} />
      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.2 }}
        className="relative z-10 text-center px-6 max-w-2xl">
        <p style={{ ...labelStyle, marginBottom: 24 }}>Интерактивное голосование</p>
        <h1 style={{ ...font, color: "#fff", fontSize: "clamp(3rem,13vw,6.5rem)", fontWeight: 400, lineHeight: 1, marginBottom: 8 }}>
          Style
        </h1>
        <h2 style={{ ...font, color: "var(--gold-light, #ddc06e)", fontSize: "clamp(2rem,8vw,4rem)", fontWeight: 400, letterSpacing: "0.12em", marginBottom: 32 }}>
          Select
        </h2>
        <div className="w-14 h-px mx-auto mb-7" style={{ background: "var(--gold)" }} />
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.875rem", fontWeight: 300, lineHeight: 1.8, letterSpacing: "0.02em" }}>
          Три участницы. Три страны. Три образа.<br />Кто воплотила своё лучше всех?
        </p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-9 flex flex-col items-center gap-2">
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>Листай</p>
        <Icon name="ChevronDown" size={16} className="animate-bounce" style={{ color: "var(--gold)" }} />
      </motion.div>
    </div>,

    // ── Слайды 1-3: Участницы ──
    ...PARTICIPANTS.map((p, idx) => (
      <div key={`p-${idx}`} className="relative w-full h-full flex flex-col md:flex-row overflow-hidden marble-sides"
        style={{ background: "var(--ocean)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(58,153,153,0.06) 0%, transparent 60%)" }} />

        {/* Фото галерея */}
        <div className="relative w-full md:w-[48%] h-[50vh] md:h-full flex-shrink-0">
          <PhotoGallery images={p.images} />
          <div className="absolute inset-0 md:hidden pointer-events-none" style={{ background: "linear-gradient(to top, var(--ocean) 30%, transparent 70%)" }} />
          <div className="hidden md:block absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, transparent 55%, var(--ocean) 100%)" }} />
        </div>

        {/* Контент */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
          className="relative z-10 flex flex-col justify-center px-7 md:px-10 lg:px-14 pb-8 pt-4 md:pt-0 md:w-[52%]">
          <p style={labelStyle}>{p.label}</p>
          <h2 style={{ ...font, color: "#fff", fontSize: "clamp(2.2rem,6vw,4rem)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.1, marginTop: 8, marginBottom: 4 }}>
            {p.flag} {p.country}
          </h2>
          {goldDivider}
          <p style={{ ...labelStyle, marginBottom: 4 }}>Стиль</p>
          <p style={{ color: "rgba(255,255,255,0.82)", fontWeight: 300, marginBottom: 14, fontSize: "0.92rem" }}>{p.style}</p>

          <p style={{ ...labelStyle, marginBottom: 4 }}>Образ</p>
          <p style={{ color: "rgba(255,255,255,0.68)", fontWeight: 300, fontSize: "0.85rem", lineHeight: 1.7, marginBottom: 14 }}>{p.look}</p>

          <div className="flex gap-8 mb-4">
            <div>
              <p style={{ ...labelStyle, marginBottom: 4 }}>Напиток</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontWeight: 300, fontSize: "0.82rem" }}>{p.drink}</p>
            </div>
            <div>
              <p style={{ ...labelStyle, marginBottom: 4 }}>Еда</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontWeight: 300, fontSize: "0.82rem" }}>{p.food}</p>
            </div>
          </div>

          <div className="border-l-2 pl-4 mt-1" style={{ borderColor: "rgba(196,162,74,0.5)" }}>
            <p style={{ ...font, color: "rgba(255,255,255,0.5)", fontStyle: "italic", fontSize: "0.95rem", lineHeight: 1.6 }}>{p.vibe}</p>
          </div>
        </motion.div>
      </div>
    )),

    // ── Слайд 4: Голосование ──
    <div key="vote" className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden marble-sides"
      style={{ background: "linear-gradient(155deg, var(--ocean) 0%, #000 100%)" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(27,112,112,0.10) 0%, transparent 65%)" }} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md px-6">
        <p style={{ ...labelStyle, textAlign: "center", marginBottom: 16 }}>Финальный выбор</p>
        <h2 style={{ ...font, color: "#fff", fontSize: "clamp(1.8rem,5vw,2.8rem)", fontWeight: 400, textAlign: "center", lineHeight: 1.25, marginBottom: 8 }}>
          Кто лучше всех<br />воплотила образ?
        </h2>
        <div className="w-12 h-px mx-auto mb-8" style={{ background: "var(--gold)" }} />

        <div className="flex flex-col gap-3">
          {PARTICIPANTS.map((p, i) => {
            const pct = voted !== null ? Math.round((votes[i] / totalVotes) * 100) : 0;
            const isWinner = voted !== null && votes[i] === Math.max(...votes);
            return (
              <button key={i} onClick={() => handleVote(i)} disabled={voted !== null}
                className="relative overflow-hidden text-left transition-all duration-500 cursor-pointer disabled:cursor-default"
                style={{ border: `1px solid ${voted === i ? "var(--gold)" : "rgba(255,255,255,0.10)"}`, borderRadius: 2, background: voted === i ? "rgba(196,162,74,0.07)" : "rgba(255,255,255,0.02)" }}>
                {voted !== null && (
                  <motion.div initial={{ width: "0%" }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0"
                    style={{ background: voted === i ? "rgba(196,162,74,0.14)" : "rgba(58,153,153,0.07)" }} />
                )}
                <div className="relative z-10 flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: "1.4rem" }}>{p.flag}</span>
                    <div>
                      <p style={{ ...font, color: "#fff", fontSize: "1.05rem", fontWeight: 400 }}>{p.label}</p>
                      <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.72rem" }}>{p.country}</p>
                    </div>
                    {isWinner && voted !== null && (
                      <span style={{ color: "var(--gold)", border: "1px solid var(--gold)", fontSize: "0.6rem", letterSpacing: "0.2em", padding: "2px 8px", textTransform: "uppercase" }}>
                        Лидер
                      </span>
                    )}
                  </div>
                  {voted !== null
                    ? <span style={{ ...font, color: voted === i ? "var(--gold)" : "rgba(255,255,255,0.4)", fontSize: "1.1rem" }}>{pct}%</span>
                    : <Icon name="ChevronRight" size={14} style={{ color: "rgba(255,255,255,0.25)" }} />
                  }
                </div>
              </button>
            );
          })}
        </div>
        {voted !== null && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", textAlign: "center", marginTop: 20, letterSpacing: "0.15em" }}>
            Спасибо за твой голос
          </motion.p>
        )}
      </motion.div>
    </div>,

    // ── Слайд 5: Финал ──
    <div key="final" className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden marble-bottom"
      style={{ background: "linear-gradient(0deg, #0a2e2e 0%, var(--ocean) 55%, #000 100%)" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(58,153,153,0.20) 0%, transparent 60%)" }} />
      <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
        className="relative z-10 text-center px-6 max-w-xl">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px" style={{ width: 48, background: "var(--gold)", opacity: 0.4 }} />
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", opacity: 0.6 }} />
          <div className="h-px" style={{ width: 48, background: "var(--gold)", opacity: 0.4 }} />
        </div>
        <h2 style={{ ...font, color: "#fff", fontSize: "clamp(2.5rem,9vw,4.5rem)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.2, marginBottom: 24 }}>
          Спасибо<br />за участие
        </h2>
        <div className="w-14 h-px mx-auto mb-6" style={{ background: "var(--gold)" }} />
        <p style={{ color: "rgba(255,255,255,0.5)", fontWeight: 300, fontSize: "0.88rem", lineHeight: 1.85, marginBottom: 40 }}>
          Каждый образ — это история.<br />Каждый голос — это мнение, которое важно.
        </p>
        <div className="inline-block px-8 py-5" style={{ border: "1px solid rgba(196,162,74,0.28)", background: "rgba(196,162,74,0.04)" }}>
          <p style={{ ...labelStyle, marginBottom: 8 }}>При поддержке</p>
          <p style={{ ...font, color: "#fff", fontSize: "1.25rem", fontWeight: 400, letterSpacing: "0.08em" }}>Семья Dezzer</p>
        </div>
      </motion.div>
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

      {/* Точки-навигация */}
      <div className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button key={i} onClick={() => go(i)}
            className="rounded-full transition-all duration-300"
            style={{ width: 5, height: i === current ? 18 : 5, background: i === current ? "var(--gold)" : "rgba(255,255,255,0.22)" }} />
        ))}
      </div>

      {/* Стрелки пк */}
      {current > 0 && (
        <button onClick={goPrev}
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-5 z-50 items-center justify-center w-8 h-8 rounded-full opacity-30 hover:opacity-70 transition-opacity"
          style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
          <Icon name="ChevronUp" size={14} style={{ color: "#fff" }} />
        </button>
      )}
      {current < TOTAL_SLIDES - 1 && (
        <button onClick={goNext}
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 bottom-5 z-50 items-center justify-center w-8 h-8 rounded-full opacity-30 hover:opacity-70 transition-opacity animate-bounce"
          style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
          <Icon name="ChevronDown" size={14} style={{ color: "#fff" }} />
        </button>
      )}
    </div>
  );
}