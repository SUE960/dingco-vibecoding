'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Download, RotateCcw, ZoomIn, ZoomOut, Crop as CropIcon } from 'lucide-react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { PhotoSpec } from './CompanyPresets';

interface ImageEditorProps {
  imageFile: File;
  selectedPreset?: PhotoSpec;
  onDownload?: (blob: Blob) => void;
}

export default function ImageEditor({ imageFile, selectedPreset, onDownload }: ImageEditorProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 이미지 파일을 Data URL로 변환
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  // 선택된 프리셋에 따라 aspect ratio 설정
  useEffect(() => {
    if (selectedPreset) {
      const aspectRatio = selectedPreset.width / selectedPreset.height;
      setAspect(aspectRatio);
      setCrop(prevCrop => ({
        ...prevCrop,
        aspect: aspectRatio,
      }));
    }
  }, [selectedPreset]);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    
    if (selectedPreset) {
      const aspectRatio = selectedPreset.width / selectedPreset.height;
      
      // 이미지 중앙에 crop 영역 설정
      const cropWidth = Math.min(80, (naturalHeight * aspectRatio / naturalWidth) * 100);
      const cropHeight = Math.min(80, (naturalWidth / aspectRatio / naturalHeight) * 100);
      
      setCrop({
        unit: '%',
        x: (100 - cropWidth) / 2,
        y: (100 - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight,
      });
    }
  }, [selectedPreset]);

  const generateDownload = useCallback(async () => {
    const image = imgRef.current;
    const canvas = canvasRef.current;
    const crop = completedCrop;

    if (!image || !canvas || !crop) {
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      selectedPreset?.width || crop.width,
      selectedPreset?.height || crop.height
    );
    const ctx = offscreen.getContext('2d');

    if (!ctx) {
      return;
    }

    // 배경색 설정
    if (selectedPreset?.bgColor) {
      ctx.fillStyle = selectedPreset.bgColor;
      ctx.fillRect(0, 0, offscreen.width, offscreen.height);
    }

    // 이미지 그리기
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      offscreen.width,
      offscreen.height
    );

    const blob = await offscreen.convertToBlob({
      type: 'image/png',
    });

    if (onDownload) {
      onDownload(blob);
    } else {
      // 기본 다운로드 동작
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `사원증사진_${selectedPreset?.name || '편집본'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [completedCrop, selectedPreset, onDownload]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* 컨트롤 패널 */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">확대/축소:</label>
            <button
              onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
              className="p-2 hover:bg-gray-200 rounded"
              title="축소"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 min-w-[3rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale(s => Math.min(2, s + 0.1))}
              className="p-2 hover:bg-gray-200 rounded"
              title="확대"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">회전:</label>
            <button
              onClick={() => setRotate(r => r - 90)}
              className="p-2 hover:bg-gray-200 rounded"
              title="90도 회전"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 min-w-[3rem] text-center">
              {rotate}°
            </span>
          </div>

          <button
            onClick={generateDownload}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={!completedCrop}
          >
            <Download className="w-4 h-4" />
            다운로드
          </button>
        </div>

        {/* 이미지 편집 영역 */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 크롭 영역 */}
          <div className="flex-1">
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              {imageSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  minWidth={50}
                  minHeight={50}
                >
                  <img
                    ref={imgRef}
                    alt="편집할 이미지"
                    src={imageSrc}
                    style={{
                      transform: `scale(${scale}) rotate(${rotate}deg)`,
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
              <CropIcon className="w-4 h-4" />
              드래그하여 크롭 영역을 조정하세요
            </p>
          </div>

          {/* 미리보기 */}
          <div className="lg:w-80">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">미리보기</h3>
              <div className="flex justify-center">
                <div
                  className="border-2 border-gray-300 rounded"
                  style={{
                    width: selectedPreset ? Math.min(200, selectedPreset.width / 2) : 150,
                    height: selectedPreset ? Math.min(200, selectedPreset.height / 2) : 200,
                    backgroundColor: selectedPreset?.bgColor || '#ffffff',
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              </div>
              {selectedPreset && (
                <div className="mt-3 text-center">
                  <p className="text-sm font-medium text-gray-900">{selectedPreset.name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedPreset.width} × {selectedPreset.height}px
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


