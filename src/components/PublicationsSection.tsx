import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, BookOpen, Copy, Check, FileText, ChevronDown, ChevronUp, Star, Trash2, Plus, ExternalLink, Edit3, Code, X, Github, Download, GripHorizontal } from 'lucide-react';
import { Paper, Profile } from '../types';

interface BibtexViewerProps {
  paperId: string;
  title: string;
  bibtex: string;
  isCopied: boolean;
  onCopy: () => void;
  onDownload: () => void;
}

function BibtexViewer({ bibtex, isCopied, onCopy, onDownload }: BibtexViewerProps) {
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
      {/* Light-colored action buttons for high visibility and contrast */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
        <button
          type="button"
          onClick={onDownload}
          className="bg-white hover:bg-zinc-100 text-zinc-900 hover:text-black px-2 py-0.5 rounded-lg border border-zinc-200 shadow-xs transition-all flex items-center gap-1 cursor-pointer text-[9.5px] font-sans font-bold active:scale-95"
          title="Download .bib file"
        >
          <Download className="w-3 h-3 text-zinc-700" />
          <span>Download</span>
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="bg-white hover:bg-zinc-100 text-zinc-900 hover:text-black px-2 py-0.5 rounded-lg border border-zinc-200 shadow-xs transition-all flex items-center gap-1 cursor-pointer text-[9.5px] font-sans font-bold active:scale-95"
          title="Copy BibTeX citation"
        >
          {isCopied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-zinc-700" />
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

interface PublicationsSectionProps {
  papers: Paper[];
  profile: Profile;
  isEditing: boolean;
  onUpdatePapers: (updated: Paper[] | ((prev: Paper[]) => Paper[])) => void;
}

export default function PublicationsSection({
  papers,
  profile,
  isEditing,
  onUpdatePapers
}: PublicationsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'journal' | 'conference' | 'workshop' | 'preprint'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);
  const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingPaperId, setEditingPaperId] = useState<string | null>(null);
  const [editPaperForm, setEditPaperForm] = useState<Partial<Paper>>({});
  const [addTeaserError, setAddTeaserError] = useState<string | null>(null);
  const [editTeaserError, setEditTeaserError] = useState<string | null>(null);
  const [selectedZoomImage, setSelectedZoomImage] = useState<string | null>(null);

  const startEditingPaper = (paper: Paper) => {
    setEditingPaperId(paper.id);
    setEditPaperForm({ ...paper });
    setEditTeaserError(null);
  };

  const handleSaveEditPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPaperForm.title || !editPaperForm.authors) {
      alert("Please fill in the title and authors.");
      return;
    }
    onUpdatePapers(prev => prev.map(p => {
      if (p.id === editingPaperId) {
        return {
          ...p,
          ...editPaperForm,
          year: Number(editPaperForm.year) || p.year,
        } as Paper;
      }
      return p;
    }));
    setEditingPaperId(null);
  };

  // Form states for creating a new publication
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPaper, setNewPaper] = useState<Partial<Paper>>({
    title: '',
    authors: '',
    journal: '',
    year: new Date().getFullYear(),
    category: 'conference',
    abstract: '',
    tags: [],
    bibtex: '',
    doi: '',
    link: '#',
    codeUrl: '',
    huggingfaceUrl: '',
    featured: false
  });

  // Unique tags across all papers, sorted by the total number of papers under each tag by descending order
  const allTags = useMemo(() => {
    const tagCounts: { [tag: string]: number } = {};
    papers.forEach(p => {
      (p.tags || []).forEach(t => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    });
    return Object.keys(tagCounts).sort((a, b) => {
      const countDiff = tagCounts[b] - tagCounts[a];
      if (countDiff !== 0) return countDiff;
      return a.localeCompare(b); // Alphabetical fallback
    });
  }, [papers]);

  // Handle updates or edits
  const handleToggleFeatured = (id: string) => {
    onUpdatePapers(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
  };

  const handleDeletePaper = (id: string) => {
    onUpdatePapers(prev => prev.filter(p => p.id !== id));
    setDeletingId(null);
  };

  // Handle client-side teaser image/gif upload and optimization
  const handleImageUpload = (file: File, callback: (base64: string) => void) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) return;

      // Keep GIFs raw to preserve animation
      if (file.type === 'image/gif') {
        callback(result);
        return;
      }

      // Optimize standard images to avoid exceeding LocalStorage limits
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
          callback(compressedBase64);
        } else {
          callback(result);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleAddPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaper.title || !newPaper.authors) {
      alert("Please fill in the title and authors.");
      return;
    }

    // Generate basic bibtex if empty
    const generatedKey = (newPaper.authors.split(',')[0] || 'author').trim().toLowerCase().split(' ').pop() + (newPaper.year || '2026');
    const defaultBib = `@inproceedings{${generatedKey},
  author    = {${newPaper.authors}},
  title     = {${newPaper.title}},
  booktitle = {${newPaper.journal || 'Academic Proceedings'}},
  year      = {${newPaper.year}}
}`;

    const paperToAdd: Paper = {
      id: `pub-${Date.now()}`,
      title: newPaper.title || 'Untitled',
      authors: newPaper.authors || '',
      journal: newPaper.journal || 'Self-published',
      year: Number(newPaper.year) || new Date().getFullYear(),
      category: newPaper.category as Paper['category'] || 'conference',
      abstract: newPaper.abstract || 'Abstract not available.',
      tags: newPaper.tags || [],
      bibtex: newPaper.bibtex || defaultBib,
      doi: newPaper.doi || '',
      featured: !!newPaper.featured,
      link: newPaper.link || '#',
      codeUrl: newPaper.codeUrl || '',
      huggingfaceUrl: newPaper.huggingfaceUrl || newPaper.huggingface || '',
      teaserImage: newPaper.teaserImage
    };

    onUpdatePapers(prev => [paperToAdd, ...prev]);
    setShowAddForm(false);
    setAddTeaserError(null);
    // Reset form
    setNewPaper({
      title: '',
      authors: '',
      journal: '',
      year: new Date().getFullYear(),
      category: 'conference',
      abstract: '',
      tags: [],
      bibtex: '',
      doi: '',
      link: '#',
      codeUrl: '',
      huggingfaceUrl: '',
      featured: false,
      teaserImage: undefined
    });
  };

  // Authors highlighting helper
  const highlightAuthor = (authorsStr: string, ownerName: string) => {
    if (!ownerName) return <span>{authorsStr}</span>;
    // Extract last name or common name formats
    const cleanOwner = ownerName.replace(/^Dr\.\s+/, '').trim();
    const regex = new RegExp(`(${cleanOwner})`, 'gi');
    const parts = authorsStr.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === cleanOwner.toLowerCase() ? (
            <strong key={i} className="text-[#2A2D34] dark:text-zinc-100 font-bold border-b border-[#801428] dark:border-[#7DE2C5]">
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // Copy BibTeX citation helper
  const copyBibtex = (id: string, text: string) => {
    if (!navigator.clipboard) {
      alert("Clipboard copy is not supported in this browser context.");
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Download BibTeX citation helper (.bib file)
  const downloadBibtex = (paperTitle: string, bibtexText: string) => {
    if (!bibtexText) return;
    // Extract cite key if available, otherwise sanitize paper title
    const match = bibtexText.match(/@\w+\s*\{\s*([^,\s]+)/);
    const citeKey = match ? match[1] : null;
    const rawFileName = citeKey || paperTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 30);
    const fileName = `${rawFileName || 'citation'}.bib`;

    const blob = new Blob([bibtexText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter papers
  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      const matchesSearch =
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.journal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = activeCategory === 'all' || paper.category === activeCategory;
      const matchesTag = !selectedTag || (paper.tags || []).includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    }).sort((a, b) => {
      // Always put featured papers on top, otherwise sort by year descending
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.year - a.year;
    });
  }, [papers, searchQuery, activeCategory, selectedTag]);

  return (
    <div id="publications-section" className="mb-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#2A2D34] dark:text-zinc-100">Publications</h2>
          <p className="text-xs text-[#525660] dark:text-zinc-400">Selected peer-reviewed papers and preprints.</p>
        </div>
        <div className="flex gap-2">
          {isEditing && (
            <button
              onClick={() => {
                setShowAddForm(prev => !prev);
                setAddTeaserError(null);
              }}
              className="px-3 py-1.5 bg-[#801428] hover:bg-[#5F0E1D] text-white dark:bg-[#7DE2C5] dark:hover:bg-[#68d0b3] dark:text-zinc-950 rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? "Cancel Adding" : "Add Publication"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Publication Form Modal / Panel */}
      {showAddForm && (
        <form onSubmit={handleAddPaper} className="bg-[#FAF5EB] dark:bg-zinc-900 border border-[#E2D5BE] dark:border-zinc-800 rounded-2xl p-5 mb-6 shadow-inner animate-fadeIn space-y-3">
          <h3 className="font-bold text-[#2A2D34] dark:text-zinc-200 text-sm border-b border-[#E2D5BE] dark:border-zinc-800 pb-1.5">Add New Scholarly Publication</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-1">Paper Title *</label>
              <input
                type="text"
                required
                value={newPaper.title}
                onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
                className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 text-[#2A2D34] dark:text-zinc-100 rounded-lg p-2 text-xs outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5]"
                placeholder="Co-Authoring with Intention: Directing Multi-Agent AI Writing Workflows..."
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-1">Authors (Comma separated) *</label>
              <input
                type="text"
                required
                value={newPaper.authors}
                onChange={(e) => setNewPaper({ ...newPaper, authors: e.target.value })}
                className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 text-[#2A2D34] dark:text-zinc-100 rounded-lg p-2 text-xs outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5]"
                placeholder="Evelyn Chen, Sarah Jenkins"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-1">Journal / Venue Name</label>
              <input
                type="text"
                value={newPaper.journal}
                onChange={(e) => setNewPaper({ ...newPaper, journal: e.target.value })}
                className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 text-[#2A2D34] dark:text-zinc-100 rounded-lg p-2 text-xs outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5]"
                placeholder="ACM CHI Conference (CHI 2026)"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-1">Publication Year</label>
              <input
                type="number"
                value={newPaper.year}
                onChange={(e) => setNewPaper({ ...newPaper, year: Number(e.target.value) })}
                className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 text-[#2A2D34] dark:text-zinc-100 rounded-lg p-2 text-xs outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-1">Publication Category</label>
              <select
                value={newPaper.category}
                onChange={(e) => setNewPaper({ ...newPaper, category: e.target.value as Paper['category'] })}
                className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 text-[#2A2D34] dark:text-zinc-100 rounded-lg p-2 text-xs outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5]"
              >
                <option value="conference">Conference Proceeding</option>
                <option value="journal">Journal Paper</option>
                <option value="workshop">Workshop Paper</option>
                <option value="preprint">Preprint/Draft</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-1">DOI Link</label>
              <input
                type="text"
                value={newPaper.doi}
                onChange={(e) => setNewPaper({ ...newPaper, doi: e.target.value })}
                className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 text-[#2A2D34] dark:text-zinc-100 rounded-lg p-2 text-xs outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5]"
                placeholder="10.1145/3613904"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-1">Tags</label>
              
              {/* Selected tags */}
              <div className="flex flex-wrap gap-1 mb-2">
                {(newPaper.tags || []).map(tag => (
                  <span key={tag} className="text-[10px] bg-[#801428]/10 text-[#801428] dark:bg-teal-950/60 dark:text-[#7DE2C5] px-2 py-0.5 rounded-full border border-[#801428]/30 dark:border-teal-800 flex items-center gap-1 font-['Inter',sans-serif]">
                    {tag}
                    <button
                      type="button"
                      onClick={() => setNewPaper({ ...newPaper, tags: (newPaper.tags || []).filter(t => t !== tag) })}
                      className="text-[#801428] hover:text-[#5F0E1D] dark:text-[#7DE2C5] font-bold ml-0.5 cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                {(newPaper.tags || []).length === 0 && (
                  <span className="text-[#525660] dark:text-zinc-400 text-xs italic">No tags selected.</span>
                )}
              </div>

              {/* Tag creation input */}
              <div className="flex gap-1 mb-2">
                <input
                  type="text"
                  id="new-tag-input"
                  placeholder="Create new tag"
                  className="flex-1 bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 text-[#2A2D34] dark:text-zinc-100 rounded-lg p-1 text-xs outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val && !(newPaper.tags || []).includes(val)) {
                        setNewPaper({ ...newPaper, tags: [...(newPaper.tags || []), val] });
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('new-tag-input') as HTMLInputElement;
                    if (input) {
                      const val = input.value.trim();
                      if (val && !(newPaper.tags || []).includes(val)) {
                        setNewPaper({ ...newPaper, tags: [...(newPaper.tags || []), val] });
                        input.value = '';
                      }
                    }
                  }}
                  className="px-2 py-1 bg-[#801428] text-white rounded-lg text-xs hover:bg-[#5F0E1D] cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* Selection menu of existing tags */}
              {allTags.length > 0 && (
                <div>
                  <label className="text-[9px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-1">Select from existing tags (delete removes tag from all papers):</label>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto border border-[#E2D5BE] dark:border-zinc-700 p-1.5 rounded-lg bg-[#F3E8D3] dark:bg-zinc-800">
                    {allTags.map(tag => {
                      const isSelected = (newPaper.tags || []).includes(tag);
                      return (
                        <div
                          key={tag}
                          className="inline-flex items-center gap-1.5 bg-[#FAF5EB] dark:bg-zinc-900 hover:bg-[#F3E8D3] rounded-lg border border-[#E2D5BE] dark:border-zinc-700 pl-2 pr-1 py-0.5 transition-colors"
                        >
                          <button
                            type="button"
                            disabled={isSelected}
                            onClick={() => setNewPaper({ ...newPaper, tags: [...(newPaper.tags || []), tag] })}
                            className={`text-[10px] font-sans font-medium transition-colors ${
                              isSelected
                                ? 'text-zinc-400 cursor-not-allowed'
                                : 'text-[#2A2D34] dark:text-zinc-300 hover:text-[#801428] dark:hover:text-[#7DE2C5] cursor-pointer'
                            }`}
                          >
                            {tag}
                          </button>
                          <button
                            type="button"
                            title={`Delete "${tag}" from all papers`}
                            onClick={() => {
                              onUpdatePapers(prev => prev.map(p => ({
                                ...p,
                                tags: (p.tags || []).filter(t => t !== tag)
                              })));
                              setNewPaper(prev => ({
                                ...prev,
                                tags: (prev.tags || []).filter(t => t !== tag)
                              }));
                              if (editPaperForm) {
                                setEditPaperForm(prev => ({
                                  ...prev,
                                  tags: (prev.tags || []).filter(t => t !== tag)
                                }));
                              }
                              if (selectedTag === tag) {
                                setSelectedTag(null);
                              }
                            }}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-0.5 rounded cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-1">Paper URL / Link</label>
              <input
                type="text"
                value={newPaper.link || ''}
                onChange={(e) => setNewPaper({ ...newPaper, link: e.target.value })}
                className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 text-[#2A2D34] dark:text-zinc-100 rounded-lg p-2 text-xs outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5]"
                placeholder="https://example.com/paper.pdf or #"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-1">Code Repository URL</label>
              <input
                type="text"
                value={newPaper.codeUrl || ''}
                onChange={(e) => setNewPaper({ ...newPaper, codeUrl: e.target.value })}
                className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 text-[#2A2D34] dark:text-zinc-100 rounded-lg p-2 text-xs outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5]"
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-1">Hugging Face URL</label>
              <input
                type="text"
                value={newPaper.huggingfaceUrl || newPaper.huggingface || ''}
                onChange={(e) => setNewPaper({ ...newPaper, huggingfaceUrl: e.target.value })}
                className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 text-[#2A2D34] dark:text-zinc-100 rounded-lg p-2 text-xs outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5]"
                placeholder="https://huggingface.co/..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-1">Abstract</label>
              <textarea
                value={newPaper.abstract}
                onChange={(e) => setNewPaper({ ...newPaper, abstract: e.target.value })}
                rows={3}
                className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 text-[#2A2D34] dark:text-zinc-100 rounded-lg p-2 text-xs outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5]"
                placeholder="Abstract descriptive statement..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-1">BibTeX Entry (Optional)</label>
              <textarea
                value={newPaper.bibtex}
                onChange={(e) => setNewPaper({ ...newPaper, bibtex: e.target.value })}
                rows={3}
                className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 text-[#2A2D34] dark:text-zinc-100 rounded-lg p-2 text-xs font-mono outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5]"
                placeholder="@inproceedings{...}"
              />
            </div>

            <div className="md:col-span-2 border-t border-[#E2D5BE] dark:border-zinc-800 pt-3 space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is-featured"
                  checked={newPaper.featured}
                  onChange={(e) => setNewPaper({ ...newPaper, featured: e.target.checked })}
                  className="accent-[#801428]"
                />
                <label htmlFor="is-featured" className="text-xs font-semibold text-[#2A2D34] dark:text-zinc-300 cursor-pointer select-none">
                  Highlight as Featured Publication
                </label>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-1">Teaser Image / GIF</label>
                <div className="flex flex-col gap-3 bg-[#F3E8D3] dark:bg-zinc-800 p-2.5 border border-[#E2D5BE] dark:border-zinc-700 rounded-lg">
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                      type="file"
                      id="add-teaser-input"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const limit = 1 * 1024 * 1024; // 1.0 MB
                          if (file.size > limit) {
                            setAddTeaserError(`The uploaded teaser size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the quota of 1.0 MB. Please upload a smaller image or GIF to preserve storage.`);
                            return;
                          }
                          setAddTeaserError(null);
                          handleImageUpload(file, (base64) => {
                            setNewPaper(prev => ({ ...prev, teaserImage: base64 }));
                          });
                        }
                      }}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => document.getElementById('add-teaser-input')?.click()}
                        className="px-3 py-1.5 bg-[#FAF5EB] dark:bg-zinc-900 hover:bg-[#F3E8D3] border border-[#E2D5BE] dark:border-zinc-700 rounded-lg text-xs text-[#2A2D34] dark:text-zinc-200 font-semibold cursor-pointer transition-colors whitespace-nowrap"
                      >
                        Upload Teaser (Image/GIF)
                      </button>
                      <span className="text-[10px] text-[#525660] dark:text-zinc-400 font-medium">
                        (Max size: 1.0 MB)
                      </span>
                    </div>

                    {newPaper.teaserImage ? (
                      <div className="flex items-center gap-2">
                        <div className="relative group/teaser">
                          <img
                            src={newPaper.teaserImage}
                            alt="Teaser preview"
                            className="h-12 w-auto max-w-[120px] object-contain rounded-lg border border-[#E2D5BE] shadow-xs"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => setNewPaper({ ...newPaper, teaserImage: undefined })}
                            className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 text-[8px] hover:bg-red-700 transition-colors cursor-pointer w-4 h-4 flex items-center justify-center font-bold"
                            title="Remove teaser"
                          >
                            &times;
                          </button>
                        </div>
                        <span className="text-[10px] text-[#525660] dark:text-zinc-400">Uploaded & optimized</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#525660] dark:text-zinc-400">No teaser uploaded. It will be resized and displayed to the right side of the paper entry.</span>
                    )}
                  </div>

                  {addTeaserError && (
                    <div className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg p-2 animate-fadeIn">
                      ⚠️ {addTeaserError}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1.5 border-t border-[#E2D5BE] dark:border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setAddTeaserError(null);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-[#525660] hover:bg-[#F3E8D3] dark:text-zinc-400 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#801428] hover:bg-[#5F0E1D] dark:text-zinc-950 dark:bg-[#7DE2C5] dark:hover:bg-[#68d0b3] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Save Publication
            </button>
          </div>
        </form>
      )}

      {/* Filter Toolbar */}
      <div className="bg-[#FAF5EB] dark:bg-zinc-900 border border-[#E2D5BE] dark:border-zinc-800 rounded-2xl p-4 shadow-xs mb-4 space-y-3">
        {/* Search and Category Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Live Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#801428] dark:text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search papers by keywords, titles, co-authors, venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 rounded-xl outline-none focus:bg-[#FAF5EB] dark:focus:bg-zinc-900 focus:border-[#801428] dark:focus:border-[#7DE2C5] transition-all text-[#2A2D34] dark:text-zinc-100"
            />
          </div>

          {/* Category Quick Tabs */}
          <div className="flex bg-[#F3E8D3] dark:bg-zinc-800/90 p-1 rounded-xl gap-1 border border-[#E2D5BE]/80 dark:border-zinc-700/80 relative">
            {(['all', 'journal', 'conference', 'preprint'] as const).map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`group relative px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'text-[#801428] dark:text-[#7DE2C5] font-bold'
                      : 'text-[#525660] dark:text-zinc-400 hover:text-[#801428] dark:hover:text-[#7DE2C5]'
                  }`}
                >
                  {isActive ? (
                    <motion.div
                      layoutId="publications-filter-active-pill"
                      className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-lg border border-[#E2D5BE]/60 dark:border-zinc-700 shadow-xs"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  ) : (
                    /* Bright, compact soft blurry spotlight glow directly behind text */
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 m-auto w-3/4 h-3/4 rounded-full bg-white dark:bg-zinc-600/90 blur-[5px] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-[0_0_10px_2px_rgba(255,255,255,1)] dark:shadow-[0_0_10px_2px_rgba(125,226,197,0.4)]"
                    />
                  )}
                  <span className="relative z-10">
                    {cat === 'all' ? 'All' : cat + 's'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Tag Filters Cloud */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-[#E2D5BE] dark:border-zinc-800 pt-3">
            <span className="text-[10px] font-bold text-[#525660] dark:text-zinc-500 uppercase tracking-widest mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Topic:</span>
            </span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`group relative overflow-hidden px-2.5 py-0.5 text-xs rounded-lg font-medium transition-all duration-200 cursor-pointer font-['Inter',sans-serif] ${
                !selectedTag
                  ? 'bg-[#801428]/10 text-[#801428] border border-[#801428]/30 dark:bg-teal-950/60 dark:text-[#7DE2C5] dark:border-teal-800 shadow-xs'
                  : 'bg-[#F7F1E6] dark:bg-zinc-800/90 text-[#525660] dark:text-zinc-300 border border-[#E5DAC5] dark:border-zinc-700 hover:text-[#801428] dark:hover:text-[#7DE2C5]'
              }`}
            >
              {selectedTag && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-[inherit] bg-white/90 dark:bg-zinc-700/80 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-[inset_0_0_4px_rgba(255,255,255,0.8),0_0_8px_rgba(255,255,255,0.95)] dark:shadow-[inset_0_0_4px_rgba(125,226,197,0.3),0_0_8px_rgba(125,226,197,0.35)]"
                />
              )}
              <span className="relative z-10">All Topics</span>
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`group relative overflow-hidden px-2.5 py-0.5 text-xs rounded-lg font-medium transition-all duration-200 cursor-pointer font-['Inter',sans-serif] ${
                  selectedTag === tag
                    ? 'bg-[#801428]/10 text-[#801428] border border-[#801428]/30 dark:bg-teal-950/60 dark:text-[#7DE2C5] dark:border-teal-800 shadow-xs'
                    : 'bg-[#F7F1E6] dark:bg-zinc-800/90 text-[#525660] dark:text-zinc-300 border border-[#E5DAC5] dark:border-zinc-700 hover:text-[#801428] dark:hover:text-[#7DE2C5]'
                }`}
              >
                {selectedTag !== tag && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[inherit] bg-white/90 dark:bg-zinc-700/80 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-[inset_0_0_4px_rgba(255,255,255,0.8),0_0_8px_rgba(255,255,255,0.95)] dark:shadow-[inset_0_0_4px_rgba(125,226,197,0.3),0_0_8px_rgba(125,226,197,0.35)]"
                  />
                )}
                <span className="relative z-10">{tag}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Publications Listing Grid */}
      <div className="space-y-3">
        {filteredPapers.length === 0 ? (
          <div className="bg-[#FAF5EB] dark:bg-zinc-900 border border-[#E2D5BE] dark:border-zinc-800 rounded-2xl p-10 text-center shadow-xs">
            <BookOpen className="w-6 h-6 text-[#801428]/50 dark:text-zinc-600 mx-auto mb-2" />
            <p className="text-[#525660] dark:text-zinc-400 text-xs">No publications match your filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setSelectedTag(null);
              }}
              className="mt-2 text-xs font-bold text-[#801428] dark:text-[#7DE2C5] hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filteredPapers.map((paper) => {
            const isAbstractExpanded = expandedAbstractId === paper.id;
            const isBibtexExpanded = expandedBibtexId === paper.id;
            const isCopied = copiedId === paper.id;
            const paperLinkToUse = paper.link && paper.link !== '#' ? paper.link : (paper.doi ? `https://doi.org/${paper.doi}` : '#');
            const hfLink = (paper.huggingfaceUrl || paper.huggingface || '').trim();

            return (
              <div
                key={paper.id}
                className="flex gap-3 items-start relative group"
              >
                {/* Admin Actions column outside of the card, aligned to the left edge */}
                {isEditing && (
                  <div className="flex flex-col gap-2 pt-3 shrink-0 items-center justify-start">
                    {deletingId === paper.id ? (
                      <div className="flex flex-col items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg p-1.5 animate-fadeIn">
                        <span className="text-[9px] font-bold text-red-700">Delete?</span>
                        <button
                          type="button"
                          onClick={() => handleDeletePaper(paper.id)}
                          className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-[9px] font-bold transition-colors cursor-pointer"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(null)}
                          className="px-2 py-0.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 rounded-md text-[9px] font-bold transition-colors cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5 items-center">
                        <button
                          type="button"
                          onClick={() => startEditingPaper(paper)}
                          className="p-1.5 bg-white border border-zinc-200 text-zinc-500 hover:text-[#7DE2C5] hover:bg-teal-50 hover:border-teal-200 rounded-lg transition-colors cursor-pointer shadow-xs"
                          title="Edit publication"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(paper.id)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer shadow-xs ${
                            paper.featured ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white border-zinc-200 text-zinc-400 hover:text-amber-500 hover:bg-amber-50/50'
                          }`}
                          title={paper.featured ? "Unmark from featured list" : "Mark as featured"}
                        >
                          <Star className={`w-3.5 h-3.5 ${paper.featured ? 'fill-amber-500' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(paper.id)}
                          className="p-1.5 bg-white border border-zinc-200 text-zinc-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg transition-colors cursor-pointer shadow-xs"
                          title="Delete publication"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Main Paper Card */}
                <div
                  className={`flex-1 ${
                    paper.featured
                      ? 'border-[#801428]/50 dark:border-teal-800/80 bg-[#F3E8D3]/60 hover:bg-[#F3E8D3]/85 dark:bg-teal-950/20 dark:hover:bg-teal-950/35 hover:border-[#801428]/70 dark:hover:border-teal-700'
                      : 'bg-[#FAF5EB] hover:bg-[#FDFBF7] dark:bg-zinc-900 dark:hover:bg-[#1f1f23] border-[#E2D5BE] dark:border-zinc-800 hover:border-[#801428]/40 dark:hover:border-zinc-700'
                  } border rounded-2xl hover:shadow-xs transition-all duration-300 relative overflow-visible`}
                >
                  {editingPaperId === paper.id ? (
                    <form onSubmit={handleSaveEditPaper} className="space-y-3 animate-fadeIn p-4">
                    <h4 className="text-xs font-bold text-[#2A2D34] dark:text-zinc-200 border-b border-[#E2D5BE] dark:border-zinc-800 pb-1">Edit Publication</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <label className="text-[9px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-0.5">Paper Title *</label>
                        <input
                          type="text"
                          required
                          value={editPaperForm.title || ''}
                          onChange={(e) => setEditPaperForm({ ...editPaperForm, title: e.target.value })}
                          className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 focus:border-[#801428] dark:focus:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100 rounded-lg p-1 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-0.5">Authors *</label>
                        <input
                          type="text"
                          required
                          value={editPaperForm.authors || ''}
                          onChange={(e) => setEditPaperForm({ ...editPaperForm, authors: e.target.value })}
                          className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 focus:border-[#801428] dark:focus:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100 rounded-lg p-1 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-0.5">Journal / Venue Name</label>
                        <input
                          type="text"
                          value={editPaperForm.journal || ''}
                          onChange={(e) => setEditPaperForm({ ...editPaperForm, journal: e.target.value })}
                          className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 focus:border-[#801428] dark:focus:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100 rounded-lg p-1 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-0.5">Publication Year</label>
                        <input
                          type="number"
                          value={editPaperForm.year || ''}
                          onChange={(e) => setEditPaperForm({ ...editPaperForm, year: Number(e.target.value) })}
                          className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 focus:border-[#801428] dark:focus:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100 rounded-lg p-1 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-0.5">Category</label>
                        <select
                          value={editPaperForm.category || 'conference'}
                          onChange={(e) => setEditPaperForm({ ...editPaperForm, category: e.target.value as Paper['category'] })}
                          className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 focus:border-[#801428] dark:focus:border-[#7DE2C5] rounded-lg p-1 text-xs outline-none text-[#2A2D34] dark:text-zinc-100"
                        >
                          <option value="conference">Conference Proceeding</option>
                          <option value="journal">Journal Paper</option>
                          <option value="workshop">Workshop Paper</option>
                          <option value="preprint">Preprint/Draft</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-0.5">DOI Link</label>
                        <input
                          type="text"
                          value={editPaperForm.doi || ''}
                          onChange={(e) => setEditPaperForm({ ...editPaperForm, doi: e.target.value })}
                          className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 focus:border-[#801428] dark:focus:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100 rounded-lg p-1 text-xs outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[9px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-1">Tags</label>
                        
                        {/* Selected tags */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {(editPaperForm.tags || []).map(tag => (
                            <span key={tag} className="text-[10px] bg-[#801428]/10 text-[#801428] px-2 py-0.5 rounded-full border border-[#801428]/30 flex items-center gap-1 dark:bg-teal-950/60 dark:text-[#7DE2C5] dark:border-teal-800 font-['Inter',sans-serif]">
                              {tag}
                              <button
                                type="button"
                                onClick={() => setEditPaperForm({ ...editPaperForm, tags: (editPaperForm.tags || []).filter(t => t !== tag) })}
                                className="text-[#801428] hover:text-[#5F0E1D] dark:text-[#7DE2C5] dark:hover:text-[#68d0b3] font-bold ml-0.5 cursor-pointer"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                          {(editPaperForm.tags || []).length === 0 && (
                            <span className="text-[#525660] dark:text-zinc-400 text-xs italic">No tags selected.</span>
                          )}
                        </div>

                        {/* Tag creation input */}
                        <div className="flex gap-1 mb-2">
                          <input
                            type="text"
                            id="edit-tag-input"
                            placeholder="Create new tag"
                            className="flex-1 bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 text-[#2A2D34] dark:text-zinc-100 rounded-lg p-1 text-xs outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5]"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const val = e.currentTarget.value.trim();
                                if (val && !(editPaperForm.tags || []).includes(val)) {
                                  setEditPaperForm({ ...editPaperForm, tags: [...(editPaperForm.tags || []), val] });
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById('edit-tag-input') as HTMLInputElement;
                              if (input) {
                                const val = input.value.trim();
                                if (val && !(editPaperForm.tags || []).includes(val)) {
                                  setEditPaperForm({ ...editPaperForm, tags: [...(editPaperForm.tags || []), val] });
                                  input.value = '';
                                }
                              }
                            }}
                            className="px-2 py-1 bg-[#801428] text-white rounded-lg text-xs hover:bg-[#5F0E1D] cursor-pointer"
                          >
                            Add
                          </button>
                        </div>

                        {/* Selection menu of existing tags */}
                        {allTags.length > 0 && (
                          <div>
                            <label className="text-[9px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-1">Select from existing tags (delete removes tag from all papers):</label>
                            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto border border-[#E2D5BE] dark:border-zinc-700 p-1.5 rounded-lg bg-[#F3E8D3] dark:bg-zinc-800">
                              {allTags.map(tag => {
                                const isSelected = (editPaperForm.tags || []).includes(tag);
                                return (
                                  <div
                                    key={tag}
                                    className="inline-flex items-center gap-1.5 bg-[#FAF5EB] dark:bg-zinc-900 hover:bg-[#F3E8D3] dark:hover:bg-zinc-800 rounded-lg border border-[#E2D5BE] dark:border-zinc-700 pl-2 pr-1 py-0.5 transition-colors"
                                  >
                                    <button
                                      type="button"
                                      disabled={isSelected}
                                      onClick={() => setEditPaperForm({ ...editPaperForm, tags: [...(editPaperForm.tags || []), tag] })}
                                      className={`text-[10px] font-sans font-medium transition-colors ${
                                        isSelected
                                          ? 'text-zinc-400 cursor-not-allowed'
                                          : 'text-[#2A2D34] hover:text-[#801428] dark:text-zinc-200 dark:hover:text-[#7DE2C5] cursor-pointer'
                                      }`}
                                    >
                                      {tag}
                                    </button>
                                    <button
                                      type="button"
                                      title={`Delete "${tag}" from all papers`}
                                      onClick={() => {
                                        onUpdatePapers(prev => prev.map(p => ({
                                          ...p,
                                          tags: (p.tags || []).filter(t => t !== tag)
                                        })));
                                        setNewPaper(prev => ({
                                          ...prev,
                                          tags: (prev.tags || []).filter(t => t !== tag)
                                        }));
                                        setEditPaperForm(prev => ({
                                          ...prev,
                                          tags: (prev.tags || []).filter(t => t !== tag)
                                        }));
                                        if (selectedTag === tag) {
                                          setSelectedTag(null);
                                        }
                                      }}
                                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-0.5 rounded cursor-pointer transition-colors"
                                    >
                                      <Trash2 className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-0.5">Paper URL / Link</label>
                        <input
                          type="text"
                          value={editPaperForm.link || ''}
                          onChange={(e) => setEditPaperForm({ ...editPaperForm, link: e.target.value })}
                          className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 focus:border-[#801428] dark:focus:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100 rounded-lg p-1 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-0.5">Code Repository URL</label>
                        <input
                          type="text"
                          value={editPaperForm.codeUrl || ''}
                          onChange={(e) => setEditPaperForm({ ...editPaperForm, codeUrl: e.target.value })}
                          className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 focus:border-[#801428] dark:focus:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100 rounded-lg p-1 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-0.5">Hugging Face URL</label>
                        <input
                          type="text"
                          value={editPaperForm.huggingfaceUrl || editPaperForm.huggingface || ''}
                          onChange={(e) => setEditPaperForm({ ...editPaperForm, huggingfaceUrl: e.target.value, huggingface: e.target.value })}
                          className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 focus:border-[#801428] dark:focus:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100 rounded-lg p-1 text-xs outline-none"
                          placeholder="https://huggingface.co/..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[9px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-0.5">Abstract</label>
                        <textarea
                          value={editPaperForm.abstract || ''}
                          onChange={(e) => setEditPaperForm({ ...editPaperForm, abstract: e.target.value })}
                          rows={2}
                          className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 focus:border-[#801428] dark:focus:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100 rounded-lg p-1.5 text-xs outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[9px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-0.5">BibTeX Entry</label>
                        <textarea
                          value={editPaperForm.bibtex || ''}
                          onChange={(e) => setEditPaperForm({ ...editPaperForm, bibtex: e.target.value })}
                          rows={2}
                          className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 focus:border-[#801428] dark:focus:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100 rounded-lg p-1.5 text-xs font-mono outline-none"
                        />
                      </div>

                      <div className="md:col-span-2 border-t border-[#E2D5BE] dark:border-zinc-800 pt-3">
                        <label className="text-[9px] font-bold text-[#525660] dark:text-zinc-400 uppercase block mb-1">Teaser Image / GIF</label>
                        <div className="flex flex-col gap-2.5 bg-[#F3E8D3] dark:bg-zinc-800 p-2 border border-[#E2D5BE] dark:border-zinc-700 rounded-lg">
                          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <input
                              type="file"
                              id={`edit-teaser-input-${paper.id}`}
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const limit = 1 * 1024 * 1024; // 1.0 MB
                                  if (file.size > limit) {
                                    setEditTeaserError(`The uploaded teaser size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the quota of 1.0 MB. Please upload a smaller image or GIF to preserve storage.`);
                                    return;
                                  }
                                  setEditTeaserError(null);
                                  handleImageUpload(file, (base64) => {
                                    setEditPaperForm(prev => ({ ...prev, teaserImage: base64 }));
                                  });
                                }
                              }}
                              className="hidden"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => document.getElementById(`edit-teaser-input-${paper.id}`)?.click()}
                                className="px-2.5 py-1 bg-[#FAF5EB] dark:bg-zinc-900 hover:bg-[#F3E8D3] dark:hover:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 rounded-lg text-[10px] text-[#2A2D34] dark:text-zinc-200 font-semibold cursor-pointer transition-colors whitespace-nowrap"
                              >
                                Upload Teaser (Image/GIF)
                              </button>
                              <span className="text-[10px] text-[#525660] dark:text-zinc-400 font-medium">
                                (Max size: 1.0 MB)
                              </span>
                            </div>

                            {editPaperForm.teaserImage ? (
                              <div className="flex items-center gap-2">
                                <div className="relative group/teaser">
                                  <img
                                    src={editPaperForm.teaserImage}
                                    alt="Teaser preview"
                                    className="h-10 w-auto max-w-[120px] object-contain rounded-lg border border-[#E2D5BE] shadow-xs"
                                    referrerPolicy="no-referrer"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setEditPaperForm({ ...editPaperForm, teaserImage: undefined })}
                                    className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 text-[8px] hover:bg-red-700 transition-colors cursor-pointer w-4 h-4 flex items-center justify-center font-bold"
                                    title="Remove teaser"
                                  >
                                    &times;
                                  </button>
                                </div>
                                <span className="text-[9px] text-[#525660] dark:text-zinc-400">Uploaded & optimized</span>
                              </div>
                            ) : (
                              <span className="text-[9px] text-[#525660] dark:text-zinc-400">No teaser uploaded.</span>
                            )}
                          </div>

                          {editTeaserError && (
                            <div className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg p-2 animate-fadeIn">
                              ⚠️ {editTeaserError}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-[#E2D5BE] dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPaperId(null);
                          setEditTeaserError(null);
                        }}
                        className="px-2.5 py-1 text-[10px] font-bold text-[#525660] hover:bg-[#F3E8D3] dark:text-zinc-400 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1 text-[10px] font-bold text-white bg-[#801428] hover:bg-[#5F0E1D] dark:text-zinc-950 dark:bg-[#7DE2C5] dark:hover:bg-[#68d0b3] rounded-lg shadow-xs cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* Featured Highlight Ribbon */}
                    {paper.featured && (
                      <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#801428] text-white dark:bg-[#7DE2C5] dark:text-zinc-950 text-[8px] font-bold tracking-wider uppercase py-0.5 px-2 rounded-md flex items-center gap-0.5 shadow-xs z-10">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>Featured</span>
                      </div>
                    )}

                    {/* Left-Right Layout container to keep Teaser Image perfectly edge-to-edge */}
                    <div className="flex flex-col sm:flex-row gap-0 items-stretch justify-between min-h-[140px]">
                      {/* Left Side: content, tags */}
                      <div className="flex-1 min-w-0 p-4 flex flex-col justify-between">
                        <div>
                          {/* Main Bibliography Info */}
                          <div className="space-y-1">
                            {/* Publication Tag Category Badge */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                                paper.category === 'journal' ? 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900' :
                                paper.category === 'conference' ? 'bg-[#801428]/10 text-[#801428] border border-[#801428]/30 dark:bg-teal-950/60 dark:text-[#7DE2C5] dark:border-teal-800/80' :
                                paper.category === 'workshop' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-900' :
                                'bg-[#F7F1E6] dark:bg-zinc-800/90 text-[#525660] dark:text-zinc-300 border border-[#E5DAC5] dark:border-zinc-700'
                              }`}>
                                {paper.category}
                              </span>
                              <span className="text-xs text-[#2A2D34] dark:text-zinc-100 font-bold">{paper.journal}</span>
                            </div>

                            {/* Paper Title */}
                            <h3 className="text-sm font-bold text-[#2A2D34] dark:text-zinc-100 leading-snug hover:text-[#801428] dark:hover:text-[#7DE2C5] transition-colors">
                              {paperLinkToUse !== '#' ? (
                                <a
                                  href={paperLinkToUse}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline inline-flex items-center gap-1"
                                >
                                  <span>{paper.title}</span>
                                  <ExternalLink className="w-3.5 h-3.5 inline text-[#801428] dark:text-zinc-500 shrink-0 align-middle" />
                                </a>
                              ) : (
                                paper.title
                              )}
                            </h3>

                            {/* Authors List (with Highlight on the Portfolio Owner) */}
                            <p className="text-[#525660] dark:text-zinc-400 text-xs">
                              {highlightAuthor(paper.authors, profile.name)}
                            </p>

                            {/* Individual tags */}
                            <div className="flex flex-wrap gap-1 pt-1">
                              {(paper.tags || []).map(tag => (
                                <span key={tag} className="text-[10px] bg-[#F7F1E6] text-[#801428] px-1.5 py-0.5 rounded-md border border-[#E5DAC5] dark:bg-teal-950/60 dark:text-[#7DE2C5] dark:border-teal-800/70 font-['Inter',sans-serif]">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Expandable Blocks Bar */}
                        <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                          {paperLinkToUse !== '#' && (
                            <a
                              href={paperLinkToUse}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Paper"
                              aria-label="View Paper"
                              className="group/btn relative overflow-hidden px-1.5 py-1 sm:px-2.5 sm:py-1 text-xs font-semibold text-[#2A2D34] dark:text-zinc-300 hover:text-[#801428] dark:hover:text-[#7DE2C5] bg-[#F7F1E6] dark:bg-zinc-800/90 border border-[#E5DAC5] dark:border-zinc-700/80 rounded-lg shadow-xs transition-colors flex items-center gap-1 sm:gap-1.5 cursor-pointer"
                            >
                              <span
                                aria-hidden="true"
                                className="absolute inset-0 rounded-[inherit] bg-white/90 dark:bg-zinc-700/80 blur-[2px] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none shadow-[inset_0_0_4px_rgba(255,255,255,0.8),0_0_8px_rgba(255,255,255,0.95)] dark:shadow-[inset_0_0_4px_rgba(125,226,197,0.3),0_0_8px_rgba(125,226,197,0.35)]"
                              />
                              <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-[#801428] dark:text-zinc-400 group-hover/btn:text-[#801428] dark:group-hover/btn:text-[#7DE2C5] transition-colors" />
                                <span className="hidden sm:inline">Paper</span>
                              </span>
                            </a>
                          )}

                          {paper.codeUrl && (
                            <a
                              href={paper.codeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="GitHub"
                              aria-label="View GitHub Repository"
                              className="group/btn relative overflow-hidden px-1.5 py-1 sm:px-2.5 sm:py-1 text-xs font-semibold text-[#2A2D34] dark:text-zinc-300 hover:text-[#801428] dark:hover:text-[#7DE2C5] bg-[#F7F1E6] dark:bg-zinc-800/90 border border-[#E5DAC5] dark:border-zinc-700/80 rounded-lg shadow-xs transition-colors flex items-center gap-1 sm:gap-1.5 cursor-pointer"
                            >
                              <span
                                aria-hidden="true"
                                className="absolute inset-0 rounded-[inherit] bg-white/90 dark:bg-zinc-700/80 blur-[2px] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none shadow-[inset_0_0_4px_rgba(255,255,255,0.8),0_0_8px_rgba(255,255,255,0.95)] dark:shadow-[inset_0_0_4px_rgba(125,226,197,0.3),0_0_8px_rgba(125,226,197,0.35)]"
                              />
                              <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                                <Github className="w-3.5 h-3.5 text-[#801428] dark:text-zinc-400 group-hover/btn:text-[#801428] dark:group-hover/btn:text-[#7DE2C5] transition-colors" />
                                <span className="hidden sm:inline">GitHub</span>
                              </span>
                            </a>
                          )}

                          {hfLink && (
                            <a
                              href={hfLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Hugging Face"
                              aria-label="View Hugging Face Page"
                              className="group/btn relative overflow-hidden px-1.5 py-1 sm:px-2.5 sm:py-1 text-xs font-semibold text-[#2A2D34] dark:text-zinc-300 hover:text-[#801428] dark:hover:text-[#7DE2C5] bg-[#F7F1E6] dark:bg-zinc-800/90 border border-[#E5DAC5] dark:border-zinc-700/80 rounded-lg shadow-xs transition-colors flex items-center gap-1 sm:gap-1.5 cursor-pointer"
                            >
                              <span
                                aria-hidden="true"
                                className="absolute inset-0 rounded-[inherit] bg-white/90 dark:bg-zinc-700/80 blur-[2px] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none shadow-[inset_0_0_4px_rgba(255,255,255,0.8),0_0_8px_rgba(255,255,255,0.95)] dark:shadow-[inset_0_0_4px_rgba(125,226,197,0.3),0_0_8px_rgba(125,226,197,0.35)]"
                              />
                              <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                                <span className="text-xs leading-none" role="img" aria-label="Hugging Face">🤗</span>
                                <span className="hidden sm:inline">Hugging Face</span>
                              </span>
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setExpandedAbstractId(isAbstractExpanded ? null : paper.id);
                              setExpandedBibtexId(null);
                            }}
                            className="text-[11px] sm:text-xs font-bold text-[#525660] dark:text-zinc-400 hover:text-[#801428] dark:hover:text-[#7DE2C5] flex items-center gap-0.5 sm:gap-1 py-0.5 px-1 cursor-pointer whitespace-nowrap transition-colors"
                          >
                            <span>Abstract</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isAbstractExpanded ? 'rotate-180' : ''}`} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setExpandedBibtexId(isBibtexExpanded ? null : paper.id);
                              setExpandedAbstractId(null);
                            }}
                            className="text-[11px] sm:text-xs font-bold text-[#525660] dark:text-zinc-400 hover:text-[#801428] dark:hover:text-[#7DE2C5] flex items-center gap-0.5 sm:gap-1 py-0.5 px-1 cursor-pointer whitespace-nowrap transition-colors"
                          >
                            <span className="sm:hidden">BibTeX</span>
                            <span className="hidden sm:inline">BibTeX Citation</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isBibtexExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Right Side: Resized and framed Teaser Image */}
                      {paper.teaserImage && (
                        <div className="p-4 sm:pl-0 flex items-center justify-center shrink-0">
                          <div
                            className="w-full sm:w-44 md:w-52 shrink-0 rounded-xl overflow-hidden border border-[#E2D5BE] dark:border-zinc-700/80 bg-white dark:bg-zinc-800 flex items-center justify-center p-2 shadow-xs hover:shadow-md hover:border-[#801428]/40 dark:hover:border-zinc-600 transition-all duration-300 cursor-pointer group/image transform hover:-translate-y-0.5 active:scale-98"
                            onClick={() => setSelectedZoomImage(paper.teaserImage || null)}
                            title="Click to zoom preview"
                          >
                            <img
                              src={paper.teaserImage}
                              alt={`Teaser for ${paper.title}`}
                              className="max-h-28 sm:max-h-32 md:max-h-36 w-full h-auto object-contain transition-transform duration-300 group-hover/image:scale-[1.04] rounded-lg"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Collapsible Abstract Content */}
                    {isAbstractExpanded && (
                      <div className="bg-[#F7F1E6] dark:bg-zinc-800/80 border border-[#E5DAC5] dark:border-zinc-700 rounded-xl p-3 mt-2 animate-fadeIn mx-3 sm:mx-4 mb-4">
                        <div className="space-y-3 text-[#2A2D34] dark:text-zinc-300 text-[11px] sm:text-xs leading-relaxed [hyphens:auto] [-webkit-hyphens:auto] font-['Fast_Sans','Fast_Sans_Fallback',sans-serif]">
                          {paper.abstract.split('\n\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Collapsible BibTeX Citation Content */}
                    {isBibtexExpanded && (
                      <BibtexViewer
                        paperId={paper.id}
                        title={paper.title}
                        bibtex={paper.bibtex}
                        isCopied={isCopied}
                        onCopy={() => copyBibtex(paper.id, paper.bibtex)}
                        onDownload={() => downloadBibtex(paper.title, paper.bibtex)}
                      />
                    )}
                  </>
                )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Zoomed-in Image Modal (Lightbox) */}
      {selectedZoomImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedZoomImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] bg-white dark:bg-zinc-900 rounded-2xl p-2 shadow-2xl flex flex-col items-center border border-zinc-200 dark:border-zinc-800 mt-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button positioned outside of the image container */}
            <button
              type="button"
              onClick={() => setSelectedZoomImage(null)}
              className="absolute -top-11 right-0 p-2 bg-white/90 hover:bg-white text-black rounded-full transition-all shadow-lg cursor-pointer flex items-center justify-center w-9 h-9 border border-zinc-200/80 backdrop-blur-xs hover:scale-105 active:scale-95"
              title="Close image view"
              aria-label="Close image view"
            >
              <X className="w-5 h-5 text-black" />
            </button>
            <img
              src={selectedZoomImage}
              alt="Teaser full preview"
              className="max-w-full max-h-[78vh] object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

    </div>
  );
}
