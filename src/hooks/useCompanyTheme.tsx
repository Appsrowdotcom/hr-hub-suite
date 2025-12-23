import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface CompanyTheme {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  background_color: string;
  logo_url: string | null;
}

const defaultTheme: CompanyTheme = {
  primary_color: '#0f766e',
  secondary_color: '#14b8a6',
  accent_color: '#2dd4bf',
  text_color: '#1f2937',
  background_color: '#ffffff',
  logo_url: null,
};

function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function useCompanyTheme() {
  const { companyUsers } = useAuth();
  const [theme, setTheme] = useState<CompanyTheme>(defaultTheme);
  const [loading, setLoading] = useState(true);
  const companyId = companyUsers[0]?.company_id;

  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    const fetchTheme = async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('primary_color, secondary_color, accent_color, text_color, background_color, logo_url')
        .eq('id', companyId)
        .maybeSingle();

      if (data && !error) {
        setTheme({
          primary_color: data.primary_color || defaultTheme.primary_color,
          secondary_color: data.secondary_color || defaultTheme.secondary_color,
          accent_color: data.accent_color || defaultTheme.accent_color,
          text_color: data.text_color || defaultTheme.text_color,
          background_color: data.background_color || defaultTheme.background_color,
          logo_url: data.logo_url,
        });
      }
      setLoading(false);
    };

    fetchTheme();
  }, [companyId]);

  // Apply theme to CSS variables
  useEffect(() => {
    if (loading) return;

    const root = document.documentElement;
    
    // Convert hex to HSL and apply to CSS variables
    root.style.setProperty('--accent', hexToHSL(theme.accent_color));
    root.style.setProperty('--sidebar-primary', hexToHSL(theme.accent_color));
    root.style.setProperty('--ring', hexToHSL(theme.accent_color));
  }, [theme, loading]);

  const updateTheme = async (updates: Partial<CompanyTheme>) => {
    if (!companyId) return { error: new Error('No company found') };

    const { error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', companyId);

    if (!error) {
      setTheme(prev => ({ ...prev, ...updates }));
    }

    return { error };
  };

  const uploadLogo = async (file: File) => {
    if (!companyId) return { error: new Error('No company found'), url: null };

    const fileExt = file.name.split('.').pop();
    const fileName = `${companyId}/logo.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('company-logos')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      return { error: uploadError, url: null };
    }

    const { data: urlData } = supabase.storage
      .from('company-logos')
      .getPublicUrl(fileName);

    const logo_url = urlData.publicUrl;

    const { error: updateError } = await supabase
      .from('companies')
      .update({ logo_url })
      .eq('id', companyId);

    if (!updateError) {
      setTheme(prev => ({ ...prev, logo_url }));
    }

    return { error: updateError, url: logo_url };
  };

  return {
    theme,
    loading,
    updateTheme,
    uploadLogo,
    companyId,
  };
}
