import React, { useState, useMemo, useRef } from 'react';
import { Download, Copy, Check } from 'lucide-react';

interface BibtexViewerProps {
  paperId: string;
  title: string;
  bibtex: string;
  isCopied: boolean;
  onCopy: () => void;
  onDownload: () => void;
}

export function BibtexViewer({ bibtex, isCopied, onCopy, onDownload }: BibtexViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if bibtex content is 5 lines or fewer
  const lineCount = useMemo(() => {
    if (!bibtex) return 0;
    return bibtex.trim().split(/\r?\n/).filter(line => line.trim().length > 0).length;
  }, [bibtex]);

  const isShort = lineCount <= 5;

  // Initial height tuned for exactly the first ~5 lines of tiny BibTeX text
  const [height, setHeight] = useState<number>(85);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(85);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = height;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaY = e.clientY - startYRef.current;
    // Cap upper limit strictly to the total content scrollHeight so no blank space is shown
    const maxContentHeight = contentRef.current ? contentRef.current.scrollHeight : 280;
    const minHeight = 70;
    const upperLimit = Math.max(minHeight, maxContentHeight);
    const newHeight = Math.max(minHeight, Math.min(upperLimit, startHeightRef.current + deltaY));
    setHeight(newHeight);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div className="bg-zinc-900 text-zinc-100 rounded-xl mt-2 text-xs font-mono relative animate-fadeIn mx-3 sm:mx-4 mb-4 border border-zinc-800 shadow-xs overflow-hidden flex flex-col">
      {/* Semi-transparent white action buttons sized identically to publication action buttons */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
        <button
          type="button"
          onClick={onDownload}
          className="bg-white/80 hover:bg-white/95 text-zinc-900 hover:text-black px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg border border-white/40 hover:border-white shadow-xs backdrop-blur-xs transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer text-xs font-sans font-semibold active:scale-95 shrink-0"
          title="Download .bib file"
        >
          <Download className="w-3.5 h-3.5 text-zinc-800 shrink-0" />
          <span>Download</span>
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="bg-white/80 hover:bg-white/95 text-zinc-900 hover:text-black px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg border border-white/40 hover:border-white shadow-xs backdrop-blur-xs transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer text-xs font-sans font-semibold active:scale-95 shrink-0"
          title="Copy BibTeX citation"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-emerald-700 font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-800 shrink-0" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Container: auto height if <=5 lines, or resizable height if >5 lines */}
      <div
        ref={contentRef}
        style={isShort ? undefined : { height: `${height}px` }}
        className={`p-3 pt-2 overflow-x-hidden select-text ${isShort ? 'h-auto' : 'overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700'}`}
      >
        <pre className="text-[9.5px] font-mono text-zinc-400 whitespace-pre-wrap break-all sm:break-words leading-relaxed">
          {bibtex}
        </pre>
      </div>

      {/* Slim drag-down bar shown ONLY when content exceeds 5 lines */}
      {!isShort && (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          title="Drag down to expand"
          className="w-full bg-zinc-950 hover:bg-zinc-800 border-t border-zinc-800/80 py-1 flex items-center justify-center cursor-row-resize select-none transition-colors group touch-none"
        >
          <div className="w-8 h-1 rounded-full bg-zinc-600 group-hover:bg-zinc-300 transition-colors" />
        </div>
      )}
    </div>
  );
}

export default BibtexViewer;
