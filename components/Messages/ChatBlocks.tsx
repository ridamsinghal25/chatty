import { memo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Markdown from "react-markdown";

interface ChatBlockProps {
  block: {
    type: "code" | "text";
    value: string;
    lang?: string;
  };
}

export const MemoizedChatBlock = memo(
  ({ block }: ChatBlockProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(block.value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    };

    if (block.type === "code") {
      return (
        <div className="relative my-2 group">
          <p className="absolute top-2 left-2">{block.lang || "javascript"}</p>

          <SyntaxHighlighter
            language={block.lang || "javascript"}
            style={coldarkDark}
            customStyle={{
              borderRadius: "0.5rem",
              fontSize: "0.9rem",
              padding: "1rem",
              paddingTop: "3.0rem",
              backgroundColor: "#171717",
            }}
          >
            {block.value}
          </SyntaxHighlighter>

          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      );
    }

    return (
      <div className="text-base leading-relaxed my-1 whitespace-pre-wrap">
        <Markdown>{block.value.replace(/\n{2,}/g, "\n")}</Markdown>
      </div>
    );
  },
  (prev, next) => prev.block.value === next.block.value
);

MemoizedChatBlock.displayName = "MemoizedChatBlock";
