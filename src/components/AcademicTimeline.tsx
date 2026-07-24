import React, { useState, useMemo } from 'react';
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

  const filteredExperiences = useMemo(() => {
    return experiences.filter(exp => activeFilter === 'all' || exp.type === activeFilter);
  }, [experiences, activeFilter]);

  const getIcon = (type: AcademicExperience['type']) => {
    switch (type) {
      case 'education':
        return <GraduationCap className="w-4 h-4 text-indigo-700" />;
      case 'position':
        return <Briefcase className="w-4 h-4 text-blue-700" />;
      case 'award':
        return <Award className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div id="cv-section" className="mb-8">
      {/* Timeline Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Academic Timeline</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Chronological history of educational milestones, faculty positions, and academic honors</p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Quick Category Filters */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded gap-0.5">
            {(['all', 'position', 'education', 'award'] as const).map(type => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-2.5 py-1 rounded text-xs font-semibold capitalize transition-all cursor-pointer ${
                  activeFilter === type
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                {type === 'all' ? 'All' : type + 's'}
              </button>
            ))}
          </div>

          {isEditing && (
            <button
              onClick={() => setShowAddForm(prev => !prev)}
              className="px-2.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? "Cancel" : "Add Item"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Timeline Item Form */}
      {showAddForm && (
        <form onSubmit={handleAddExperience} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 mb-6 shadow-inner animate-fadeIn space-y-3">
          <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm border-b border-zinc-200 dark:border-zinc-800 pb-1.5">Add CV Milestone</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase block mb-1">Role / Degree / Honor Title *</label>
              <input
                type="text"
                required
                value={newExp.role}
                onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded p-2 text-xs outline-none focus:border-blue-600 text-zinc-900 dark:text-zinc-100"
                placeholder="Ph.D. in Computer Science"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase block mb-1">Institution / Organization *</label>
              <input
                type="text"
                required
                value={newExp.institution}
                onChange={(e) => setNewExp({ ...newExp, institution: e.target.value })}
                className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded p-2 text-xs outline-none focus:border-blue-600 text-zinc-900 dark:text-zinc-100"
                placeholder="Massachusetts Institute of Technology (MIT)"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase block mb-1">Timeline (Duration)</label>
              <input
                type="text"
                value={newExp.duration}
                onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
                className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded p-2 text-xs outline-none focus:border-blue-600 text-zinc-900 dark:text-zinc-100"
                placeholder="2017 - 2022"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase block mb-1">Milestone Type</label>
              <select
                value={newExp.type}
                onChange={(e) => setNewExp({ ...newExp, type: e.target.value as AcademicExperience['type'] })}
                className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded p-2 text-xs outline-none focus:border-blue-600 text-zinc-700 dark:text-zinc-200"
              >
                <option value="position">Faculty / Research Position</option>
                <option value="education">Degree / Education</option>
                <option value="award">Honor / Scholarship / Grant</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase block mb-1">Details & Description</label>
              <textarea
                value={newExp.description}
                onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                rows={3}
                className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded p-2 text-xs outline-none focus:border-blue-600 text-zinc-900 dark:text-zinc-100"
                placeholder="Specialization in HCI, human-in-the-loop systems..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1.5 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded shadow-xs transition-colors"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Main Timeline Graphic & Items */}
      <div className="relative border-l-2 border-zinc-200 dark:border-zinc-800 ml-4 pl-6 md:pl-8 space-y-4 py-1">
        {filteredExperiences.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400 text-xs ml-2">No CV items listed for this category.</p>
        ) : (
          filteredExperiences.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Timeline Bullet Node */}
              <div className="absolute -left-[37px] md:-left-[45px] top-1 p-1 bg-white dark:bg-zinc-900 rounded-full border-2 border-zinc-200 dark:border-zinc-700 shadow-xs group-hover:border-blue-700 dark:group-hover:border-blue-400 transition-colors">
                {getIcon(exp.type)}
              </div>

              {/* CV Item Card */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-lg p-4 hover:shadow-xs transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => handleUpdateExperience(exp.id, 'role', e.target.value)}
                        className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 focus:border-blue-600 outline-none w-full mb-1 bg-transparent"
                      />
                    ) : (
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                        {exp.role}
                      </h3>
                    )}

                    {isEditing ? (
                      <input
                        type="text"
                        value={exp.institution}
                        onChange={(e) => handleUpdateExperience(exp.id, 'institution', e.target.value)}
                        className="text-zinc-700 dark:text-zinc-300 text-xs border-b border-zinc-200 dark:border-zinc-700 focus:border-blue-600 outline-none w-full bg-transparent"
                      />
                    ) : (
                      <p className="text-zinc-700 dark:text-zinc-300 text-xs font-semibold">
                        {exp.institution}
                      </p>
                    )}
                  </div>

                  {/* Date & Action buttons */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium font-mono">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => handleUpdateExperience(exp.id, 'duration', e.target.value)}
                          className="border-b border-zinc-200 dark:border-zinc-700 focus:border-blue-600 outline-none w-16 py-0.5 text-xs font-mono text-right text-zinc-700 dark:text-zinc-300 bg-transparent"
                        />
                      ) : (
                        <span>{exp.duration}</span>
                      )}
                    </div>

                    {isEditing && (
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="p-1 bg-zinc-50 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/30 border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors cursor-pointer"
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
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded p-2 text-xs text-zinc-600 dark:text-zinc-300 outline-none mt-1"
                  />
                ) : (
                  exp.description ? (
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-normal text-justify mt-1.5 pt-1.5 border-t border-zinc-100 dark:border-zinc-800">
                      {exp.description}
                    </p>
                  ) : null
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
