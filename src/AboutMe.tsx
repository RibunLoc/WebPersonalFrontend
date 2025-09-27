// AboutMe.tsx (Pro Stable: no push/jank)
import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect as _useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "./AboutMe.module.css";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useSwipeable } from "react-swipeable";

const AboutMeSlide1 = lazy(() => import("./components/Slider/AboutMeSlide1"));
const AboutMeSlide2 = lazy(() => import("./components/Slider/AboutMeSlide2"));
const AboutMeSlide3 = lazy(() => import("./components/Slider/AboutMeSlide3"));
const AboutMeSlide4 = lazy(() => import("./components/Slider/AboutMeSlide4"));
const slides = [AboutMeSlide1, AboutMeSlide2, AboutMeSlide3, AboutMeSlide4];

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? _useLayoutEffect : useEffect;

/** Biến thể trượt theo % chiều rộng để mượt đa màn hình */
type DirW = { dir: number; w: number };
const variants: Variants = {
  enter: ({ dir, w }: DirW) => ({ x: dir > 0 ? w * 0.25 : -w * 0.25, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: ({ dir, w }: DirW) => ({ x: dir > 0 ? -w * 0.25 : w * 0.25, opacity: 0 }),
};

export default function AboutMe() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [animating, setAnimating] = useState(false);

  // KÍCH THƯỚC
  const [stageW, setStageW] = useState(0);
  const [stageH, setStageH] = useState<number>(180); // default tránh giật lần đầu

  const stageRef = useRef<HTMLDivElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null); // invisible sizer đo height thực

  const prefersReduced = useReducedMotion();
  const SlideComponent = slides[index];

  // Đo WIDTH của sân khấu để tính x offset
  useIsomorphicLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStageW(el.clientWidth));
    ro.observe(el);
    setStageW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Đo HEIGHT thực tế của slide hiện tại bằng sizer (invisible)
  useIsomorphicLayoutEffect(() => {
    const el = sizerRef.current;
    if (!el) return;

    const measure = () => setStageH(Math.ceil(el.getBoundingClientRect().height));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // đo lần đầu sau layout
    const raf = requestAnimationFrame(measure);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [index]);

  // ĐIỀU HƯỚNG
  const safeSetIndex = (nextIdx: number, dir: number) => {
    if (animating) return;
    setDirection(dir);
    setIndex(nextIdx);
  };
  const handlerNext = () => safeSetIndex((index + 1) % slides.length, 1);
  const handlerPrev = () => safeSetIndex((index - 1 + slides.length) % slides.length, -1);
  const goTo = (i: number) => {
    if (i === index) return;
    safeSetIndex(i, i > index ? 1 : -1);
  };

  // SWIPE: bỏ qua nếu tương tác trên control
  const swipeHandlers = useSwipeable({
    onSwipedLeft: (e) => {
      const t = e.event.target as HTMLElement;
      if (t.closest("button,input,textarea,a,[role='tab']")) return;
      handlerNext();
    },
    onSwipedRight: (e) => {
      const t = e.event.target as HTMLElement;
      if (t.closest("button,input,textarea,a,[role='tab']")) return;
      handlerPrev();
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const slideTransition = prefersReduced
    ? { duration: 0, ease: "linear" as const }
    : { duration: 0.42, ease: "easeInOut" as const };

  const heightTransition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.28, ease: "easeOut" as const };

  return (
    <section
      className={styles.aboutSection}
      id="about"
      aria-roledescription="carousel"
      aria-label="Giới thiệu về tôi"
    >
      <h2 className={styles.sectionTitle}>Giới thiệu về tôi</h2>

      <div className={styles.content} {...swipeHandlers}>
        <div className={styles.sliderGrid}>
          <button
            onClick={handlerPrev}
            className={`${styles.navBtn} ${styles.left}`}
            aria-label="Previous slide"
            aria-controls={`about-slide-${index}`}
            disabled={animating}
          >
            <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
              <path d="M16 4L8 12l8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* SÂN KHẤU: KHÓA CHIỀU CAO THEO SIZER, SLIDE CHỒNG ABSOLUTE */}
          <motion.div
            className={styles.stage}
            ref={stageRef}
            style={{ height: stageH }}
            animate={{ height: stageH }}
            transition={heightTransition}
            aria-live="polite"
          >
            {/* Layer animate: absolute để không đẩy layout */}
            <AnimatePresence custom={{ dir: direction, w: stageW }} initial={false}>
              <motion.div
                key={index}
                custom={{ dir: direction, w: stageW }}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className={styles.slideStage}        // absolute
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} trên ${slides.length}`}
                id={`about-slide-${index}`}
                onAnimationStart={() => setAnimating(true)}
                onAnimationComplete={() => setAnimating(false)}
              >
                {/* CARD – cần class .slide để nhận style card */}
                <div className={styles.slide}>
                  <div className={styles.slideContent}>
                    <Suspense fallback={<div style={{ height: 160 }} />}>
                      <SlideComponent />
                    </Suspense>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* INVISIBLE SIZER: render cùng slide hiện tại để đo height thật */}
            <div
              ref={sizerRef}
              aria-hidden="true"
              style={{
                visibility: "hidden",
                pointerEvents: "none",
                position: "relative",
              }}
            >
              <div className={styles.slide}>
                <div className={styles.slideContent}>
                  {/* Không Suspense để đo đủ height của nội dung đã tải */}
                  <SlideComponent />
                </div>
              </div>
            </div>
          </motion.div>

          <button
            onClick={handlerNext}
            className={`${styles.navBtn} ${styles.right}`}
            aria-label="Next slide"
            aria-controls={`about-slide-${index}`}
            disabled={animating}
          >
            <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
              <path d="M8 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* DOTS */}
      <div
        className={styles.dots}
        role="tablist"
        aria-label="Chọn slide"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") goTo(Math.max(0, index - 1));
          if (e.key === "ArrowRight") goTo(Math.min(slides.length - 1, index + 1));
          if (e.key === "Home") goTo(0);
          if (e.key === "End") goTo(slides.length - 1);
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={styles.dotBtn}
            aria-label={`Tới slide ${i + 1}`}
            aria-selected={i === index}
            role="tab"
            aria-controls={`about-slide-${i}`}
            onClick={() => goTo(i)}
          >
            <span className={styles.dotBase} />
            {i === index && (
              <motion.span
                layoutId="dotActive"
                className={styles.dotActive}
                transition={{ type: "spring", stiffness: 520, damping: 34 }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
