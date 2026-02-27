import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Moon, Sun, Thermometer, Ruler } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [currentSettings, setCurrentSettings] = useState(settings);

  useEffect(() => {
    setCurrentSettings(settings);
  }, [settings, isOpen]);

  const handleSave = () => {
    onSave(currentSettings);
    onClose();
  };

  const isDark = currentSettings.theme === 'dark';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`backdrop-blur-2xl border-white/10 ${isDark ? 'bg-black/60 text-white' : 'bg-white/90 text-slate-900 border-slate-200'}`}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Preferences</DialogTitle>
          <DialogDescription className={isDark ? 'text-white/50' : 'text-slate-500'}>
            Customize your SkyCast experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-8 py-6">
          {/* Units Selection */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-medium opacity-70">
              <Ruler className="w-4 h-4" />
              <span>Measurement Units</span>
            </div>
            <Tabs 
              value={currentSettings.units} 
              onValueChange={(v) => setCurrentSettings({...currentSettings, units: v as 'metric' | 'imperial'})}
              className="w-full"
            >
              <TabsList className={`grid w-full grid-cols-2 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <TabsTrigger value="metric" className="flex items-center gap-2">
                  <Thermometer className="w-3.5 h-3.5" />
                  Metric (°C)
                </TabsTrigger>
                <TabsTrigger value="imperial" className="flex items-center gap-2">
                  <Thermometer className="w-3.5 h-3.5" />
                  Imperial (°F)
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 font-medium">
                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span>Dark Mode</span>
              </div>
              <span className="text-xs opacity-50">Switch between light and dark themes.</span>
            </div>
            <Switch 
              checked={isDark}
              onCheckedChange={(checked) => setCurrentSettings({...currentSettings, theme: checked ? 'dark' : 'light'})}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="ghost" className={isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'}>
              Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
          >
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
