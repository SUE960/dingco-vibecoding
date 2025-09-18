import { PhotoSpec } from '@/components/CompanyPresets';

// 로컬 스토리지 키
const CUSTOM_PRESETS_KEY = 'custom_presets';
const COLLECTED_DATA_KEY = 'collected_preset_data';

// 사용자 정의 프리셋 저장
export const saveCustomPreset = (preset: PhotoSpec) => {
  try {
    const existingPresets = getCustomPresets();
    const updatedPresets = [...existingPresets, preset];
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(updatedPresets));
    return true;
  } catch (error) {
    console.error('Failed to save custom preset:', error);
    return false;
  }
};

// 사용자 정의 프리셋 불러오기
export const getCustomPresets = (): PhotoSpec[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_PRESETS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load custom presets:', error);
    return [];
  }
};

// 데이터 수집용 (실제 환경에서는 서버로 전송)
export const collectPresetData = (data: {
  preset: PhotoSpec;
  contactEmail?: string;
  timestamp: string;
}) => {
  try {
    // 로컬에서는 콘솔 로그로 시뮬레이션
    console.log('🔍 새로운 사원증 규격 데이터 수집:', data);
    
    // 실제로는 API 호출
    // await fetch('/api/collect-preset', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });

    // 로컬 저장소에 수집 데이터 기록 (통계용)
    const existingData = getCollectedData();
    const updatedData = [...existingData, data];
    localStorage.setItem(COLLECTED_DATA_KEY, JSON.stringify(updatedData));
    
    return true;
  } catch (error) {
    console.error('Failed to collect preset data:', error);
    return false;
  }
};

// 수집된 데이터 조회 (관리자용)
export const getCollectedData = () => {
  try {
    const stored = localStorage.getItem(COLLECTED_DATA_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load collected data:', error);
    return [];
  }
};

// 통계 조회
export const getPresetStats = () => {
  const collectedData = getCollectedData();
  const customPresets = getCustomPresets();
  
  return {
    totalCustomPresets: customPresets.length,
    totalCollectedData: collectedData.length,
    mostCommonSizes: getMostCommonSizes(collectedData),
    recentAdditions: collectedData.slice(-5)
  };
};

// 가장 많이 사용되는 규격 분석
const getMostCommonSizes = (data: any[]) => {
  const sizeCount: Record<string, number> = {};
  
  data.forEach(item => {
    const key = `${item.preset.width}x${item.preset.height}`;
    sizeCount[key] = (sizeCount[key] || 0) + 1;
  });
  
  return Object.entries(sizeCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([size, count]) => ({ size, count }));
};
