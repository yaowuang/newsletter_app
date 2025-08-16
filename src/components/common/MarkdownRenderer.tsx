import type React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  markdown: string;
  denseMode?: boolean;
  borderColor?: string;
  tableHeaderBg?: string;
  tableHeaderColor?: string;
  tableCellBg?: string;
  linkColor?: string;
  headingFontFamily?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  markdown,
  denseMode = false,
  borderColor = "#ccc",
  tableHeaderBg = "#f5f5f5",
  tableHeaderColor = "inherit",
  tableCellBg = "transparent",
  linkColor = "#0070f3",
  headingFontFamily = "inherit",
}) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      table: (props) => (
        <div className="overflow-x-auto">
          <table
            {...props}
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.875rem",
              backgroundColor: tableCellBg,
            }}
          />
        </div>
      ),
      thead: (props) => <thead {...props} style={{ backgroundColor: tableHeaderBg, color: tableHeaderColor }} />,
      th: (props) => (
        <th
          {...props}
          style={{
            border: `1px solid ${borderColor}`,
            padding: "4px 6px",
            textAlign: "left",
            fontWeight: 600,
            fontFamily: headingFontFamily,
            fontSize: "0.75rem",
            lineHeight: 1.2,
          }}
        />
      ),
      td: (props) => (
        <td
          {...props}
          style={{
            border: `1px solid ${borderColor}`,
            padding: "4px 6px",
            fontSize: "0.75rem",
            lineHeight: 1.25,
            backgroundColor: tableCellBg,
          }}
        />
      ),
      a: (props) => (
        <a
          {...props}
          style={{
            color: linkColor,
            textDecoration: "underline",
          }}
        />
      ),
      ul: (props) => (
        <ul
          {...props}
          style={{
            marginTop: denseMode ? "0.125rem" : "0.25rem",
            marginBottom: denseMode ? "0.125rem" : "0.25rem",
            paddingLeft: "1rem",
            listStyleType: "disc",
          }}
        />
      ),
      ol: (props) => (
        <ol
          {...props}
          style={{
            marginTop: denseMode ? "0.125rem" : "0.25rem",
            marginBottom: denseMode ? "0.125rem" : "0.25rem",
            paddingLeft: "1rem",
            listStyleType: "decimal",
          }}
        />
      ),
      li: (props) => (
        <li
          {...props}
          style={{
            marginTop: denseMode ? "0.05rem" : "0.125rem",
            marginBottom: denseMode ? "0.05rem" : "0.125rem",
            paddingLeft: "0.15rem",
          }}
        />
      ),
      p: (props) => (
        <p
          {...props}
          style={{
            marginTop: denseMode ? "0.25rem" : "0.5rem",
            marginBottom: denseMode ? "0.25rem" : "0.5rem",
          }}
        />
      ),
      hr: (props) => (
        <hr
          {...props}
          style={{
            borderTop: `1px solid ${borderColor}`,
            margin: denseMode ? "0.5rem 0" : "1rem 0",
            width: "100%",
          }}
        />
      ),
    }}
  >
    {markdown}
  </ReactMarkdown>
);
