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
      <DialogContent className="max-w-md backdrop-blur-3xl border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-serif tracking-tight">Preferences</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Customize your SkyCast experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-8 py-8">
          {/* Units Selection */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider opacity-60">
              <Ruler className="w-4 h-4" />
              <span>Measurement Units</span>
            </div>
            <Tabs 
              value={currentSettings.units} 
              onValueChange={(v) => setCurrentSettings({...currentSettings, units: v as 'metric' | 'imperial'})}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-muted/50 border border-white/5">
                <TabsTrigger value="metric" className="flex items-center gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                  <Thermometer className="w-4 h-4" />
                  Metric (°C)
                </TabsTrigger>
                <TabsTrigger value="imperial" className="flex items-center gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                  <Thermometer className="w-4 h-4" />
                  Imperial (°F)
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
 
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-5 rounded-3xl border border-white/10 bg-muted/30 backdrop-blur-md transition-all hover:bg-muted/40">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 font-semibold text-lg">
                {isDark ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-orange-400" />}
                <span>Dark Mode</span>
              </div>
              <span className="text-sm text-muted-foreground">Switch between light and dark themes.</span>
            </div>
            <Switch 
              checked={isDark}
              onCheckedChange={(checked) => setCurrentSettings({...currentSettings, theme: checked ? 'dark' : 'light'})}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </div>
 
        <DialogFooter className="flex flex-row gap-3 sm:justify-end">
          <DialogClose asChild>
            <Button variant="ghost" className="flex-1 sm:flex-none rounded-2xl hover:bg-muted/50">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={handleSave}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-8 shadow-lg shadow-blue-500/25 transition-all active:scale-95"
          >
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
