import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { MdClose } from "react-icons/md";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { href: "#home", label: "Trang chủ" },
  { href: "#about", label: "Giới thiệu" },
  { href: "#experience", label: "Kinh nghiệm" },
  { href: "#project", label: "Dự án" },
  { href: "#contact", label: "Liên hệ" },
] as const;

export default function Navbar() {
  const prefersDark = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  }, []);

  const headerRef = useRef<HTMLElement | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = window.localStorage.getItem("theme");
    if (!saved) return prefersDark;
    return saved === "dark";
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("#home");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const headerEl = headerRef.current;
    if (!headerEl) return;

    const root = document.documentElement;
    const setHeight = () => {
      root.style.setProperty("--nav-h", `${headerEl.offsetHeight}px`);
    };

    setHeight();

    let frame = 0;
    const resizeObserver = typeof window.ResizeObserver !== "undefined"
      ? new window.ResizeObserver(() => {
          frame = window.requestAnimationFrame(setHeight);
        })
      : null;

    resizeObserver?.observe(headerEl);
    window.addEventListener("resize", setHeight);

    return () => {
      window.removeEventListener("resize", setHeight);
      if (resizeObserver && headerEl) {
        resizeObserver.unobserve(headerEl);
        resizeObserver.disconnect();
      }
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map(({ href }) => document.querySelector<HTMLElement>(href));
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          .forEach((entry) => setActiveHash(`#${entry.target.id}`));
      },
      {
        rootMargin: "-55% 0px -35% 0px",
        threshold: [0.1, 0.25, 0.6],
      }
    );

    sections.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 960) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [mobileOpen]);

  return (
    <header ref={headerRef} className={styles.wrapper}>
      <div className={styles.inner}>
        <a href="#home" className={styles.brand} aria-label="Về đầu trang">
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.brandText}>Thanh Lộc</span>
        </a>

        <button
          className={styles.menuToggle}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="main-navigation"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <HiMiniBars3BottomRight className={styles.menuIcon} aria-hidden="true" />
          <MdClose className={styles.closeIcon} aria-hidden="true" />
          <span className={"sr-only"}>Mở menu</span>
        </button>

        <nav
          id="main-navigation"
          className={`${styles.nav} ${mobileOpen ? styles.open : ""}`}
        >
          <ul className={styles.linkList}>
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = activeHash === href;
              return (
                <li key={href}>
                  <a
                    href={href}
                    className={`${styles.link} ${isActive ? styles.active : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.themeToggle}
              aria-label="Đổi giao diện sáng/tối"
              aria-pressed={darkMode}
              onClick={() => setDarkMode((prev) => !prev)}
            >
              {darkMode ? (
                <MdOutlineLightMode aria-hidden="true" />
              ) : (
                <MdOutlineDarkMode aria-hidden="true" />
              )}
            </button>
            <a href="#contact" className={styles.cta} onClick={() => setMobileOpen(false)}>
              Kết nối ngay
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
