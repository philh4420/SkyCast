import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { X, Save, Thermometer, Moon, Sun } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const isDark = localSettings.theme === 'dark';

  const modalBg = isDark ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-slate-200';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-slate-500';
  const sectionBg = isDark ? 'bg-black/20 border-white/5' : 'bg-slate-100 border-slate-200';
  const infoBg = isDark ? 'bg-white/5 border-white/5' : 'bg-blue-50 border-blue-100';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className={`${modalBg} backdrop-blur-xl rounded-3xl w-full max-w-md border shadow-2xl overflow-hidden transform transition-all scale-100`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-2xl font-bold tracking-tight ${textPrimary}`}>Preferences</h2>
            <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-8">
            
            {/* Theme Selection */}
            <div>
               <label className={`block text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                 {localSettings.theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-yellow-500" />}
                 Appearance
               </label>
               <div className={`grid grid-cols-2 gap-3 p-1 rounded-2xl border ${sectionBg}`}>
                 <button
                   onClick={() => setLocalSettings({ ...localSettings, theme: 'light' })}
                   className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-all ${
                     localSettings.theme === 'light'
                       ? 'bg-white text-slate-900 shadow-lg'
                       : `${textSecondary} hover:bg-white/5`
                   }`}
                 >
                   <Sun className="w-4 h-4" />
                   Light
                 </button>
                 <button
                   onClick={() => setLocalSettings({ ...localSettings, theme: 'dark' })}
                   className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-all ${
                     localSettings.theme === 'dark'
                       ? 'bg-slate-700 text-white shadow-lg ring-1 ring-white/10'
                       : `${textSecondary} hover:bg-white/5`
                   }`}
                 >
                   <Moon className="w-4 h-4" />
                   Dark
                 </button>
               </div>
            </div>

            {/* Unit Selection */}
            <div>
               <label className={`block text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                 <Thermometer className="w-4 h-4 text-blue-400" />
                 Units
               </label>
               <div className={`grid grid-cols-2 gap-3 p-1 rounded-2xl border ${sectionBg}`}>
                 <button
                   onClick={() => setLocalSettings({ ...localSettings, units: 'metric' })}
                   className={`p-3 rounded-xl text-sm font-medium transition-all ${
                     localSettings.units === 'metric'
                       ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                       : `${textSecondary} hover:bg-white/5`
                   }`}
                 >
                   Metric (°C, km/h)
                 </button>
                 <button
                   onClick={() => setLocalSettings({ ...localSettings, units: 'imperial' })}
                   className={`p-3 rounded-xl text-sm font-medium transition-all ${
                     localSettings.units === 'imperial'
                       ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                       : `${textSecondary} hover:bg-white/5`
                   }`}
                 >
                   Imperial (°F, mph)
                 </button>
               </div>
            </div>

            {/* Info Section */}
            <div className={`p-4 rounded-2xl border ${infoBg}`}>
               <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <h4 className={`font-semibold text-xs uppercase tracking-wider ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>System Status</h4>
               </div>
               <p className={`text-xs leading-relaxed ${textSecondary}`}>
                 SkyCast AI is operating in <strong>Smart Ensemble Mode</strong>. We fuse data from multiple providers to ensure maximum accuracy.
               </p>
            </div>
          </div>
        </div>

        <div className={`p-6 border-t flex justify-end ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
          <button
            onClick={handleSave}
            className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
