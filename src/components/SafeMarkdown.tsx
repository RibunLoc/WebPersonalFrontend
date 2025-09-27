// SafeMarkdown.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

export function SafeMarkdown({
  md,
  allowHtml = false,
  components,
  className,
}: {
  md: unknown;
  allowHtml?: boolean;
  components?: any;
  className?: string;
}) {
  const content = typeof md === "string" ? md : "";
  const rehypeList = [
    ...(allowHtml ? [rehypeRaw] : []),
    rehypeSlug,
    [rehypeAutolinkHeadings, {
      behavior: "append",
      properties: { className: "anchor" },
      content: { type: "text", value: " #" },
    }],
    [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
    [rehypeHighlight, { detect: true, ignoreMissing: true }],
  ] as any[];

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={rehypeList}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
