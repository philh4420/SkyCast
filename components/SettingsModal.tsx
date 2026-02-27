import React, { useState } from 'react';
import { UserSettings } from '../types';
import { X, Save, Thermometer } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-800 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Unit Selection */}
            <div>
               <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                 <Thermometer className="w-4 h-4 text-blue-400" />
                 Temperature & Distance Units
               </label>
               <div className="grid grid-cols-2 gap-3">
                 <button
                   onClick={() => setLocalSettings({ ...localSettings, units: 'metric' })}
                   className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                     localSettings.units === 'metric'
                       ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                       : 'bg-slate-700 border-transparent text-gray-400 hover:bg-slate-600'
                   }`}
                 >
                   Metric (°C, km/h)
                 </button>
                 <button
                   onClick={() => setLocalSettings({ ...localSettings, units: 'imperial' })}
                   className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                     localSettings.units === 'imperial'
                       ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                       : 'bg-slate-700 border-transparent text-gray-400 hover:bg-slate-600'
                   }`}
                 >
                   Imperial (°F, mph)
                 </button>
               </div>
            </div>

            {/* Info Section */}
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
               <h4 className="text-gray-200 font-semibold text-sm mb-2">System Status</h4>
               <p className="text-xs text-gray-400 leading-relaxed mb-2">
                 SkyCast AI is operating in <strong>Smart Ensemble Mode</strong>.
               </p>
               <p className="text-xs text-gray-400 leading-relaxed">
                 We intelligently fuse data from OpenWeatherMap, WeatherAPI.com, and Open-Meteo to provide the most accurate forecast possible. API connectivity is managed automatically.
               </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900/50 border-t border-white/5 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20"
          >
            <Save className="w-5 h-5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
