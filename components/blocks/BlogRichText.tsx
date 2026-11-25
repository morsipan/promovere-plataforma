import React from 'react';

interface LexicalNode {
  type?: string;
  tag?: string;
  text?: string;
  format?: number | string;
  listType?: 'bullet' | 'number';
  url?: string;
  fields?: {
    url?: string;
    newTab?: boolean;
  };
  children?: LexicalNode[];
}

function renderTextLeaf(node: LexicalNode, key: string): React.ReactNode {
  const text = node.text ?? '';
  if (!text) return null;

  const fmt = typeof node.format === 'number' ? node.format : 0;
  let el: React.ReactNode = text;
  if (fmt & 1) el = <strong key={`${key}-b`} className="font-bold text-[#4d4e4f]">{el}</strong>;
  if (fmt & 2) el = <em key={`${key}-i`}>{el}</em>;
  if (fmt & 8) el = <u key={`${key}-u`}>{el}</u>;
  return <React.Fragment key={key}>{el}</React.Fragment>;
}

function renderInlineChildren(children: LexicalNode[] | undefined, prefix: string): React.ReactNode {
  if (!Array.isArray(children)) return null;

  return children.map((child, idx) => {
    const key = `${prefix}-${idx}`;
    if (child.type === 'text') {
      return renderTextLeaf(child, key);
    }
    if (child.type === 'linebreak') {
      return <br key={key} />;
    }
    if (child.type === 'link' || child.type === 'autolink') {
      const href = child.fields?.url || child.url || '#';
      const isExternal = href.startsWith('http://') || href.startsWith('https://');
      return (
        <a
          key={key}
          href={href}
          target={isExternal || child.fields?.newTab ? '_blank' : undefined}
          rel={isExternal || child.fields?.newTab ? 'noopener noreferrer' : undefined}
          className="text-[#1b87c7] font-semibold underline decoration-[#1b87c7]/40 hover:text-[#3cac59] transition-colors"
        >
          {renderInlineChildren(child.children, key)}
        </a>
      );
    }
    if (Array.isArray(child.children)) {
      return <React.Fragment key={key}>{renderInlineChildren(child.children, key)}</React.Fragment>;
    }
    return null;
  });
}

export interface BlogRichTextProps {
  content: unknown;
  fallbackText?: string | null;
}

export default function BlogRichText({ content, fallbackText }: BlogRichTextProps) {
  const rootChildren: LexicalNode[] =
    typeof content === 'object' &&
    content !== null &&
    'root' in content &&
    Array.isArray((content as any).root?.children)
      ? (content as any).root.children
      : [];

  if (rootChildren.length === 0) {
    if (!fallbackText) return null;
    return (
      <div className="space-y-4 text-base sm:text-lg text-[#4d4e4f]/90 leading-relaxed font-sans">
        <p className="whitespace-pre-line">{fallbackText}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-base sm:text-lg text-[#4d4e4f]/90 leading-relaxed font-sans">
      {rootChildren.map((node, idx) => {
        const key = `block-${idx}`;

        if (node.type === 'heading') {
          const inner = renderInlineChildren(node.children, key);
          if (node.tag === 'h2') {
            return (
              <h2
                key={key}
                className="font-heading text-2xl sm:text-3xl font-bold text-[#4d4e4f] pt-3 leading-snug"
              >
                {inner}
              </h2>
            );
          }
          if (node.tag === 'h3') {
            return (
              <h3
                key={key}
                className="font-heading text-xl sm:text-2xl font-bold text-[#4d4e4f] pt-2 leading-snug"
              >
                {inner}
              </h3>
            );
          }
          return (
            <h4 key={key} className="font-heading text-lg font-bold text-[#4d4e4f] pt-2">
              {inner}
            </h4>
          );
        }

        if (node.type === 'list') {
          const Tag = node.listType === 'number' ? 'ol' : 'ul';
          return (
            <Tag
              key={key}
              className={`pl-6 space-y-2 ${
                node.listType === 'number' ? 'list-decimal' : 'list-disc'
              } marker:text-[#3cac59]`}
            >
              {(node.children || []).map((li, liIdx) => (
                <li key={`${key}-li-${liIdx}`}>
                  {renderInlineChildren(li.children, `${key}-li-${liIdx}`)}
                </li>
              ))}
            </Tag>
          );
        }

        const inner = renderInlineChildren(node.children, key);
        if (!inner) return null;
        return <p key={key}>{inner}</p>;
      })}
    </div>
  );
}
