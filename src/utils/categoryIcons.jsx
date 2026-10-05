import React from 'react';
import {
  Briefcase,
  GraduationCap,
  User,
  FolderKanban,
  ShoppingBag,
  Code,
  BookOpen,
  HeartPulse,
  Home,
  Coffee,
  Sparkles,
  Layers,
  Folder,
} from 'lucide-react';

export const ICON_COMPONENTS = {
  Briefcase,
  GraduationCap,
  User,
  FolderKanban,
  ShoppingBag,
  Code,
  BookOpen,
  HeartPulse,
  Home,
  Coffee,
  Sparkles,
  Layers,
  Folder,
};

export function getCategoryIcon(iconName, className = 'w-4 h-4') {
  const IconComponent = ICON_COMPONENTS[iconName] || Folder;
  return <IconComponent className={className} />;
}
