import React, { useState } from "react";
import styles from "./AboutMe.module.css";

// Import từng slide
import AboutMeSlide1 from "./components/Slider/AboutMeSlide1";
import AboutMeSlide2 from "./components/Slider/AboutMeSlide2";
import AboutMeSlide3 from "./components/Slider/AboutMeSlide3";

const slides = [AboutMeSlide1, AboutMeSlide2, AboutMeSlide3];

export default function AboutMe() {
  const [index, setIndex] = useState(0);
  const SlideComponent = slides[index];

  const handlerNext = () => setIndex((prev) => (prev + 1) % slides.length);
  const handlerPrev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className={styles.aboutSection} id="about">
      <div className={styles.content}>
        <button onClick={handlerPrev} className={styles.arrow}>&larr;</button>

        <div className={styles.slide}>
          <SlideComponent />
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
