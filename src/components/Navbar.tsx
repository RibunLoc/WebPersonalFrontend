import { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from "react";
import type React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { HiOutlineBars3 } from "react-icons/hi2";
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
  const location = useLocation();
  const navigate = useNavigate();
  const onHomePage = location.pathname === "/";
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
  const [activeHash, setActiveHash] = useState(() => {
    if (typeof window === "undefined") return "#home";
    return window.location.hash || "#home";
  });

  const panelRef = useRef<HTMLDivElement | null>(null);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!mobileOpen) return;
    if (e.key === "Escape") {
      e.preventDefault();
      setMobileOpen(false);
      return;
    }
    if (e.key === "Tab" && panelRef.current) {
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      }
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen && panelRef.current) {
      const first = panelRef.current.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    }
  }, [mobileOpen]);

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
    const sections = NAV_LINKS
      .map(({ href }) => document.querySelector<HTMLElement>(href))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;

    const navH = headerRef.current?.offsetHeight ?? 82;

    // Bản đồ theo dõi mức giao cắt và vị trí theo thời điểm gần nhất
    const vis = new Map<string, { ratio: number; top: number }>();

    const pickActive = () => {
      if (!sections.length) return;
      // Ưu tiên section có |top - navH| nhỏ nhất trong số đang intersect
      const inter = sections
        .map((s) => {
          const v = vis.get(s.id);
          const top = s.getBoundingClientRect().top; // cập nhật top “tươi”
          return {
            id: s.id,
            top,
            ratio: v?.ratio ?? 0,
            dist: Math.abs(top - navH - 12),
          };
        })
        .filter((x) => x.ratio > 0);

      let candidate: { id: string } | undefined;

      if (inter.length) {
        candidate = inter.sort((a, b) => a.dist - b.dist || b.ratio - a.ratio)[0];
      } else {
        // Fallback: chọn cái gần mép trên nhất ngay cả khi không intersect
        candidate = sections
          .map((s) => ({ id: s.id, dist: Math.abs(s.getBoundingClientRect().top - navH - 12) }))
          .sort((a, b) => a.dist - b.dist)[0];
      }

      if (candidate) {
        const newHash = `#${candidate.id}`;
        setActiveHash((prev) => (prev === newHash ? prev : newHash));
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = (e.target as HTMLElement).id;
          vis.set(id, { ratio: e.intersectionRatio, top: e.boundingClientRect.top });
        }
        // Gọi chọn active sau mỗi batch
        pickActive();
      },
      {
        root: null,
        // “Bắt giữa”: phần tử cắt qua vùng giữa màn hình thì được tính intersect
        rootMargin: `-${navH + 12}px 0px -50% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((s) => io.observe(s));
    // Chạy lần đầu
    pickActive();

    return () => io.disconnect();
  }, []);



  // Add smooth scroll handler
  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const isDesktop = window.innerWidth >= 960;

      const markActive = () => {
        setActiveHash((prev) => (prev === hash ? prev : hash));
      };

      if (onHomePage && isDesktop) {
        markActive();
        return;
      }

      e.preventDefault();

      const queueScroll = () => {
        markActive();
        setPendingHref(hash);
        if (!isDesktop) {
          setMobileOpen(false);
        }
      };

      if (!onHomePage) {
        navigate({ pathname: "/", hash });
        queueScroll();
        return;
      }

      queueScroll();
    },
    [navigate, onHomePage]
  );

  useEffect(() => {
    if (!pendingHref || mobileOpen) return;

    const scrollToPending = () => {
      const target = document.querySelector<HTMLElement>(pendingHref);
      if (!target) return false;

      const navHeight = headerRef.current?.offsetHeight ?? 82;
      const y = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

      window.history.pushState(null, "", pendingHref);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        });
      });

      return true;
    };

    if (scrollToPending()) {
      setPendingHref(null);
      return;
    }

    const raf = requestAnimationFrame(() => {
      if (scrollToPending()) {
        setPendingHref(null);
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [pendingHref, mobileOpen, location.pathname]);


  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash || "#home");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
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
    if (typeof document === "undefined") return;

    if (!mobileOpen) {
      document.body.classList.remove("menu-open");
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("menu-open");

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("menu-open");
    };
  }, [mobileOpen]);

  return (
    <header ref={headerRef} className={styles.wrapper}>
      <div className={styles.inner}>
        <a
          href={onHomePage ? "#home" : "/#home"}
          className={styles.brand}
          aria-label="Về đầu trang"
          onClick={(e) => handleLinkClick(e, "#home")}
        >
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.brandText}>Thanh Lộc</span>
        </a>

        <button
          className={styles.menuToggle}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="main-navigation"
          aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <MdClose className={styles.icon} aria-hidden="true" /> : <HiOutlineBars3 className={styles.icon} aria-hidden="true" />}
          <span className={styles.srOnly}>{mobileOpen ? "Đóng menu" : "Mở menu"}</span>
        </button>


        <nav id="main-navigation" className={`${styles.nav} ${mobileOpen ? styles.open : ""}`} onKeyDown={onKeyDown}>
        {/* --- DESKTOP BAR --- */}
        <div className={styles.navContent}>
          <ul className={styles.linkList}>
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = activeHash === href;
              const targetHref = onHomePage ? href : `/${href}`;
              return (
                <li key={href}>
                  <a
                    href={targetHref}
                    className={`${styles.link} ${isActive ? styles.active : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => handleLinkClick(e, href)}
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
              onClick={() => setDarkMode(v => !v)}
            >
              {darkMode ? <MdOutlineLightMode aria-hidden="true" /> : <MdOutlineDarkMode aria-hidden="true" />}
            </button>
            <a
              href={onHomePage ? "#contact" : "/#contact"}
              className={styles.cta}
              onClick={(e) => handleLinkClick(e, "#contact")}
            >
              Kết nối ngay
            </a>
          </div>
        </div>

        {/* --- MOBILE OVERLAY --- */}
        {mobileOpen && (
          <button
            type="button"
            aria-label="Đóng menu"
            className={styles.backdrop}
            onClick={() => setMobileOpen(false)}
            tabIndex={-1}
          />
        )}
        <div className={styles.navPanel} ref={panelRef} aria-hidden={!mobileOpen}>
          <ul className={styles.linkList}>
            {NAV_LINKS.map(({ href, label }, i) => {
              const isActive = activeHash === href;
              const targetHref = onHomePage ? href : `/${href}`;
              return (
                <li key={href} style={{ "--i": i } as React.CSSProperties}>
                  <a
                    href={targetHref}
                    className={`${styles.link} ${isActive ? styles.active : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => handleLinkClick(e, href)}
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
              onClick={() => setDarkMode(v => !v)}
            >
              {darkMode ? <MdOutlineLightMode aria-hidden="true" /> : <MdOutlineDarkMode aria-hidden="true" />}
            </button>
            <a
              href={onHomePage ? "#contact" : "/#contact"}
              className={styles.cta}
              onClick={(e) => handleLinkClick(e, "#contact")}
            >
              Kết nối ngay
            </a>
          </div>
          <p className={styles.mobileNote}>Sẵn sàng trao đổi về dự án mới hoặc cơ hội cộng tác thú vị.</p>
        </div>
      </nav>
      </div>
    </header>
  );
}
