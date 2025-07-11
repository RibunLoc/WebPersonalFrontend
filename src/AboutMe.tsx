import { useState } from "react";
import styles from "./AboutMe.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
// Import từng slide
import AboutMeSlide1 from "./components/Slider/AboutMeSlide1";
import AboutMeSlide2 from "./components/Slider/AboutMeSlide2";
import AboutMeSlide3 from "./components/Slider/AboutMeSlide3";

const slides = [AboutMeSlide1, AboutMeSlide2, AboutMeSlide3];

export default function AboutMe() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const SlideComponent = slides[index];

  const handlerNext = () =>{
   setDirection(1),
   setIndex((prev) => (prev + 1) % slides.length);
  }

  const handlerPrev = () => {
    setDirection(-1),
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handlerNext,
    onSwipedRight: handlerPrev,
    preventScrollOnSwipe: true,
    trackMouse: true,
  })

  return (
    <section className={styles.aboutSection} id="about">
      <div className={styles.content} {...swipeHandlers}>
        <button onClick={handlerPrev} className={styles.arrow}>&larr;</button>

        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ x:direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x:0, opacity:1 }}
              exit={{ x:direction > 0 ? -300: 300, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SlideComponent />
            </motion.div>
          </AnimatePresence>
        </div>

        <button onClick={handlerNext} className={styles.arrow}>&rarr;</button>
      </div>

      <div className={styles.dots}>
        {slides.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === index ? styles.active : ""}`}
          />
        ))}
      </div>
    </section>
  );
}
