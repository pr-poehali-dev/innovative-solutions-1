import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/icon";

const VOTES_URL = "https://functions.poehali.dev/13ec25b1-0baf-4fd3-9ae0-3e07c0320dce";

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
  exit: (dir: number) => ({ y: dir > 0 ? "-100%" : "100%", opacity: 0 }),
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
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
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

      {active > 0 && (
        <button onClick={(e) => { e.stopPropagation(); goImg(active - 1); }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full opacity-60 hover:opacity-100 transition-opacity"
          style={{ background: "rgba(2,6,13,0.65)", border: "1px solid rgba(196,162,74,0.35)" }}>
          <Icon name="ChevronLeft" size={14} style={{ color: "var(--gold)" }} />
        </button>
      )}
      {active < images.length - 1 && (
        <button onClick={(e) => { e.stopPropagation(); goImg(active + 1); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full opacity-60 hover:opacity-100 transition-opacity"
          style={{ background: "rgba(2,6,13,0.65)", border: "1px solid rgba(196,162,74,0.35)" }}>
          <Icon name="ChevronRight" size={14} style={{ color: "var(--gold)" }} />
        </button>
      )}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {images.map((_, i) => (
          <button key={i} onClick={(e) => { e.stopPropagation(); goImg(i); }}
            className="rounded-full transition-all duration-300"
            style={{ width: i === active ? 16 : 5, height: 5, background: i === active ? "var(--gold)" : "rgba(255,255,255,0.3)" }} />
        ))}
      </div>
    </div>
  );
}

export default function Index() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [voted, setVoted] = useState<number | null>(null);
  const [votes, setVotes] = useState<number[]>([0, 0, 0]);
  const isAnimating = useRef(false);
  const touchStart = useRef<number | null>(null);

  // Загружаем актуальные результаты при монтировании
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
    const participantId = idx + 1;
    setVotes(v => v.map((c, i) => i === idx ? c + 1 : c));
    try {
      await fetch(VOTES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant_id: participantId }),
      });
      // Обновляем реальные данные
      const r = await fetch(VOTES_URL);
      const data = await r.json();
      const v = data.votes as Record<string, number>;
      setVotes([v["1"] || 0, v["2"] || 0, v["3"] || 0]);
    } catch (e) { console.error(e); }
  };

  const totalVotes = votes.reduce((a, b) => a + b, 0) || 1;

  // Общие стили
  const font: React.CSSProperties = { fontFamily: "Playfair Display, Georgia, serif" };
  const lbl: React.CSSProperties = {
    color: "var(--gold)",
    opacity: 0.6,
    fontFamily: "DM Sans",
    fontSize: "0.62rem",
    letterSpacing: "0.28em",
    textTransform: "uppercase",
  };

  // Тёмный насыщенный фон с объёмом
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
          <PhotoGallery images={p.images} />
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
            {p.flag} {p.country}
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
                    <span style={{ fontSize: "1.3rem" }}>{p.flag}</span>
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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
        className="relative z-10 text-center px-6 max-w-sm">
        <p style={{ ...lbl, marginBottom: 28 }}>Style Select</p>
        <h2 style={{ ...font, color: "#fff", fontSize: "clamp(2.4rem,9vw,4.2rem)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.15, marginBottom: 28 }}>
          Спасибо<br />за участие
        </h2>
        <p style={{ color: "rgba(255,255,255,0.42)", fontWeight: 300, fontSize: "0.85rem", lineHeight: 1.9, marginBottom: 36 }}>
          Каждый образ — это история.<br />Каждый голос — это мнение, которое важно.
        </p>
        <div style={{ border: "1px solid rgba(196,162,74,0.25)", background: "rgba(196,162,74,0.04)", padding: "18px 36px", display: "inline-block" }}>
          <p style={{ ...lbl, marginBottom: 8 }}>при поддержке</p>
          <p style={{ ...font, color: "#fff", fontSize: "1.2rem", fontWeight: 400, letterSpacing: "0.06em" }}>Семья Dezzer</p>
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
      <div className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button key={i} onClick={() => go(i)} className="rounded-full transition-all duration-300"
            style={{ width: 4, height: i === current ? 20 : 4, background: i === current ? "var(--gold)" : "rgba(255,255,255,0.20)" }} />
        ))}
      </div>

      {/* Кнопки пк */}
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