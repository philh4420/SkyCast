import React, { useState, useEffect } from 'react';
import { UserSettings, WidgetConfig } from '../types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun, Thermometer, Ruler, LayoutDashboard, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

const WIDGET_NAMES: Record<string, string> = {
  current: 'Current Weather',
  airQuality: 'Air Quality',
  uvIndex: 'UV Index (Large)',
  comfort: 'Comfort Level (Large)',
  astronomy: 'Sun & Moon',
  wind: 'Wind Compass (Large)',
  suggestions: 'Smart Suggestions',
  rainfall: 'Rainfall',
  feelsLike: 'Feels Like',
  humidity: 'Humidity',
  visibility: 'Visibility',
  pressure: 'Pressure',
  cloudCover: 'Cloud Cover',
  soilTemp: 'Soil Temperature',
  dewPoint: 'Dew Point',
  simpleUv: 'UV Index (Small)',
  simpleWind: 'Wind (Small)',
  hourly: 'Hourly Forecast',
  map: 'Interactive Map',
  daily: '10-Day Forecast',
  chart: 'Forecast Chart'
};

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [currentSettings, setCurrentSettings] = useState(settings);

  useEffect(() => {
    setCurrentSettings(settings);
  }, [settings, isOpen]);

  const handleSave = () => {
    onSave(currentSettings);
    onClose();
  };

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    if (!currentSettings.widgets) return;
    const newWidgets = [...currentSettings.widgets];
    if (direction === 'up' && index > 0) {
      [newWidgets[index - 1], newWidgets[index]] = [newWidgets[index], newWidgets[index - 1]];
    } else if (direction === 'down' && index < newWidgets.length - 1) {
      [newWidgets[index + 1], newWidgets[index]] = [newWidgets[index], newWidgets[index + 1]];
    }
    setCurrentSettings({ ...currentSettings, widgets: newWidgets });
  };

  const toggleWidget = (index: number) => {
    if (!currentSettings.widgets) return;
    const newWidgets = [...currentSettings.widgets];
    newWidgets[index].visible = !newWidgets[index].visible;
    setCurrentSettings({ ...currentSettings, widgets: newWidgets });
  };

  const isDark = currentSettings.theme === 'dark';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto backdrop-blur-3xl border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-serif tracking-tight">Preferences</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Customize your SkyCast experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-8 py-6">
          {/* Units Selection */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider opacity-60">
              <Ruler className="w-4 h-4" />
              <span>Measurement Units</span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted/30 rounded-2xl border border-white/5">
              <Button
                type="button"
                variant={currentSettings.units === 'metric' ? 'default' : 'ghost'}
                onClick={() => setCurrentSettings({ ...currentSettings, units: 'metric' })}
                className={`flex items-center gap-2 h-11 rounded-xl transition-all duration-300 ${
                  currentSettings.units === 'metric' 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <Thermometer className="w-4 h-4" />
                Metric (°C)
              </Button>
              <Button
                type="button"
                variant={currentSettings.units === 'imperial' ? 'default' : 'ghost'}
                onClick={() => setCurrentSettings({ ...currentSettings, units: 'imperial' })}
                className={`flex items-center gap-2 h-11 rounded-xl transition-all duration-300 ${
                  currentSettings.units === 'imperial' 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <Thermometer className="w-4 h-4" />
                Imperial (°F)
              </Button>
            </div>
          </div>
 
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-5 rounded-3xl border border-white/10 bg-muted/30 backdrop-blur-md transition-all hover:bg-muted/40">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 font-semibold text-lg">
                {isDark ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-orange-400" />}
                <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <span className="text-sm text-muted-foreground">Switch between light and dark themes.</span>
            </div>
            <Switch 
              checked={isDark}
              onCheckedChange={(checked) => setCurrentSettings({...currentSettings, theme: checked ? 'dark' : 'light'})}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          {/* Dashboard Layout */}
          {currentSettings.widgets && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider opacity-60">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Layout</span>
              </div>
              <div className="flex flex-col gap-2 p-2 bg-muted/30 rounded-3xl border border-white/5">
                {currentSettings.widgets.map((widget, index) => (
                  <div 
                    key={widget.id} 
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all ${widget.visible ? 'bg-background/50 shadow-sm border border-white/10' : 'opacity-50 hover:opacity-80'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-full"
                        onClick={() => toggleWidget(index)}
                      >
                        {widget.visible ? <Eye className="w-4 h-4 text-blue-400" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <span className="font-medium text-sm">{WIDGET_NAMES[widget.id] || widget.id}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-full"
                        disabled={index === 0}
                        onClick={() => moveWidget(index, 'up')}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-full"
                        disabled={index === currentSettings.widgets!.length - 1}
                        onClick={() => moveWidget(index, 'down')}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
