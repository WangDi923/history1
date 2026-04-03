'use client';

import React from 'react';

interface ScriptDisplayProps {
  content: string;
  title?: string;
}

function parseMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let buffer: string[] = [];
  let elementKey = 0;

  const flushBuffer = () => {
    if (buffer.length > 0) {
      const text = buffer.join('\n').trim();
      if (text) {
        elements.push(
          <p key={`p-${elementKey++}`} className="text-stone-700 mb-4 leading-loose text-justify text-lg font-serif">
            {text}
          </p>
        );
      }
      buffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('# ')) {
      flushBuffer();
      elements.push(
        <div key={`h1-${elementKey++}`} className="text-center mt-10 mb-6">
          <h1 className="text-3xl font-black text-stone-900 tracking-widest inline-block border-b-2 border-[#8b2626] pb-2">
            {line.replace(/^# /, '')}
          </h1>
        </div>
      );
    } else if (line.startsWith('## ')) {
      flushBuffer();
      elements.push(
        <h2 key={`h2-${elementKey++}`} className="text-2xl font-bold text-stone-900 mt-8 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-[#8b2626]"></span>
          {line.replace(/^## /, '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      flushBuffer();
      elements.push(
        <h3 key={`h3-${elementKey++}`} className="text-xl font-bold text-stone-800 mt-6 mb-3">
          {line.replace(/^### /, '')}
        </h3>
      );
    } else if (line.startsWith('#### ')) {
      flushBuffer();
      elements.push(
        <h4 key={`h4-${elementKey++}`} className="text-lg font-semibold text-stone-700 mt-4 mb-2">
          {line.replace(/^#### /, '')}
        </h4>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      flushBuffer();
      const listItems = [];
      let j = 0;
      while (i < lines.length && (lines[i]?.startsWith('- ') || lines[i]?.startsWith('* '))) {
        const currentLine = lines[i];
        listItems.push(
          <li key={`li-${elementKey}-${j++}`} className="text-stone-700 leading-relaxed font-serif relative pl-5">
            <span className="absolute left-0 top-1 text-[#8b2626]">※</span>
            {currentLine.replace(/^[\-\*] /, '')}
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${elementKey++}`} className="list-none text-stone-700 mb-4 space-y-2 mt-2">
          {listItems}
        </ul>
      );
      i--;
    } else if (line.trim() === '') {
      flushBuffer();
    } else {
      buffer.push(line);
    }
  }

  flushBuffer();
  return elements;
}

export function ScriptDisplay({ content, title }: ScriptDisplayProps) {
  return (
    <div className="bg-[#fbf8f1] rounded shadow-[4px_4px_0px_rgba(139,38,38,0.1)] mb-8 relative font-serif mx-auto border-2 border-double border-[#d4c4b7] flex flex-col max-h-[800px]">
      {/* 装饰角印（固定在最外层） */}
      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#8b2626]/30 pointer-events-none z-10"></div>
      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#8b2626]/30 pointer-events-none z-10"></div>
      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#8b2626]/30 pointer-events-none z-10"></div>
      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#8b2626]/30 pointer-events-none z-10"></div>

      {title && (
        <div className="text-center pt-8 pb-4 border-b border-[#d4c4b7] shrink-0 bg-[#fbf8f1] rounded-t relative z-0">
          <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-widest">{title}</h2>
          <div className="w-16 h-1 bg-[#8b2626] mx-auto mt-4 opacity-80"></div>
        </div>
      )}

      {/* 滚动区域 */}
      <div className="overflow-y-auto p-8 md:p-12 relative flex-1 custom-scrollbar">
        <div className="space-y-2 relative">
          {/* 左侧装饰线 */}
          <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-[#8b2626]/0 via-[#8b2626]/20 to-[#8b2626]/0 -ml-4 md:-ml-6 hidden md:block"></div>
          {parseMarkdown(content)}
        </div>
      </div>
    </div>
  );
}
