import { useState, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCompanyTheme } from '@/hooks/useCompanyTheme';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Palette, Upload, Building2, Save, RotateCcw } from 'lucide-react';

const colorPresets = [
  { name: 'Teal', primary: '#0f766e', secondary: '#14b8a6', accent: '#2dd4bf' },
  { name: 'Blue', primary: '#1e40af', secondary: '#3b82f6', accent: '#60a5fa' },
  { name: 'Purple', primary: '#6b21a8', secondary: '#a855f7', accent: '#c084fc' },
  { name: 'Rose', primary: '#9f1239', secondary: '#f43f5e', accent: '#fb7185' },
  { name: 'Orange', primary: '#c2410c', secondary: '#f97316', accent: '#fb923c' },
  { name: 'Green', primary: '#166534', secondary: '#22c55e', accent: '#4ade80' },
];

export default function CompanySettings() {
  const { theme, loading, updateTheme, uploadLogo } = useCompanyTheme();
  const { companyUsers } = useAuth();
  const [saving, setSaving] = useState(false);
  const [colors, setColors] = useState({
    primary_color: theme.primary_color,
    secondary_color: theme.secondary_color,
    accent_color: theme.accent_color,
    text_color: theme.text_color,
    background_color: theme.background_color,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const companyName = companyUsers[0]?.companies?.name || 'Company';

  // Update local state when theme loads
  useState(() => {
    if (!loading) {
      setColors({
        primary_color: theme.primary_color,
        secondary_color: theme.secondary_color,
        accent_color: theme.accent_color,
        text_color: theme.text_color,
        background_color: theme.background_color,
      });
    }
  });

  const handleColorChange = (key: keyof typeof colors, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const handlePresetSelect = (preset: typeof colorPresets[0]) => {
    setColors(prev => ({
      ...prev,
      primary_color: preset.primary,
      secondary_color: preset.secondary,
      accent_color: preset.accent,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateTheme(colors);
    
    if (error) {
      toast.error('Failed to save theme settings');
    } else {
      toast.success('Theme settings saved successfully');
    }
    setSaving(false);
  };

  const handleReset = () => {
    setColors({
      primary_color: '#0f766e',
      secondary_color: '#14b8a6',
      accent_color: '#2dd4bf',
      text_color: '#1f2937',
      background_color: '#ffffff',
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSaving(true);
    const { error, url } = await uploadLogo(file);
    
    if (error) {
      toast.error('Failed to upload logo');
    } else {
      toast.success('Logo uploaded successfully');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <DashboardLayout 
        role="company_admin" 
        title="Company Settings"
        subtitle="Loading..."
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      role="company_admin" 
      title="Company Settings"
      subtitle="Customize your company branding"
      companyName={companyName}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Logo Section */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company Logo
            </CardTitle>
            <CardDescription>
              Upload your company logo. Recommended size: 200x200px
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24 border-2 border-border">
                {theme.logo_url ? (
                  <AvatarImage src={theme.logo_url} alt="Company logo" />
                ) : null}
                <AvatarFallback className="text-2xl bg-accent/10 text-accent">
                  {companyName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saving}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Presets */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Color Presets
            </CardTitle>
            <CardDescription>
              Choose a preset color scheme or customize below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetSelect(preset)}
                  className="p-3 rounded-lg border border-border hover:border-accent transition-colors text-left"
                >
                  <div className="flex gap-1 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <span className="text-sm font-medium">{preset.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Colors */}
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Custom Colors</CardTitle>
            <CardDescription>
              Fine-tune your brand colors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primary">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary"
                    type="color"
                    value={colors.primary_color}
                    onChange={(e) => handleColorChange('primary_color', e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={colors.primary_color}
                    onChange={(e) => handleColorChange('primary_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary"
                    type="color"
                    value={colors.secondary_color}
                    onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={colors.secondary_color}
                    onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accent">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accent"
                    type="color"
                    value={colors.accent_color}
                    onChange={(e) => handleColorChange('accent_color', e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={colors.accent_color}
                    onChange={(e) => handleColorChange('accent_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="text"
                    type="color"
                    value={colors.text_color}
                    onChange={(e) => handleColorChange('text_color', e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={colors.text_color}
                    onChange={(e) => handleColorChange('text_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="background"
                    type="color"
                    value={colors.background_color}
                    onChange={(e) => handleColorChange('background_color', e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={colors.background_color}
                    onChange={(e) => handleColorChange('background_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-8 p-6 rounded-lg border border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Preview</h4>
              <div 
                className="p-6 rounded-lg"
                style={{ backgroundColor: colors.background_color }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: colors.primary_color }}
                  >
                    {companyName.charAt(0)}
                  </div>
                  <h3 
                    className="text-lg font-semibold"
                    style={{ color: colors.text_color }}
                  >
                    {companyName}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: colors.primary_color }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: colors.accent_color }}
                  >
                    Accent Button
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium border"
                    style={{ 
                      color: colors.secondary_color,
                      borderColor: colors.secondary_color,
                    }}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Default
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
