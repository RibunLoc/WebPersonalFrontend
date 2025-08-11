import { useLayoutEffect, useRef, useState } from "react";
import styles from "./AboutMe.module.css";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import AboutMeSlide1 from "./components/Slider/AboutMeSlide1";
import AboutMeSlide2 from "./components/Slider/AboutMeSlide2";
import AboutMeSlide3 from "./components/Slider/AboutMeSlide3";
import AboutMeSlide4 from "./components/Slider/AboutMeSlide4";

const slides = [AboutMeSlide1, AboutMeSlide2, AboutMeSlide3, AboutMeSlide4];

// Định nghĩa variants cho cả enter, center (animate) và exit
const variants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};


export default function AboutMe() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [stageH, setStageH] = useState<number>();
  const slideRef = useRef<HTMLDivElement>(null);
  const SlideComponent = slides[index];

  useLayoutEffect(() => {
    const el = slideRef.current;
    if (!el) return;

    const measure = () => {
      // +16 cho khoảng thở/bóng nếu cần
      const h = el.getBoundingClientRect().height + 16;
      setStageH(h);
    };

    // đo mượt sau khi layout xong
    const rafMeasure = () => requestAnimationFrame(measure);

    // quan sát mọi thay đổi kích thước của nội dung
    const ro = new ResizeObserver(rafMeasure);
    ro.observe(el);

    // đo lần đầu + khi resize cửa sổ
    rafMeasure();
    window.addEventListener("resize", rafMeasure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", rafMeasure);
    };
  }, [index]);

  const handlerNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const handlerPrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handlerNext,
    onSwipedRight: handlerPrev,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

   return (
    <section className={styles.aboutSection} id="about">
      <h2 className={styles.sectionTitle}>About Me</h2>
      <div
        className={styles.content}
        {...swipeHandlers}
      >
        <div className={styles.sliderGrid}>
          <button
            onClick={handlerPrev}
            className={`${styles.navBtn} ${styles.left}`}
            aria-label="Previous"
          >
            <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
              <path d="M16 4L8 12l8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className={styles.stage} style={{ height : stageH }}>
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={styles.slideStage}
              >
                <div ref={slideRef} className={styles.slideContent}>
                  <SlideComponent />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={handlerNext}
            className={`${styles.navBtn} ${styles.right}`}
            aria-label="Next"
          >
            <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
              <path d="M8 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

        </div>
      </div>


      <div className={styles.dots}>
        {slides.map((_, i) => (
          <span key={i} className={`${styles.dot} ${i === index ? styles.active : ""}`} />
        ))}
      </div>
    </section>
  );
}
