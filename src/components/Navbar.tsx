import { useEffect, useState, useRef } from "react";
import styles from "./Navbar.module.css";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";

const SECTIONS = ["home", "about", "experience", "project", "hobbies"] as const;

export default function Navbar() {
  // Khởi tạo dark mode: ưu tiên localStorage, fallback theo system
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string>("#home");


  // Ân hiện theo cuộn
  const [isHidden, setIsHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [forceReveal, setForceReveal] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setCanHover(window.matchMedia?.("(hover: hover)").matches ?? false);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setAtTop( y < 10 );

          if (forceReveal || isMobileMenuOpen) {
            lastY.current = y;
            ticking.current = false;
            return;
          }

          const goingDown = y > lastY.current;

          if (goingDown && y > 120 && !isMobileMenuOpen) {
            setIsHidden(true);
          } else if ( !goingDown ) {
            setIsHidden(false);
          }

          lastY.current = y;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobileMenuOpen, forceReveal]);


  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);

  // Theo dõi section bằng IntersectionObserver để set active link mượt hơn
  useEffect(() => {
  let raf = 0;                               // id của requestAnimationFrame
  let disconnect: (() => void) | undefined;  // lưu cleanup cho observer

  const start = () => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );

    if (els.length === 0) {
      // DOM section chưa sẵn -> thử lại frame sau
      raf = requestAnimationFrame(start);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveLink(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 }
    );

    els.forEach((el) => observer.observe(el));

    // lưu cleanup để gọi khi unmount
    disconnect = () => observer.disconnect();
  };

  start();

  return () => {
    if (raf) cancelAnimationFrame(raf);
    if (disconnect) disconnect();
  };
}, []);

  // Đóng menu khi resize về desktop (tránh kẹt trạng thái mở)
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const shouldShow = !isHidden || forceReveal || atTop || isMobileMenuOpen;


  const hideDelay = useRef<number | null>(null);
  const holdReveal = () => {
    if (hideDelay.current) {
      clearTimeout(hideDelay.current);
      hideDelay.current = null;
    }
    setForceReveal(true);
  };
  const releaseReveal = () => {
    // delay nhỏ để tránh giật khi chuyển tiếp giữa revealZone ↔ navbar
    if (hideDelay.current) clearTimeout(hideDelay.current);
    hideDelay.current = window.setTimeout(() => setForceReveal(false), 120);
  };

  return (
    <>
    {canHover && (
      <div
      className={styles.revealZone }
      aria-hidden="true"
      role="presentation"
      onMouseEnter={holdReveal}
      onMouseLeave={releaseReveal}
    />
    )}

    <header
      className={`${styles.navbar} ${shouldShow ? "" : styles.hidden}`}
      onMouseEnter={holdReveal}
      onMouseLeave={releaseReveal}
      onFocusCapture={holdReveal}
      onBlurCapture={releaseReveal}
    >
      <div className={styles.container}>
        {/* Avatar + tên */}
        <div className={styles.profile}>
          <img src="/avatar.jpg" alt="Avatar" className={styles.avatar} />
            <div>
              <h1 className={styles.name}>Thanh Lộc</h1>
              <p className={styles.subtitle}>Ri bún</p>
            </div>
          </div>

          <button
            className={styles.hamburger}
            onClick={toggleMobileMenu}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="main-menu"
            type="button"
          >
            <GiHamburgerMenu />
          </button>

          {/* Menu + DarkMode */}
          <div
            id="main-menu"
            className={`${styles.rightMenu} ${isMobileMenuOpen ? styles.open : ""}`}
          >
            <nav className={styles.navLinks}>
              {SECTIONS.map((section) => {
                const href = `#${section}`;
                const isActive = activeLink === href;
                return (
                  <a
                    key={section}
                    href={href}
                    className={`${styles.link} ${isActive ? styles.active : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </a>
                );
              })}
            </nav>

            <button
              onClick={() => setDarkMode((v) => !v)}
              className={styles.toggleButton}
              type="button"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {darkMode ? <MdDarkMode /> : <MdOutlineDarkMode />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
