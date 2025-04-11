import { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export const COMPONENTS: Components = {
  img: ({ src, alt }) =>
    src ? (
      <img src={src} alt={alt || "Image"} className="rounded-lg mx-auto" />
    ) : null,
  table: ({ ...props }) => (
    <table
      className="table-auto border-collapse border border-gray-400 dark:border-zinc-700"
      {...props}
    />
  ),
  th: ({ ...props }) => (
    <th
      className="border border-gray-300 px-4 py-2 bg-gray-100 dark:bg-zinc-800 dark:border-zinc-700"
      {...props}
    />
  ),
  td: ({ ...props }) => (
    <td
      className="border border-gray-300 px-4 py-2 dark:border-zinc-700"
      {...props}
    />
  ),
  code(props) {
    const { children, className, ...rest } = props;
    const match = /language-(\w+)/.exec(className || "");
    return match ? (
      <SyntaxHighlighter pretag="div" language={match[1]} style={vscDarkPlus}>
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code
        className="bg-gray-100 dark:bg-zinc-800 text-zinc-100 rounded-md px-1 py-0.5 font-mono text-sm"
        {...rest}
      >
        {children}
      </code>
    );
  },
};
