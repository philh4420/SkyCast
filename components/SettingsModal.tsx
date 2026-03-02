import React, { useState, useEffect } from 'react';
import { UserSettings, WidgetConfig } from '../types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun, Thermometer, Ruler, LayoutDashboard, ArrowUp, ArrowDown, Eye, EyeOff, GripVertical, Settings2, Bell, BellRing } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (!currentSettings.widgets) return;

    const newWidgets = Array.from(currentSettings.widgets);
    const [reorderedItem] = newWidgets.splice(result.source.index, 1);
    newWidgets.splice(result.destination.index, 0, reorderedItem);

    setCurrentSettings({ ...currentSettings, widgets: newWidgets });
  };

  const isDark = currentSettings.theme === 'dark';
  const [pushEnabled, setPushEnabled] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (reg) {
          reg.pushManager.getSubscription().then(sub => {
            setPushEnabled(!!sub);
          });
        }
      });
    }
  }, []);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const togglePushNotifications = async (enabled: boolean) => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Push notifications are not supported by your browser.');
      return;
    }

    setIsSubscribing(true);

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      if (enabled) {
        // Request permission explicitly
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          throw new Error('permission_denied');
        }

        // Subscribe
        const response = await fetch('/api/push/vapid-public-key');
        const vapidPublicKey = await response.text();
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });

        await fetch('/api/push/subscribe', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        setPushEnabled(true);
      } else {
        // Unsubscribe
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
        setPushEnabled(false);
      }
    } catch (error: any) {
      console.error('Error toggling push notifications:', error);
      if (error.message === 'permission_denied' || error.name === 'NotAllowedError') {
        alert('Notification permission was denied. Please enable it in your browser settings to receive alerts.');
      } else {
        alert('Failed to toggle push notifications. Please try again.');
      }
      setPushEnabled(false);
    } finally {
      setIsSubscribing(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'This is a test notification from SkyCast!' })
      });
    } catch (error) {
      console.error('Failed to send test notification', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-background/80 backdrop-blur-3xl border-white/10 shadow-2xl flex flex-col max-h-[85vh] sm:rounded-[2.5rem]">
        
        {/* Sticky Header */}
        <div className="px-8 py-6 border-b border-white/5 bg-background/50 backdrop-blur-xl z-10 flex items-center justify-between sticky top-0">
          <div>
            <DialogTitle className="text-3xl font-serif tracking-tight flex items-center gap-3">
              <Settings2 className="w-8 h-8 text-blue-500" />
              Preferences
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm font-medium">
              Customize your SkyCast experience and dashboard layout.
            </DialogDescription>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
          <div className="grid gap-10">
            
            {/* General Settings Section */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                General Settings
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Units Selection */}
                <div className="flex flex-col gap-3 p-5 rounded-3xl border border-white/5 bg-muted/20 backdrop-blur-md">
                  <span className="text-sm font-semibold">Measurement System</span>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-background/50 rounded-2xl border border-white/5">
                    <Button
                      type="button"
                      variant={currentSettings.units === 'metric' ? 'default' : 'ghost'}
                      onClick={() => setCurrentSettings({ ...currentSettings, units: 'metric' })}
                      className={`flex items-center justify-center gap-2 h-10 rounded-xl transition-all duration-300 ${
                        currentSettings.units === 'metric' 
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md' 
                          : 'hover:bg-muted/50 text-muted-foreground'
                      }`}
                    >
                      <Thermometer className="w-4 h-4" />
                      Metric (°C)
                    </Button>
                    <Button
                      type="button"
                      variant={currentSettings.units === 'imperial' ? 'default' : 'ghost'}
                      onClick={() => setCurrentSettings({ ...currentSettings, units: 'imperial' })}
                      className={`flex items-center justify-center gap-2 h-10 rounded-xl transition-all duration-300 ${
                        currentSettings.units === 'imperial' 
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md' 
                          : 'hover:bg-muted/50 text-muted-foreground'
                      }`}
                    >
                      <Thermometer className="w-4 h-4" />
                      Imperial (°F)
                    </Button>
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="flex flex-col justify-center gap-4 p-5 rounded-3xl border border-white/5 bg-muted/20 backdrop-blur-md">
                   <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold">Appearance</span>
                        <span className="text-xs text-muted-foreground">Toggle dark mode</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Sun className={`w-4 h-4 ${!isDark ? 'text-orange-400' : 'text-muted-foreground'}`} />
                        <Switch 
                          checked={isDark}
                          onCheckedChange={(checked) => setCurrentSettings({...currentSettings, theme: checked ? 'dark' : 'light'})}
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <Moon className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-muted-foreground'}`} />
                      </div>
                   </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="flex flex-col gap-4 p-5 rounded-3xl border border-white/5 bg-muted/20 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${pushEnabled ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'}`}>
                      {pushEnabled ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold">Push Notifications</span>
                      <span className="text-xs text-muted-foreground">Receive severe weather alerts</span>
                    </div>
                  </div>
                  <Switch 
                    checked={pushEnabled}
                    disabled={isSubscribing}
                    onCheckedChange={togglePushNotifications}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
                {pushEnabled && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={sendTestNotification}
                    className="w-full mt-2 border-white/10 hover:bg-muted/50"
                  >
                    Send Test Notification
                  </Button>
                )}
              </div>
            </div>

            {/* Dashboard Layout Section */}
            {currentSettings.widgets && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard Layout
                  </h3>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    {currentSettings.widgets.filter(w => w.visible).length} Active Widgets
                  </span>
                </div>
                
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="widgets-list">
                    {(provided) => (
                      <div 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="grid grid-cols-1 gap-3 p-4 bg-muted/20 rounded-[2rem] border border-white/5"
                      >
                        {currentSettings.widgets!.map((widget, index) => (
                          // @ts-ignore
                          <Draggable key={widget.id} draggableId={widget.id} index={index}>
                            {(provided, snapshot) => (
                              <div 
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-300 group ${
                                  widget.visible 
                                    ? 'bg-background shadow-sm border border-white/10 hover:border-blue-500/30' 
                                    : 'bg-background/40 border border-transparent opacity-60 hover:opacity-100'
                                } ${snapshot.isDragging ? 'shadow-2xl scale-[1.02] z-50 ring-2 ring-blue-500/50' : ''}`}
                              >
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <div {...provided.dragHandleProps} className="p-1 -ml-1 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-foreground transition-colors">
                                    <GripVertical className="w-5 h-5" />
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`w-8 h-8 rounded-full shrink-0 transition-colors ${widget.visible ? 'bg-blue-500/10 hover:bg-blue-500/20' : 'bg-muted hover:bg-muted/80'}`}
                                    onClick={() => toggleWidget(index)}
                                  >
                                    {widget.visible ? <Eye className="w-4 h-4 text-blue-500" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                                  </Button>
                                  <span className={`font-medium text-sm truncate ${widget.visible ? 'text-foreground' : 'text-muted-foreground line-through decoration-muted-foreground/50'}`}>
                                    {WIDGET_NAMES[widget.id] || widget.id}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-7 h-7 rounded-full hover:bg-muted"
                                    disabled={index === 0}
                                    onClick={() => moveWidget(index, 'up')}
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-7 h-7 rounded-full hover:bg-muted"
                                    disabled={index === currentSettings.widgets!.length - 1}
                                    onClick={() => moveWidget(index, 'down')}
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}
          </div>
        </div>
 
        {/* Sticky Footer */}
        <div className="px-8 py-5 border-t border-white/5 bg-background/50 backdrop-blur-xl z-10 sticky bottom-0">
          <DialogFooter className="flex flex-row gap-3 sm:justify-end w-full">
            <DialogClose asChild>
              <Button variant="ghost" className="flex-1 sm:flex-none h-12 rounded-2xl hover:bg-muted/50 font-semibold">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={handleSave}
              className="flex-1 sm:flex-none h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-8 shadow-lg shadow-blue-500/25 transition-all active:scale-95 font-bold tracking-wide"
            >
              Save Preferences
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
