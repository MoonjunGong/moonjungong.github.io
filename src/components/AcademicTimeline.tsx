import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Briefcase, Award, Plus, Trash2, Calendar } from 'lucide-react';
import { AcademicExperience } from '../types';

interface AcademicTimelineProps {
  experiences: AcademicExperience[];
  isEditing: boolean;
  onUpdateExperiences: (updated: AcademicExperience[] | ((prev: AcademicExperience[]) => AcademicExperience[])) => void;
}

export default function AcademicTimeline({
  experiences,
  isEditing,
  onUpdateExperiences
}: AcademicTimelineProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'education' | 'position' | 'award'>('all');

  // Form states for creating a new experience
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExp, setNewExp] = useState<Partial<AcademicExperience>>({
    role: '',
    institution: '',
    duration: '',
    description: '',
    type: 'position'
  });

  const handleUpdateExperience = (id: string, field: keyof AcademicExperience, value: string) => {
    onUpdateExperiences(prev => prev.map(exp => {
      if (exp.id === id) {
        return { ...exp, [field]: value };
      }
      return exp;
    }));
  };

  const handleDeleteExperience = (id: string) => {
    onUpdateExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.role || !newExp.institution) {
      alert("Please fill in the role/milestone and institution.");
      return;
    }

    const expToAdd: AcademicExperience = {
      id: `exp-${Date.now()}`,
      role: newExp.role || '',
      institution: newExp.institution || '',
      duration: newExp.duration || '2026',
      description: newExp.description || '',
      type: newExp.type as AcademicExperience['type'] || 'position'
    };

    onUpdateExperiences(prev => [expToAdd, ...prev]);
    setShowAddForm(false);
    setNewExp({
      role: '',
      institution: '',
      duration: '',
      description: '',
      type: 'position'
    });
  };

  const availableFilters = useMemo(() => {
    const filters: ('all' | 'position' | 'education' | 'award')[] = ['all', 'position', 'education'];
    if (experiences.some(exp => exp.type === 'award')) {
      filters.push('award');
    }
    return filters;
  }, [experiences]);

  // Reset filter if active filter becomes unavailable
  React.useEffect(() => {
    if (activeFilter === 'award' && !experiences.some(exp => exp.type === 'award')) {
      setActiveFilter('all');
    }
  }, [experiences, activeFilter]);

  const filteredExperiences = useMemo(() => {
    return experiences.filter(exp => activeFilter === 'all' || exp.type === activeFilter);
  }, [experiences, activeFilter]);

  const getTypeStyles = (type: AcademicExperience['type']) => {
    switch (type) {
      case 'education':
        return {
          icon: <GraduationCap className="w-4 h-4 text-orange-600 dark:text-orange-400" />,
          bullet: 'border-orange-400 dark:border-orange-400 bg-orange-50 dark:bg-orange-950/70',
          badge: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/80 dark:text-orange-300 dark:border-orange-700/80',
          label: 'Education'
        };
      case 'position':
        return {
          icon: <Briefcase className="w-4 h-4 text-[#801428] dark:text-[#7DE2C5]" />,
          bullet: 'border-[#801428] dark:border-[#7DE2C5] bg-[#FAF5EB] dark:bg-teal-950/70',
          badge: 'bg-[#801428]/10 text-[#801428] border-[#801428]/30 dark:bg-teal-950/80 dark:text-[#7DE2C5] dark:border-teal-700/80',
          label: 'Position'
        };
      case 'award':
        return {
          icon: <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
          bullet: 'border-purple-400 dark:border-purple-400 bg-purple-50 dark:bg-purple-950/70',
          badge: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-700/80',
          label: 'Award'
        };
    }
  };

  return (
    <div id="cv-section" className="mb-8">
      {/* Timeline Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#2A2D34] dark:text-zinc-100">Academic Timeline</h2>
          <p className="text-xs text-[#525660] dark:text-zinc-400">Chronological history of educational milestones, faculty positions, and academic honors</p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Quick Category Filters */}
          <div className="flex bg-[#F7F1E6] dark:bg-zinc-800/90 p-1 rounded-xl gap-1 border border-[#E5DAC5] dark:border-zinc-700/80 relative">
            {availableFilters.map(type => {
              const isActive = activeFilter === type;
              return (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`group relative px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                    isActive
                      ? 'text-[#801428] dark:text-[#7DE2C5] font-bold'
                      : 'text-[#525660] dark:text-zinc-400 hover:text-[#801428] dark:hover:text-[#7DE2C5]'
                  }`}
                >
                  {isActive ? (
                    <motion.div
                      layoutId="academic-filter-active-pill"
                      className="absolute inset-[1px] bg-white dark:bg-zinc-900 rounded-[7px] border border-[#E2D5BE] dark:border-zinc-700 shadow-xs"
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
                    {type === 'all' ? 'All' : type === 'position' ? 'Positions' : type === 'education' ? 'Educations' : type + 's'}
                  </span>
                </button>
              );
            })}
          </div>

          {isEditing && (
            <button
              onClick={() => setShowAddForm(prev => !prev)}
              className="px-2.5 py-1.5 bg-[#801428] hover:bg-[#5F0E1D] text-white dark:bg-[#7DE2C5] dark:hover:bg-[#68d0b3] dark:text-zinc-950 rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? "Cancel" : "Add Item"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Timeline Item Form */}
      {showAddForm && (
        <form onSubmit={handleAddExperience} className="bg-[#FAF5EB] dark:bg-zinc-900 border border-[#E2D5BE] dark:border-zinc-800 rounded-2xl p-5 mb-6 shadow-inner animate-fadeIn space-y-3">
          <h3 className="font-bold text-[#2A2D34] dark:text-zinc-200 text-sm border-b border-[#E2D5BE] dark:border-zinc-800 pb-1.5">Add CV Milestone</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-500 uppercase block mb-1">Role / Degree / Honor Title *</label>
              <input
                type="text"
                required
                value={newExp.role}
                onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 rounded-lg p-2 text-xs outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100"
                placeholder="Ph.D. in Computer Science"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-500 uppercase block mb-1">Institution / Organization *</label>
              <input
                type="text"
                required
                value={newExp.institution}
                onChange={(e) => setNewExp({ ...newExp, institution: e.target.value })}
                className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 rounded-lg p-2 text-xs outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100"
                placeholder="Massachusetts Institute of Technology (MIT)"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-500 uppercase block mb-1">Timeline (Duration)</label>
              <input
                type="text"
                value={newExp.duration}
                onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
                className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 rounded-lg p-2 text-xs outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100"
                placeholder="2017 - 2022"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-500 uppercase block mb-1">Milestone Type</label>
              <select
                value={newExp.type}
                onChange={(e) => setNewExp({ ...newExp, type: e.target.value as AcademicExperience['type'] })}
                className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 rounded-lg p-2 text-xs outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-200"
              >
                <option value="position">Faculty / Research Position</option>
                <option value="education">Degree / Education</option>
                <option value="award">Honor / Scholarship / Grant</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-[#525660] dark:text-zinc-500 uppercase block mb-1">Details & Description</label>
              <textarea
                value={newExp.description}
                onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                rows={3}
                className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 rounded-lg p-2 text-xs outline-none focus:border-[#801428] dark:focus:border-[#7DE2C5] text-[#2A2D34] dark:text-zinc-100"
                placeholder="Specialization in HCI, human-in-the-loop systems..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1.5 border-t border-[#E2D5BE] dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs font-semibold text-[#525660] hover:bg-[#EAE0CB] dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white dark:text-zinc-950 bg-[#801428] hover:bg-[#5F0E1D] dark:bg-[#7DE2C5] dark:hover:bg-[#68d0b3] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Main Timeline Graphic & Items */}
      <div className="relative border-l-2 border-[#E2D5BE] dark:border-zinc-800 ml-4 pl-6 md:pl-8 space-y-4 py-1">
        {filteredExperiences.length === 0 ? (
          <p className="text-[#525660] dark:text-zinc-400 text-xs ml-2">No CV items listed for this category.</p>
        ) : (
          filteredExperiences.map((exp) => {
            const styles = getTypeStyles(exp.type);
            return (
              <div key={exp.id} className="relative group">
                {/* Timeline Bullet Node */}
                <div className={`absolute -left-[37px] md:-left-[45px] top-1 p-1 rounded-full border-2 shadow-xs transition-colors ${styles.bullet}`}>
                  {styles.icon}
                </div>

                {/* CV Item Card */}
                <div className="bg-[#FAF5EB] hover:bg-[#FDFBF7] dark:bg-zinc-900 dark:hover:bg-[#1f1f23] border border-[#E2D5BE] dark:border-zinc-800 hover:border-[#801428]/40 dark:hover:border-zinc-700 rounded-xl p-4 hover:shadow-xs transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {isEditing ? (
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => handleUpdateExperience(exp.id, 'role', e.target.value)}
                            className="text-sm font-bold text-[#2A2D34] dark:text-zinc-100 border-b border-[#E2D5BE] dark:border-zinc-700 focus:border-[#801428] dark:focus:border-[#7DE2C5] outline-none flex-1 min-w-[200px] bg-transparent"
                          />
                        ) : (
                          <h3 className="text-sm font-bold text-[#2A2D34] dark:text-zinc-100 leading-snug">
                            {exp.role}
                          </h3>
                        )}
                        {exp.type !== 'education' && exp.type !== 'position' && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${styles.badge}`}>
                            {styles.label}
                          </span>
                        )}
                      </div>

                      {isEditing ? (
                        <input
                          type="text"
                          value={exp.institution}
                          onChange={(e) => handleUpdateExperience(exp.id, 'institution', e.target.value)}
                          className="text-[#2A2D34] dark:text-zinc-300 text-xs border-b border-[#E2D5BE] dark:border-zinc-700 focus:border-[#801428] dark:focus:border-[#7DE2C5] outline-none w-full bg-transparent"
                        />
                      ) : (
                        <p className="text-[#2A2D34] dark:text-zinc-300 text-xs font-semibold">
                          {exp.institution}
                        </p>
                      )}
                    </div>

                  {/* Date & Action buttons */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-[#525660] dark:text-zinc-400 font-medium font-mono">
                      <Calendar className="w-3.5 h-3.5 text-[#801428] dark:text-zinc-500" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => handleUpdateExperience(exp.id, 'duration', e.target.value)}
                          className="border-b border-[#E2D5BE] dark:border-zinc-700 focus:border-[#801428] dark:focus:border-[#7DE2C5] outline-none w-16 py-0.5 text-xs font-mono text-right text-[#2A2D34] dark:text-zinc-300 bg-transparent"
                        />
                      ) : (
                        <span>{exp.duration}</span>
                      )}
                    </div>

                    {isEditing && (
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="p-1 bg-[#F3E8D3] dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/30 border border-[#E2D5BE] dark:border-zinc-700 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                        title="Delete CV item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Description */}
                {isEditing ? (
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleUpdateExperience(exp.id, 'description', e.target.value)}
                    rows={2}
                    className="w-full bg-[#F3E8D3] dark:bg-zinc-800 border border-[#E2D5BE] dark:border-zinc-700 rounded p-2 text-xs text-[#2A2D34] dark:text-zinc-300 outline-none mt-1"
                  />
                ) : (
                  exp.description ? (
                    <p className="text-[#4E5158] dark:text-zinc-400 text-xs leading-normal text-justify mt-1.5 pt-1.5 border-t border-[#E2D5BE] dark:border-zinc-800">
                      {exp.description}
                    </p>
                  ) : null
                )}
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}
