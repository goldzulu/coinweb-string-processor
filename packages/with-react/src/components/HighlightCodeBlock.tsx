import hljs from 'highlight.js';
import React from 'react';

type HighlighterProps = {
  content: string;
  language?: string;
} & { style?: React.CSSProperties };

export default function HighlightCodeBlock({ content, language, ...rest }: HighlighterProps): React.JSX.Element {
  const highlighted = language ? hljs.highlight(language, content) : hljs.highlightAuto(content);

  return (
    <pre className="hljs" {...rest}>
      <code dangerouslySetInnerHTML={{ __html: highlighted.value }} />
    </pre>
  );
}
