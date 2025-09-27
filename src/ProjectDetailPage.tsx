import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import GithubSlugger from "github-slugger";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import mermaid from "mermaid";

import styles from "./ProjectDetailPage.module.css";
import { projects } from "./data/projects";

// ===== Types =====
type TOCItem = { level: number; text: string; id: string };

// ===== Utils =====
function slugVN(text: string, slugger: GithubSlugger) {
  return slugger.slug(text.normalize("NFC"));
}
function getTOC(markdown: string): TOCItem[] {
  const lines = markdown.split("\n");
  const toc: TOCItem[] = [];
  const slugger = new GithubSlugger();
  for (const line of lines) {
    const m = line.match(/^(#{2,4})\s+(.+)/);
    if (m) {
      const level = m[1].length;
      const raw = m[2].replace(/\s+#+\s*$/, "").trim();
      toc.push({ level, text: raw, id: slugVN(raw, slugger) });
    }
  }
  return toc;
}

// ===== Small UI helpers =====
function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      className={styles.copyBtn}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 1400);
      }}
      aria-label="Copy code"
      title="Copy"
      type="button"
    >
      {ok ? "✓ Copied" : "Copy"}
    </button>
  );
}


function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const prefersDark =
          typeof window !== "undefined" &&
          window.matchMedia?.("(prefers-color-scheme: dark)").matches;
        mermaid.initialize({ startOnLoad: false, theme: prefersDark ? "dark" : "default" });

        if (!ref.current) return;
        const id = "mmd-" + Math.random().toString(36).slice(2);
        const { svg, bindFunctions } = await mermaid.render(id, chart);

        if (!mounted || !ref.current) return;
        ref.current.innerHTML = svg;
        bindFunctions?.(ref.current);
      } catch {
        if (ref.current) ref.current.textContent = "Mermaid render error";
      }
    })();
    return () => { mounted = false; };
  }, [chart]);
  return <div className={styles.mermaidBox} ref={ref} />;
}


function MdImage(props: any) {
  const { src, alt } = props;
  return (
    <figure className={styles.mdFigure}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Zoom>
        <img src={src} alt={alt} loading="lazy" className={styles.mdImg} />
      </Zoom>
      {alt && <figcaption className={styles.mdCap}>{alt}</figcaption>}
    </figure>
  );
}

// helper: lấy text thuần từ ReactNode
function getRawText(node: any): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getRawText).join("");
  if (node.props && node.props.children) return getRawText(node.props.children);
  return "";
}

function CodeBlock({ inline, className, children, ...props }: any) {
  const raw = getRawText(children);
  const lang = (className || "").replace("language-", "");

  // Mermaid
  if (!inline && lang === "mermaid") return <Mermaid chart={raw} />;

  // Code block
  if (!inline) {
    return (
      <div className={styles.codeWrap}>
        <CopyBtn text={raw} />
        <pre className={className} {...props}>
          <code className={className}>{children}</code>
        </pre>
      </div>
    );
  }

  // Inline code
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}


function Reactions({ storageKey }: { storageKey: string }) {
  const EMOS = ["👍", "🔥", "⭐"] as const;
  const [counts, setCounts] = useState<number[]>(
    () => JSON.parse(localStorage.getItem(storageKey) || "[0,0,0]")
  );
  const bump = (i: number) => {
    const next = counts.slice();
    next[i] += 1;
    setCounts(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };
  return (
    <div className={styles.reactionBar}>
      {EMOS.map((e, i) => (
        <button
          key={e}
          className={styles.reactionBtn}
          onClick={() => bump(i)}
          type="button"
        >
          <span>{e}</span>
          <b>{counts[i]}</b>
        </button>
      ))}
    </div>
  );
}

function NavPrevNext({ currentId }: { currentId: string }) {
  const idx = projects.findIndex((p) => p.id === currentId);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx >= 0 && idx < projects.length - 1 ? projects[idx + 1] : null;

  return (
    <div className={styles.prevNext}>
      {prev ? (
        <Link className={styles.prev} to={`/projects/${prev.id}`} title={prev.title}>
          ← {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className={styles.next} to={`/projects/${next.id}`} title={next.title}>
          {next.title} →
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}

function RelatedProjects({
  currentId,
  tags,
}: {
  currentId: string;
  tags: string[];
}) {
  const list = useMemo(() => {
    const scored = projects
      .filter((p) => p.id !== currentId)
      .map((p) => ({
        p,
        score: (p.tags || []).filter((t) => tags.includes(t)).length,
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.p);
    return scored;
  }, [currentId, tags]);

  if (!list.length) return null;
  return (
    <div className={styles.relatedWrap}>
      <div className={styles.relatedTitle}>Bài liên quan</div>
      <div className={styles.relatedGrid}>
        {list.map((p) => (
          <Link key={p.id} className={styles.relatedItem} to={`/project/${p.id}`}>
            {p.cover ? (
              <img src={p.cover} alt={p.title} />
            ) : (
              <div className={styles.noCover} />
            )}
            <div className={styles.relatedMeta}>
              <div className={styles.relatedName}>{p.title}</div>
              <div className={styles.relatedTags}>
                {(p.tags || []).slice(0, 3).join(" · ")}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ======== React Bits (no-deps) ========
const cx = (...cls: Array<string | undefined | false | null>) =>
  cls.filter(Boolean).join(" ");

function RBCard({
  children, className, glass = false,
}: React.PropsWithChildren<{ className?: string; glass?: boolean }>) {
  return (
    <section
      className={cx(
        styles.rbCard,
        glass && styles.rbCardGlass,
        className
      )}
    >
      {children}
    </section>
  );
}

function RBSectionTitle({ children }: React.PropsWithChildren) {
  return <div className={styles.rbSectionTitle}>{children}</div>;
}

type BtnBase = {
  className?: string;
  size?: "sm" | "md";
  variant?: "primary" | "ghost" | "pill";
  icon?: React.ReactNode;
};

function RBLinkButton({
  children, className, size="md", variant="ghost", icon, ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & BtnBase) {
  return (
    <a
      {...rest}
      className={cx(
        styles.rbBtn,
        size === "sm" ? styles.rbBtnSm : styles.rbBtnMd,
        variant === "primary" && styles.rbBtnPrimary,
        variant === "ghost" && styles.rbBtnGhost,
        variant === "pill" && styles.rbBtnPill,
        className
      )}
      rel={rest.rel ?? "noopener noreferrer"}
      target={rest.target ?? "_blank"}
    >
      {icon && <span className={styles.rbIcon}>{icon}</span>}
      {children}
    </a>
  );
}

function RBBadge({ children }: React.PropsWithChildren) {
  return <span className={styles.rbBadge}>{children}</span>;
}

function LeftProfile({
  author,
}: {
  author?: { name?: string; bio?: string; github?: string; linkedin?: string; website?: string };
}) {
  if (!author) return null;
  const socials = [
    author.github   && { label: "GitHub",   href: author.github,   icon: "🐙" },
    author.linkedin && { label: "LinkedIn", href: author.linkedin, icon: "💼" },
    author.website  && { label: "Website",  href: author.website,  icon: "🌐" },
  ].filter(Boolean) as {label:string; href:string; icon:string}[];

  return (
    <RBCard glass className={styles.leftCard}>
      <RBSectionTitle>
        {author.name ?? "Tác giả"} <RBBadge>blog kỹ thuật</RBBadge>
      </RBSectionTitle>
      <p className={styles.leftBio}>
        {author.bio ?? "Chia sẻ kiến thức & note kỹ thuật."}
      </p>
      {!!socials.length && (
        <div className={styles.rbRow}>
          {socials.map(s => (
            <RBLinkButton key={s.href} href={s.href} variant="pill" icon={s.icon}>
              {s.label}
            </RBLinkButton>
          ))}
        </div>
      )}
    </RBCard>
  );
}

type KeyLinks = {
  repo?: string; demo?: string; docs?: string; slides?: string; issue?: string; website?: string;
};

// Hàm normalizeLinks để xử lý cả string hoặc object
function normalizeLinks(links?: string | KeyLinks): KeyLinks | null {
  if (!links) return null;
  if (typeof links === "string") {
    return { repo: links }; // nếu chỉ truyền string, coi như repo link
  }
  return links;
}

function SideKeyLinks({ links }: { links?: string | KeyLinks }) {
  const L = normalizeLinks(links);
  if (!L) return null;
  const items = [
    L.repo   && { label:"Source Code", icon:"📦", href:L.repo },
    L.demo   && { label:"Live Demo",   icon:"🔗", href:L.demo },
    L.docs   && { label:"Docs",        icon:"📚", href:L.docs },
    L.slides && { label:"Slides",      icon:"🖥", href:L.slides },
    L.issue  && { label:"Issues",      icon:"🐞", href:L.issue },
    L.website&& { label:"Website",     icon:"🌐", href:L.website },
  ].filter(Boolean) as {label:string; icon:string; href:string}[];

  return (
    <RBCard>
      <RBSectionTitle>Tài liệu & liên kết</RBSectionTitle>
      <div className={styles.rbCol}>
        {items.map(it => (
          <RBLinkButton key={it.href} href={it.href} variant="ghost" icon={it.icon}>
            {it.label}
          </RBLinkButton>
        ))}
      </div>
    </RBCard>
  );
}

function SideProjectInfo({
  reading, // phút đọc
  words,   // số từ
  views,
  updatedAt,
  tags = [],
}: {
  reading: number;
  words: number;
  views?: number;
  updatedAt?: string;
  tags?: string[];
}) {
  const updated =
    updatedAt ? new Date(updatedAt).toLocaleDateString() : undefined;

  return (
    <section className={styles.sideCard}>
      <div className={styles.sideCardTitle}>Thông tin bài viết</div>

      <ul className={styles.sideStatList}>
        <li><span>⏱ Thời gian đọc</span><b>{reading} phút</b></li>
        <li><span>✍️ Số từ</span><b>{words.toLocaleString()}</b></li>
        <li><span>👁 Lượt xem</span><b>{(views ?? 0).toLocaleString()}</b></li>
        {updated && (
          <li><span>🗓 Cập nhật</span><b>{updated}</b></li>
        )}
      </ul>

      {tags.length > 0 && (
        <div className={styles.sideTags}>
          {tags.slice(0, 8).map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      )}
    </section>
  );
}





// ===== Main Page =====
export default function ProjectDataPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);


  // nav height -> CSS var for sticky/offset
  useEffect(() => {
    const header = document.querySelector("header") as HTMLElement | null;
    const h = header?.offsetHeight ?? 72;
    document.documentElement.style.setProperty("--nav-h", `${h}px`);
  }, []);

  const toc = useMemo(
    () => (project?.detail ? getTOC(project.detail) : []),
    [project?.detail]
  );

  // reading time
  const reading = useMemo(() => {
    const words = (project?.detail ?? "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    return { words, minutes };
  }, [project?.detail]);

  // progress bar
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const content = document.querySelector(
        `.${styles.content}`
      ) as HTMLElement | null;
      if (!content) return;
      const top = content.offsetTop;
      const total = content.scrollHeight - window.innerHeight;
      const y = Math.max(0, window.scrollY - top);
      setProgress(Math.min(100, Math.max(0, (y / total) * 100)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll spy
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll(
        `.${styles.markdown} h2, .${styles.markdown} h3, .${styles.markdown} h4`
      )
    ) as HTMLElement[];
    if (!headings.length) return;

    const handler = () => {
      const navH =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue("--nav-h")
        ) || 72;
      const threshold = window.scrollY + navH + 12;
      let current = headings[0].id;
      for (const h of headings) {
        if (h.offsetTop <= threshold) current = h.id;
        else break;
      }
      setActiveId(current);
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [project?.detail]);

  // smooth scroll with offset
  const handleTocClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const navH =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--nav-h")
      ) || 72;
    const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - navH - 10);
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // show back-to-top
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // share
  const share = async () => {
    const url = window.location.href;
    const title = project?.title ?? "Project";
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Đã copy liên kết bài viết!");
      }
    } catch {}
  };

  // keyboard shortcuts j/k to jump headings
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const hs = Array.from(
        document.querySelectorAll(
          `.${styles.markdown} h2, .${styles.markdown} h3, .${styles.markdown} h4`
        )
      ) as HTMLElement[];
      if (!hs.length) return;

      const curY = window.scrollY;
      const navH =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue("--nav-h")
        ) || 72;
      const margin = navH + 10;

      const firstAfter = hs.findIndex((h) => h.offsetTop - margin > curY + 2);
      if (e.key === "j") {
        const target = firstAfter === -1 ? hs[hs.length - 1] : hs[firstAfter];
        window.scrollTo({ top: target.offsetTop - margin, behavior: "smooth" });
      } else if (e.key === "k") {
        const before =
          firstAfter <= 0 ? hs[0] : hs[Math.max(0, firstAfter - 1)];
        window.scrollTo({ top: before.offsetTop - margin, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!project) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <p>Không tìm thấy dự án.</p>
          <button
            className={styles.backBtn}
            onClick={() => navigate(-1)}
            type="button"
          >
            Về danh sách
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className={`${styles.container} ${styles.bgDots}`}>
      {/* progress bar */}
      <div className={styles.progress} style={{ width: `${progress}%` }} />

      <div className={styles.wrapper}>
        {/* left sidebar */}
        <aside className={styles.leftSidebar}>
          <LeftProfile author={project.author as any} />
          <SideKeyLinks links={(project as any).links} />
          <SideProjectInfo
            reading={reading.minutes}
            words={reading.words}
            views={project?.views}
            updatedAt={(project as any)?.updatedAt ?? project.date}
            tags={project.tags || []}
          />
        </aside>

        {/* Content */}
        <div className={styles.content}>
          {/* controls */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              className={styles.backBtn}
              onClick={() => navigate(-1)}
              type="button"
            >
              Quay lại
            </button>
            <button
              className={styles.printBtn}
              onClick={() => window.print()}
              type="button"
              title="In PDF"
            >
              In PDF
            </button>
            <button
              className={styles.shareBtn}
              onClick={share}
              type="button"
              title="Chia sẻ"
            >
              Chia sẻ
            </button>
          </div>

          {/* meta */}
          <div className={styles.metaBox}>
            <img
              src={project.author?.avatar || "/default-avatar.png"}
              alt={project.author?.name || "Tác giả ẩn danh"}
              className={styles.avatar}
            />
            <div className={styles.metaText}>
              <div className={styles.metaTop}>
                <span className={styles.metaName}>
                  {project.author?.name || "Tác giả ẩn danh"}
                </span>
                <span className={styles.metaDate}>
                  {project.date
                    ? new Date(project.date).toLocaleDateString()
                    : "N/A"}
                </span>
                <span className={styles.metaViews}>
                  • <span style={{ fontSize: "1.03em" }}>👁</span>{" "}
                  {project?.views ?? 0} lượt xem
                </span>
                <span className={styles.metaRead}> • {reading.minutes} phút đọc</span>
              </div>
              <div className={styles.metaTags}>
                {(project.tags || []).map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <Reactions storageKey={`react-${project.id}`} />
            </div>
          </div>

          <h1 className={styles.detailTitle}>{project.title}</h1>
          <p className={styles.detailDescription}>{project.description}</p>

          {/* Article */}
          {project.detail && (
            <div className={styles.markdown}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeSlug,
                  [rehypeHighlight, { detect: true, ignoreMissing: true }],
                  [rehypeAutolinkHeadings, { behavior: "append", properties: { className: "anchor" }, content: { type:"text", value:" #" } }],
                  [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
                ]}
                components={{ code: CodeBlock, img: MdImage }}
              >
                 {project.detail}
              </ReactMarkdown>
            </div>
          )}

          {/* Prev/Next + Related */}
          <NavPrevNext currentId={project.id} />
          <RelatedProjects currentId={project.id} tags={project.tags || []} />
        </div>

        {/* TOC */}
        <aside className={styles.tocSidebar}>
          <div className={styles.tocHeader}>
            <div className={styles.tocTitle}>MỤC LỤC</div>
          </div>
          <ul className={styles.tocList}>
            {toc.map((item) => (
              <li
                key={item.id}
                className={[
                  styles.tocItem,
                  item.level === 3 ? styles.tocIndent2 : "",
                  item.level === 4 ? styles.tocIndent3 : "",
                  activeId === item.id ? styles.active : "",
                ].join(" ")}
              >
                <a
                  href={`#${item.id}`}
                  className={styles.tocLink}
                  title={item.text}
                  onClick={(e) => handleTocClick(e, item.id)}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {showTop && (
        <button
          className={styles.backToTop}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="Lên đầu trang"
        >
        </button>
      )}
    </div>
  );
}
