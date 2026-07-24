import React from 'react';
import * as Icons from 'lucide-react';
import { ResearchArea } from '../types';

interface ResearchInterestsCardProps {
  areas: ResearchArea[];
  isEditing: boolean;
  onUpdateAreas: (updated: ResearchArea[] | ((prev: ResearchArea[]) => ResearchArea[])) => void;
}

export default function ResearchInterestsCard({
  areas,
  isEditing,
  onUpdateAreas
}: ResearchInterestsCardProps) {

  const handleUpdateArea = (id: string, field: keyof ResearchArea, value: string) => {
    onUpdateAreas(prev => prev.map(area => {
      if (area.id === id) {
        return { ...area, [field]: value };
      }
      return area;
    }));
  };

  const addArea = () => {
    const newArea: ResearchArea = {
      id: `ra-${Date.now()}`,
      title: "New Research Theme",
      description: "Short, engaging summary of the core thesis behind this research direction.",
      iconName: "Sparkles"
    };
    onUpdateAreas(prev => [...prev, newArea]);
  };

  const removeArea = (id: string) => {
    onUpdateAreas(prev => prev.filter(a => a.id !== id));
  };

  // Helper to dynamically load a Lucide Icon by string name
  const renderIcon = (name: string, className: string = "w-4 h-4") => {
    const IconComponent = (Icons as any)[name];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    return <Icons.BookOpen className={className} />; // Fallback icon
  };

  return (
    <div id="interests-section" className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Research Focus Areas</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Major domains of ongoing exploration</p>
        </div>
        {isEditing && (
          <button
            onClick={addArea}
            className="px-2.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
          >
            <Icons.Plus className="w-3.5 h-3.5" />
            <span>Add Focus Area</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {areas.map((area) => {
          return (
            <div
              key={area.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs rounded-lg p-5 transition-all duration-300 flex flex-col justify-between relative"
            >
              <div>
                {/* Header Icon + Edit controls */}
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors">
                    {isEditing ? (
                      <select
                        value={area.iconName}
                        onChange={(e) => handleUpdateArea(area.id, 'iconName', e.target.value)}
                        className="text-xs bg-transparent border-none outline-none font-medium cursor-pointer text-zinc-700 dark:text-zinc-300"
                      >
                        <option value="Sparkles">Sparkles</option>
                        <option value="Users">Users</option>
                        <option value="Eye">Eye</option>
                        <option value="Brain">Brain</option>
                        <option value="BookOpen">Book</option>
                        <option value="Cpu">CPU</option>
                        <option value="Globe">Globe</option>
                        <option value="Code">Code</option>
                        <option value="Database">Database</option>
                        <option value="GraduationCap">Graduation Cap</option>
                        <option value="Lightbulb">Lightbulb</option>
                      </select>
                    ) : (
                      renderIcon(area.iconName, "w-5 h-5")
                    )}
                  </div>

                  {isEditing && (
                    <button
                      onClick={() => removeArea(area.id)}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                      title="Delete area"
                    >
                      <Icons.Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Title */}
                {isEditing ? (
                  <input
                    type="text"
                    value={area.title}
                    onChange={(e) => handleUpdateArea(area.id, 'title', e.target.value)}
                    className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 focus:border-blue-600 outline-none w-full mb-2 bg-transparent"
                  />
                ) : (
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1.5 leading-snug">
                    {area.title}
                  </h3>
                )}

                {/* Short Description */}
                {isEditing ? (
                  <textarea
                    value={area.description}
                    onChange={(e) => handleUpdateArea(area.id, 'description', e.target.value)}
                    rows={3}
                    className="text-xs text-zinc-600 dark:text-zinc-300 w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded p-2 outline-none mb-2"
                  />
                ) : (
                  <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed mb-3">
                    {area.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
