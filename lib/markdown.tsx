import { Separator } from '@/components/ui/separator';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({
  content,
  className = '',
}: MarkdownContentProps) {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-8 mb-6 font-bold text-4xl text-foreground first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-8 mb-4 font-semibold text-3xl text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 mb-3 font-semibold text-2xl text-foreground">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-4 mb-2 font-semibold text-foreground text-xl">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-muted-foreground leading-relaxed">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-2 pl-6">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-2 pl-6">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-muted-foreground">{children}</li>
          ),
          hr: () => <Separator className="my-8" />,
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-border border-l-4 pl-6 text-muted-foreground italic">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="mb-4 overflow-x-auto rounded-lg bg-muted p-4">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Utility function to read markdown file content
export async function readMarkdownFile(filePath: string): Promise<string> {
  const fs = await import('node:fs');
  return fs.readFileSync(filePath, 'utf8');
}
