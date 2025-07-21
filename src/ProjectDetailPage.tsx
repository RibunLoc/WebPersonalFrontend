import ReactMarkdown from 'react-markdown';
import projects from './ProjectData';
import styles from './ProjectDetailPage.module.css';
import { useParams } from 'react-router-dom';
import remarkSlug from 'remark-slug';
import { useNavigate } from 'react-router-dom';

// Hàm tạo mục lục
function getTOC(markdown: string) {
  const lines = markdown.split('\n');
  const toc = [];
  for (const line of lines) {
    const match = line.match(/^(#{2,4}) (.+)/);
    if (match) {
      toc.push({
        level: match[1].length,
        text: match[2],
        id: match[2]
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, "")
          .replace(/ /g, "-"),
      });
    }
  }
  return toc;
}

export default function ProjectDataPage() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id );
  const toc = project?.detail ? getTOC(project.detail) : [];
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Content */}
        <div className={styles.content}>
          {/* nút back */}
          <button
            className={styles.backBtn}
            onClick={() => navigate(-1)}
            type="button"
          >
            ← Quay lại dự án
          </button>
          {/* meta box */}
          <div className={styles.metaBox}
          >
            <img
              src={project?.author.avatar || 'public/default-avatar.png'}
              alt={project?.author?.name || 'Tác giả ẩn danh'}
              className={styles.avatar}
              />
            <div className={styles.metaText}>
              <div className={styles.metaTop}>
                <span className={styles.metaName}>
                  {project?.author.name || 'Tác giả ẩn danh'}
                </span>
                <span className={styles.metaDate}>
                  {project?.date ? new Date(project.date).toLocaleDateString() : 'N/A'}
                </span>
                <span className={styles.metaViews}>
                   • <span style={{fontSize: '1.03em'}}>👁</span> {project?.views ?? 0} lượt xem
                </span>
              </div>
              <div className={styles.metaTags}>
                {project?.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <h1 className={styles.detailTitle}>
            {project?.title}
          </h1>
          <p className={styles.detailDescription}>{project?.description}</p>

          {project?.detail && (
            <div className={styles.markdown}>
              <ReactMarkdown remarkPlugins={[remarkSlug as any]}>
                {project.detail}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <aside className={styles.tocSidebar}>
          <div className={styles.tocTitle}>MỤC LỤC</div>
          <ul className={styles.tocList}>
            {toc.map((item) => (
              <li
                key={item.id}
                className={`${styles.tocItem} ${
                  item.level === 3 ? styles.tocIndent2 : ""
                } ${item.level === 4 ? styles.tocIndent3 : ""}`}
              >
                <a href={`#${item.id}`} className={styles.tocLink}>
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>
     </div>
    </div>
  );
}
