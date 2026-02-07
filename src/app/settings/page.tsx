"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Settings, Bell, Palette, Key, Save, RefreshCw, Upload, X, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const settingsSections = [
  {
    title: "Profile",
    description: "Manage your account settings",
    icon: Settings,
    items: [
      { label: "Display Name", key: "displayName", type: "text", default: "Vynlo AI" },
      { label: "Email", key: "email", type: "email", default: "vynlo@agency.com" },
      { label: "Timezone", key: "timezone", type: "select", default: "UTC" },
    ],
  },
  {
    title: "Notifications",
    description: "Configure alert preferences",
    icon: Bell,
    items: [
      { label: "Telegram Notifications", key: "telegramEnabled", type: "toggle", default: true },
      { label: "Email Digest", key: "emailDigest", type: "toggle", default: false },
      { label: "Feature Alerts", key: "featureAlerts", type: "toggle", default: true },
      { label: "System Warnings", key: "systemWarnings", type: "toggle", default: true },
    ],
  },
  {
    title: "Appearance",
    description: "Customize the dashboard look",
    icon: Palette,
    items: [
      { label: "Compact Mode", key: "compactMode", type: "toggle", default: false },
      { label: "Show Animations", key: "showAnimations", type: "toggle", default: true },
      { label: "Sidebar Position", key: "sidebarPosition", type: "select", default: "Left" },
    ],
  },
  {
    title: "API & Integrations",
    description: "Manage connected services",
    icon: Key,
    items: [
      { label: "Telegram Bot Token", key: "telegramToken", type: "password", default: "" },
      { label: "Telegram Chat ID", key: "telegramChatId", type: "text", default: "" },
      { label: "API Status", key: "apiStatus", type: "status", default: "Not Connected" },
    ],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem("vynlo_settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      const defaults: Record<string, any> = {};
      settingsSections.forEach((section) => {
        section.items.forEach((item) => {
          defaults[item.key] = item.default;
        });
      });
      setSettings(defaults);
    }

    const savedAvatar = localStorage.getItem("vynlo_avatar");
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }

    const savedToken = localStorage.getItem("vynlo_telegramToken");
    const savedChatId = localStorage.getItem("vynlo_telegramChatId");
    if (savedToken) {
      setSettings((prev) => ({ ...prev, telegramToken: savedToken }));
    }
    if (savedChatId) {
      setSettings((prev) => ({ ...prev, telegramChatId: savedChatId }));
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const url = e.target.result as string;
          setAvatarUrl(url);
          localStorage.setItem("vynlo_avatar", url);
        }
      };
      reader.readAsDataURL(file);
    }
    setShowAvatarUpload(false);
  };

  const removeAvatar = () => {
    setAvatarUrl("");
    localStorage.removeItem("vynlo_avatar");
    setShowAvatarUpload(false);
  };

  const saveSettings = () => {
    setIsSaving(true);
    localStorage.setItem("vynlo_settings", JSON.stringify(settings));
    
    const tokenValue = String(settings.telegramToken || "");
    const chatIdValue = String(settings.telegramChatId || "");
    
    console.log("Saving token:", tokenValue);
    console.log("Saving chat ID:", chatIdValue);
    
    if (tokenValue) {
      localStorage.setItem("vynlo_telegramToken", tokenValue);
    }
    if (chatIdValue) {
      localStorage.setItem("vynlo_telegramChatId", chatIdValue);
    }
    
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
      
      if (settings.telegramToken && settings.telegramChatId) {
        handleSettingChange("apiStatus", "Connected");
      }
    }, 500);
  };

  const resetSettings = () => {
    const defaults: Record<string, any> = {};
    settingsSections.forEach((section) => {
      section.items.forEach((item) => {
        defaults[item.key] = item.default;
      });
    });
    setSettings(defaults);
    localStorage.setItem("vynlo_settings", JSON.stringify(defaults));
    localStorage.removeItem("vynlo_telegramToken");
    localStorage.removeItem("vynlo_telegramChatId");
    setSaveMessage("Settings reset to defaults!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const testTelegram = async () => {
    const token = localStorage.getItem("vynlo_telegramToken") || String(settings.telegramToken || "");
    const chatId = localStorage.getItem("vynlo_telegramChatId") || String(settings.telegramChatId || "");
    
    console.log("Testing with token:", token);
    console.log("Testing with chat ID:", chatId);
    
    if (token && chatId) {
      const testMsg = `✅ **Telegram Connected!**\n\nVynlo AI Dashboard notifications are working correctly.`;
      
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: testMsg,
          token: token,
          chatId: chatId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Test message sent successfully!");
      } else {
        alert("Failed to send: " + data.error);
      }
    } else {
      alert("Please enter Telegram Bot Token and Chat ID first.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your dashboard and preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className="text-sm text-green-500 flex items-center gap-1">
              <Check className="h-4 w-4" />
              {saveMessage}
            </span>
          )}
          <Button variant="outline" onClick={resetSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveSettings} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Profile & Avatar
          </CardTitle>
          <CardDescription>Manage your profile picture and account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                  <span className="text-2xl font-bold text-primary">V</span>
                </div>
              )}
              <button
                onClick={() => setShowAvatarUpload(!showAvatarUpload)}
                className="absolute -bottom-1 -right-1 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <Upload className="h-4 w-4" />
              </button>
            </div>

            {showAvatarUpload && (
              <div className="relative">
                <div className="p-4 bg-popover border rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium">Profile Picture</p>
                    {avatarUrl && (
                      <button
                        onClick={removeAvatar}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended: Square image, at least 200x200px
                  </p>
                </div>
              </div>
            )}

            <div className="flex-1 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Display Name</label>
                <Input
                  value={settings.displayName || "Vynlo AI"}
                  onChange={(e) => handleSettingChange("displayName", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={settings.email || "vynlo@agency.com"}
                  onChange={(e) => handleSettingChange("email", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {settingsSections.slice(1).map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="h-5 w-5" />
                {section.title}
              </CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="font-medium">{item.label}</p>
                      {item.type === "toggle" && (
                        <p className="text-sm text-muted-foreground">
                          {item.default ? "Enabled" : "Disabled"}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.type === "text" ? (
                        <Input
                          value={settings[item.key] || ""}
                          onChange={(e) => handleSettingChange(item.key, e.target.value)}
                          className="w-64"
                        />
                      ) : item.type === "email" ? (
                        <Input
                          type="email"
                          value={settings[item.key] || ""}
                          onChange={(e) => handleSettingChange(item.key, e.target.value)}
                          className="w-64"
                        />
                      ) : item.type === "password" ? (
                        <Input
                          type="text"
                          value={settings[item.key] || ""}
                          onChange={(e) => handleSettingChange(item.key, e.target.value)}
                          className="w-64 font-mono text-sm"
                        />
                      ) : item.type === "select" ? (
                        <select
                          value={settings[item.key] || item.default}
                          onChange={(e) => handleSettingChange(item.key, e.target.value)}
                          className="h-10 px-3 rounded-md border bg-background w-40"
                        >
                          <option value="Left">Left</option>
                          <option value="Right">Right</option>
                          <option value="UTC">UTC</option>
                        </select>
                      ) : item.type === "toggle" ? (
                        <input
                          type="checkbox"
                          checked={settings[item.key] || false}
                          onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      ) : item.key === "apiStatus" ? (
                        <div className="flex items-center gap-2">
                          <Badge variant={settings.apiStatus === "Connected" ? "default" : "secondary"}>
                            {settings.apiStatus || "Not Connected"}
                          </Badge>
                          <Button variant="outline" size="sm" onClick={testTelegram}>
                            Test
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="secondary">{item.default}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
