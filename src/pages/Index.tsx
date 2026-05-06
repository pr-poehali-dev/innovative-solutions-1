import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/icon";

const PARTICIPANTS = [
  {
    id: 1,
    name: "Алина",
    country: "Япония",
    flag: "🇯🇵",
    image: "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/files/c0ddf5a4-5e03-4ad1-b219-0fc50b36f46a.jpg",
    style: "Загадочный · Утончённый",
    look: "Шёлковое кимоно цвета ночного индиго с золотыми журавлями, лаковые гета, веер из чёрного бамбука",
    drink: "Матча с горьким шоколадом",
    food: "Суши с икрой и трюфельным маслом",
    vibe: "Тишина перед рассветом. Древняя сила в каждом движении.",
  },
  {
    id: 2,
    name: "Карина",
    country: "Франция",
    flag: "🇫🇷",
    image: "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/files/f498eb02-2eed-49e0-8113-e92a232f4112.jpg",
    style: "Элегантный · Дерзкий",
    look: "Чёрное платье от кутюр, тонкий золотой браслет, красная помада — единственный акцент",
    drink: "Шампанское Blanc de Noirs",
    food: "Устрицы с лимонным сорбе",
    vibe: "Парижская ночь. Полная уверенность без единого слова.",
  },
  {
    id: 3,
    name: "Виктория",
    country: "Италия",
    flag: "🇮🇹",
    image: "https://cdn.poehali.dev/projects/a197df66-adff-4ab1-ba15-029c7f21ad43/files/4e07659c-dbcf-4672-8550-971916e2def8.jpg",
    style: "Мощный · Чувственный",
    look: "Тёмный бархат с золотым шитьём, массивные украшения эпохи Ренессанса, открытые плечи",
    drink: "Тёмный Amarone della Valpolicella",
    food: "Трюфельное ризотто и горький шоколад",
    vibe: "Богиня, сошедшая с фрески. Красота как власть.",
  },
];

const slideVariants = {
  enter: (dir: number) => ({
    y: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: { y: "0%", opacity: 1 },
  exit: (dir: number) => ({
    y: dir > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

const TOTAL_SLIDES = 6;

export default function Index() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [voted, setVoted] = useState<number | null>(null);
  const [votes, setVotes] = useState([0, 0, 0]);
  const isAnimating = useRef(false);
  const touchStart = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => {
      if (isAnimating.current) return;
      if (next < 0 || next >= TOTAL_SLIDES) return;
      isAnimating.current = true;
      setDirection(next > current ? 1 : -1);
      setCurrent(next);
      setTimeout(() => { isAnimating.current = false; }, 700);
    },
    [current]
  );

  const goNext = useCallback(() => go(current + 1), [current, go]);
  const goPrev = useCallback(() => go(current - 1), [current, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") goNext();
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) { if (diff > 0) { goNext(); } else { goPrev(); } }
    touchStart.current = null;
  };

  const handleVote = (idx: number) => {
    if (voted !== null) return;
    setVoted(idx);
    setVotes((v) => v.map((c, i) => (i === idx ? c + 1 : c)));
  };

  const totalVotes = votes.reduce((a, b) => a + b, 0) || 1;

  const slides = [
    // Слайд 0 — Обложка
    <div key="cover" className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden marble-top" style={{ background: "linear-gradient(180deg, #0d3535 0%, var(--ocean) 45%, #000 100%)" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(95,184,184,0.18) 0%, transparent 60%)" }} />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative z-10 text-center px-6 max-w-2xl"
      >
        <p className="text-xs uppercase tracking-[0.35em] mb-6" style={{ color: "var(--gold)", fontFamily: "Montserrat" }}>
          Интерактивное голосование
        </p>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-light mb-4 leading-none" style={{ color: "#fff", fontFamily: "Cormorant Garamond", fontStyle: "italic" }}>
          Образ
        </h1>
        <h2 className="text-4xl md:text-6xl font-light mb-10 tracking-widest" style={{ color: "var(--gold-light, #e8c97a)", fontFamily: "Cormorant Garamond" }}>
          & Страна
        </h2>
        <div className="w-16 h-px mx-auto mb-8" style={{ background: "var(--gold)" }} />
        <p className="text-sm md:text-base font-light tracking-wide leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
          Три участницы. Три страны. Три образа.<br />Кто воплотила своё лучше всех?
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Листай вниз</p>
        <Icon name="ChevronDown" size={18} className="animate-bounce" style={{ color: "var(--gold)" }} />
      </motion.div>
    </div>,

    // Слайды 1-3 — Участницы
    ...PARTICIPANTS.map((p, idx) => (
      <div key={`p-${idx}`} className="relative w-full h-full flex overflow-hidden marble-sides" style={{ background: "var(--ocean)" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(95,184,184,0.07) 0%, transparent 50%, rgba(201,168,76,0.05) 100%)" }} />
        {/* Изображение */}
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 md:relative md:w-1/2 h-full"
        >
          <img src={p.image} alt={p.name} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 40%, var(--ocean) 100%)" }} />
          <div className="absolute inset-0 md:hidden" style={{ background: "linear-gradient(to top, var(--ocean) 40%, transparent 80%)" }} />
        </motion.div>

        {/* Контент */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 flex flex-col justify-end md:justify-center md:w-1/2 p-8 md:p-12 lg:p-16 h-full"
        >
          <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: "var(--gold)" }}>
            Участница {idx + 1}
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-1" style={{ color: "#fff", fontFamily: "Cormorant Garamond" }}>
            {p.name}
          </h2>
          <p className="text-2xl md:text-3xl font-light mb-6 tracking-wide" style={{ color: "var(--teal-light, #2a9090)", fontFamily: "Cormorant Garamond", fontStyle: "italic" }}>
            {p.flag} {p.country}
          </p>

          <div className="w-10 h-px mb-6" style={{ background: "var(--gold)" }} />

          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--gold)", opacity: 0.7 }}>Стиль</p>
          <p className="text-base mb-4 font-light" style={{ color: "rgba(255,255,255,0.85)" }}>{p.style}</p>

          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--gold)", opacity: 0.7 }}>Образ</p>
          <p className="text-sm mb-4 font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{p.look}</p>

          <div className="flex gap-6 mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--gold)", opacity: 0.7 }}>Напиток</p>
              <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.75)" }}>{p.drink}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--gold)", opacity: 0.7 }}>Еда</p>
              <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.75)" }}>{p.food}</p>
            </div>
          </div>

          <div className="border-l-2 pl-4 mt-2" style={{ borderColor: "var(--gold)" }}>
            <p className="text-sm font-light italic" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Cormorant Garamond", fontSize: "1rem" }}>{p.vibe}</p>
          </div>
        </motion.div>
      </div>
    )),

    // Слайд 4 — Голосование
    <div key="vote" className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden marble-sides" style={{ background: "linear-gradient(160deg, var(--ocean) 0%, #050d1a 100%)" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(26,107,107,0.12) 0%, transparent 70%)" }} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-lg px-6"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-center mb-3" style={{ color: "var(--gold)" }}>Финальный выбор</p>
        <h2 className="text-4xl md:text-5xl font-light text-center mb-2" style={{ color: "#fff", fontFamily: "Cormorant Garamond" }}>
          Кто лучше всех<br />воплотила образ?
        </h2>
        <div className="w-12 h-px mx-auto mb-8 mt-4" style={{ background: "var(--gold)" }} />

        <div className="flex flex-col gap-4">
          {PARTICIPANTS.map((p, i) => {
            const pct = voted !== null ? Math.round((votes[i] / totalVotes) * 100) : 0;
            const isWinner = voted !== null && votes[i] === Math.max(...votes);
            return (
              <button
                key={i}
                onClick={() => handleVote(i)}
                disabled={voted !== null}
                className="relative overflow-hidden text-left transition-all duration-500 cursor-pointer disabled:cursor-default"
                style={{
                  border: `1px solid ${voted === i ? "var(--gold)" : "rgba(255,255,255,0.12)"}`,
                  borderRadius: "2px",
                  background: voted === i ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)",
                }}
              >
                {voted !== null && (
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0"
                    style={{ background: voted === i ? "rgba(201,168,76,0.15)" : "rgba(95,184,184,0.08)" }}
                  />
                )}
                <div className="relative z-10 flex items-center justify-between p-4 md:p-5">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{p.flag}</span>
                    <div>
                      <p className="font-light text-base" style={{ color: "#fff", fontFamily: "Cormorant Garamond", fontSize: "1.2rem" }}>{p.name}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{p.country}</p>
                    </div>
                    {isWinner && voted !== null && (
                      <span className="text-xs uppercase tracking-widest px-2 py-0.5" style={{ color: "var(--gold)", border: "1px solid var(--gold)" }}>
                        Лидер
                      </span>
                    )}
                  </div>
                  {voted !== null ? (
                    <span className="text-lg font-light" style={{ color: voted === i ? "var(--gold)" : "rgba(255,255,255,0.5)", fontFamily: "Cormorant Garamond" }}>
                      {pct}%
                    </span>
                  ) : (
                    <Icon name="ChevronRight" size={16} style={{ color: "rgba(255,255,255,0.3)" }} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {voted !== null && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs mt-6 tracking-wide"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Спасибо за твой голос
          </motion.p>
        )}
      </motion.div>
    </div>,

    // Слайд 5 — Финал
    <div key="final" className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden marble-bottom" style={{ background: "linear-gradient(0deg, #0d3535 0%, var(--ocean) 55%, #000 100%)" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(95,184,184,0.18) 0%, transparent 60%)" }} />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-6 max-w-xl"
      >
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px flex-1 max-w-16" style={{ background: "var(--gold)", opacity: 0.4 }} />
          <Icon name="Star" size={16} style={{ color: "var(--gold)" }} />
          <div className="h-px flex-1 max-w-16" style={{ background: "var(--gold)", opacity: 0.4 }} />
        </div>

        <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight" style={{ color: "#fff", fontFamily: "Cormorant Garamond", fontStyle: "italic" }}>
          Спасибо<br />за участие
        </h2>

        <div className="w-16 h-px mx-auto mb-6" style={{ background: "var(--gold)" }} />

        <p className="text-sm md:text-base font-light leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.6)" }}>
          Каждый образ — это история.<br />
          Каждый голос — это мнение, которое важно.
        </p>

        <div className="border px-8 py-5" style={{ borderColor: "rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.05)" }}>
          <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: "var(--gold)", opacity: 0.7 }}>Создано с любовью</p>
          <p className="text-lg font-light tracking-wide" style={{ color: "#fff", fontFamily: "Cormorant Garamond" }}>
            Семья Dezzer ✦
          </p>
        </div>
      </motion.div>
    </div>,
  ];

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ background: "var(--ocean)" }}
    >
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0"
        >
          {slides[current]}
        </motion.div>
      </AnimatePresence>

      {/* Навигация */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: i === current ? "var(--gold)" : "rgba(255,255,255,0.25)",
              transform: i === current ? "scale(1.4)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Кнопки вперёд/назад (ПК) */}
      {current > 0 && (
        <button
          onClick={goPrev}
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-6 z-50 items-center gap-2 text-xs uppercase tracking-widest transition-opacity duration-300 hover:opacity-100 opacity-40"
          style={{ color: "#fff" }}
        >
          <Icon name="ChevronUp" size={14} />
        </button>
      )}
      {current < TOTAL_SLIDES - 1 && (
        <button
          onClick={goNext}
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 bottom-6 z-50 items-center gap-2 text-xs uppercase tracking-widest transition-opacity duration-300 hover:opacity-100 opacity-40 animate-bounce"
          style={{ color: "#fff" }}
        >
          <Icon name="ChevronDown" size={14} />
        </button>
      )}
    </div>
  );
}