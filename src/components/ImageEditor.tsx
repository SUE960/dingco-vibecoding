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
  const [useBackground, setUseBackground] = useState(false);
  
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
      
      const imageAspectRatio = naturalWidth / naturalHeight;
      let cropWidth, cropHeight;

      if (imageAspectRatio > aspectRatio) {
        // 이미지가 프리셋보다 가로로 넓은 경우, 높이에 맞춰서 crop 너비 계산
        cropHeight = 80;
        cropWidth = (cropHeight * aspectRatio) / imageAspectRatio;
      } else {
        // 이미지가 프리셋보다 세로로 길거나 같은 경우, 너비에 맞춰서 crop 높이 계산
        cropWidth = 80;
        cropHeight = (cropWidth / aspectRatio) * imageAspectRatio;
      }
      
      setCrop({
        unit: '%',
        x: (100 - cropWidth) / 2,
        y: (100 - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight,
      });
    }
  }, [selectedPreset]);

  // 이미지를 캔버스에 그리는 공통 함수
  const drawImageToCanvas = useCallback((canvas: HTMLCanvasElement, outputWidth?: number, outputHeight?: number, useCompletedCrop = true) => {
    const image = imgRef.current;
    const cropToUse = useCompletedCrop ? completedCrop : crop;

    if (!image) {
      return false;
    }

    // 크롭이 없으면 전체 이미지를 기본 크롭으로 사용
    const defaultCrop = {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
      unit: 'px' as const
    };
    
    const finalCrop = cropToUse || defaultCrop;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return false;
    }

    // 출력 크기 설정
    const finalWidth = outputWidth || selectedPreset?.width || 400;
    const finalHeight = outputHeight || selectedPreset?.height || 400;

    const pixelRatio = window.devicePixelRatio;
    canvas.width = finalWidth * pixelRatio;
    canvas.height = finalHeight * pixelRatio;
    
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    // 배경 설정 (사용자가 배경을 원하는 경우에만 적용)
    if (useBackground && selectedPreset?.bgColor) {
      ctx.fillStyle = selectedPreset.bgColor;
      ctx.fillRect(0, 0, finalWidth, finalHeight);
    }

    // 이미지 크기 및 크롭 영역 계산 (실제 이미지 좌표로 변환)
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    // 퍼센트 단위인 경우 픽셀로 변환
    let sourceX, sourceY, sourceWidth, sourceHeight;
    if (finalCrop.unit === '%') {
      sourceX = (finalCrop.x / 100) * image.naturalWidth;
      sourceY = (finalCrop.y / 100) * image.naturalHeight;
      sourceWidth = (finalCrop.width / 100) * image.naturalWidth;
      sourceHeight = (finalCrop.height / 100) * image.naturalHeight;
    } else {
      sourceX = finalCrop.x * scaleX;
      sourceY = finalCrop.y * scaleY;
      sourceWidth = finalCrop.width * scaleX;
      sourceHeight = finalCrop.height * scaleY;
    }

    // 임시 캔버스에 크롭된 이미지를 먼저 그리기
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sourceWidth;
    tempCanvas.height = sourceHeight;
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) {
      return false;
    }

    // 크롭된 이미지를 임시 캔버스에 그리기
    tempCtx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      sourceWidth,
      sourceHeight
    );

    // 최종 캔버스 중심점
    const centerX = finalWidth / 2;
    const centerY = finalHeight / 2;

    ctx.save();

    // 변환 적용: 중심점으로 이동 -> 회전 -> 확대/축소
    ctx.translate(centerX, centerY);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(scale, scale);

    // 크롭된 이미지를 최종 크기에 맞게 그리기
    const aspectRatio = sourceWidth / sourceHeight;
    let drawWidth, drawHeight;

    if (aspectRatio > finalWidth / finalHeight) {
      // 이미지가 더 넓은 경우
      drawWidth = finalWidth * 0.95;
      drawHeight = drawWidth / aspectRatio;
    } else {
      // 이미지가 더 높은 경우
      drawHeight = finalHeight * 0.95;
      drawWidth = drawHeight * aspectRatio;
    }

    // 크롭된 이미지를 중앙에 배치
    ctx.drawImage(
      tempCanvas,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );

    ctx.restore();
    return true;
  }, [completedCrop, crop, scale, rotate, selectedPreset, useBackground]);

  // 미리보기 캔버스 업데이트 (이미지 로드 후 즉시 실행)
  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imgRef.current;
    
    if (!canvas || !image || !imageSrc) return;

    // 이미지가 로드된 후 작은 딜레이를 두고 미리보기 생성
    const timer = setTimeout(() => {
      drawImageToCanvas(canvas);
    }, 100);

    return () => clearTimeout(timer);
  }, [drawImageToCanvas, imageSrc]);

  // 크롭이 변경되면 실시간 미리보기 업데이트
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;

    drawImageToCanvas(canvas, undefined, undefined, false);
  }, [drawImageToCanvas, crop, imageSrc]);

  // completedCrop이 변경되면 최종 크롭으로 미리보기 업데이트
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !completedCrop || !imageSrc) return;

    drawImageToCanvas(canvas);
  }, [drawImageToCanvas, completedCrop, imageSrc]);

  const generateDownload = useCallback(async () => {
    // 고해상도 다운로드를 위한 별도 캔버스 생성
    const downloadCanvas = document.createElement('canvas');
    
    // 실제 프리셋 크기로 렌더링
    const success = drawImageToCanvas(
      downloadCanvas, 
      selectedPreset?.width, 
      selectedPreset?.height
    );

    if (!success) {
      alert('이미지 생성에 실패했습니다. 크롭 영역을 설정해주세요.');
      return;
    }

    const blob = await new Promise<Blob | null>((resolve) => 
      downloadCanvas.toBlob(
        (b) => resolve(b),
        'image/png',
        1
      )
    );

    if (!blob) {
      alert('이미지 변환에 실패했습니다.');
      return;
    }

    if (onDownload) {
      onDownload(blob);
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `사원증사진_${selectedPreset?.name || '편집본'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [drawImageToCanvas, selectedPreset, onDownload]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        {/* 컨트롤 패널 */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-5 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-700">확대/축소</label>
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
              <button
                onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                title="축소"
              >
                <ZoomOut className="w-4 h-4 text-slate-600" />
              </button>
              <span className="text-sm font-medium text-slate-700 min-w-[3rem] text-center px-2">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale(s => Math.min(3, s + 0.1))}
                className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                title="확대"
              >
                <ZoomIn className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            <button
              onClick={() => setScale(1)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-700 hover:bg-white border border-slate-200 rounded-md transition-colors"
              title="확대/축소 초기화"
            >
              초기화
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-700">회전</label>
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
              <button
                onClick={() => setRotate(r => r - 90)}
                className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                title="반시계방향 90도 회전"
              >
                <RotateCcw className="w-4 h-4 text-slate-600" />
              </button>
              <span className="text-sm font-medium text-slate-700 min-w-[3rem] text-center px-2">
                {rotate}°
              </span>
              <button
                onClick={() => setRotate(r => r + 90)}
                className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                title="시계방향 90도 회전"
              >
                <RotateCcw className="w-4 h-4 text-slate-600 transform scale-x-[-1]" />
              </button>
            </div>
            <button
              onClick={() => setRotate(0)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-700 hover:bg-white border border-slate-200 rounded-md transition-colors"
              title="회전 초기화"
            >
              초기화
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-700">배경</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useBackground}
                onChange={(e) => setUseBackground(e.target.checked)}
                className="w-4 h-4 text-slate-900 bg-white border-slate-300 rounded focus:ring-slate-500 focus:ring-2"
              />
              <span className="text-sm text-slate-600">
                {selectedPreset?.bgColor ? '배경색 적용' : '기본 배경'}
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => {
                setScale(1);
                setRotate(0);
                setUseBackground(false);
                setCrop({
                  unit: '%',
                  x: 10,
                  y: 10,
                  width: 80,
                  height: 80,
                });
              }}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              title="모든 편집 내용 초기화"
            >
              전체 초기화
            </button>

            <button
              onClick={generateDownload}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!completedCrop}
            >
              <Download className="w-4 h-4" />
              다운로드
            </button>
          </div>
        </div>

        {/* 이미지 편집 영역 */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 크롭 영역 */}
          <div className="flex-1">
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
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
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <CropIcon className="w-4 h-4" />
              <span>드래그하여 크롭 영역을 조정하세요</span>
            </div>
          </div>

          {/* 미리보기 */}
          <div className="lg:w-80">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">미리보기</h3>
              <div className="flex justify-center">
                <div
                  className="border border-slate-300 rounded-lg shadow-sm overflow-hidden"
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
                <div className="mt-4 text-center space-y-1">
                  <p className="text-sm font-semibold text-slate-900">{selectedPreset.name}</p>
                  <p className="text-xs text-slate-500">
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


