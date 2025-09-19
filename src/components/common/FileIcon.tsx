// src/components/common/FileIcon.tsx

import React from 'react';
import { FileText, Image, File } from 'lucide-react';

interface FileIconProps {
  fileType?: string;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ fileType, className = "h-6 w-6" }) => {
  const getIcon = () => {
    if (!fileType) return File;
    
    if (fileType.startsWith('image/')) return Image;
    if (fileType.includes('pdf') || fileType.includes('document')) return FileText;
    
    return File;
  };

  const Icon = getIcon();
  
  const getColor = () => {
    if (!fileType) return 'text-gray-500';
    
    if (fileType.startsWith('image/')) return 'text-green-500';
    if (fileType.includes('pdf')) return 'text-red-500';
    if (fileType.includes('document')) return 'text-blue-500';
    
    return 'text-gray-500';
  };

  return <Icon className={`${className} ${getColor()}`} />;
};