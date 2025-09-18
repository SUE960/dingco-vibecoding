'use client';

import { Upload, Camera } from 'lucide-react';
import { useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isUploading?: boolean;
}

export default function ImageUploader({ onImageUpload, isUploading = false }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="border-2 border-dashed border-slate-300 bg-white rounded-xl p-10 text-center hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            <p className="mt-4 text-slate-600 font-medium">업로드 중...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-6">
              <Upload className="w-8 h-8 text-slate-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              증명사진을 업로드하세요
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              파일을 드래그하거나 클릭하여 선택하세요
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Camera className="w-4 h-4" />
              <span>JPG, PNG, WEBP 지원</span>
            </div>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

