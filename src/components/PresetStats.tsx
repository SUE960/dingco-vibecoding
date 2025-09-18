'use client';

import { useState, useEffect } from 'react';
import { BarChart, TrendingUp, Users, Database } from 'lucide-react';
import { getPresetStats } from '@/utils/presetStorage';

export default function PresetStats() {
  const [stats, setStats] = useState({
    totalCustomPresets: 0,
    totalCollectedData: 0,
    mostCommonSizes: [],
    recentAdditions: []
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setStats(getPresetStats());
    };

    updateStats();
    
    // 1분마다 통계 업데이트
    const interval = setInterval(updateStats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors shadow-lg"
        title="규격 통계 보기"
      >
        <BarChart className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5" />
          수집 통계
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-500 hover:text-slate-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-800">커스텀 규격</span>
            </div>
            <div className="text-lg font-bold text-blue-900">
              {stats.totalCustomPresets}
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-800">수집 데이터</span>
            </div>
            <div className="text-lg font-bold text-green-900">
              {stats.totalCollectedData}
            </div>
          </div>
        </div>

        {stats.mostCommonSizes.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">인기 규격</h4>
            <div className="space-y-1">
              {stats.mostCommonSizes.map((item: any, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="text-slate-600">{item.size}px</span>
                  <span className="font-medium text-slate-900">{item.count}회</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.recentAdditions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">최근 추가</h4>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {stats.recentAdditions.map((item: any, index) => (
                <div key={index} className="text-xs text-slate-600">
                  {item.preset.name} ({item.preset.width}×{item.preset.height})
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            데이터는 로컬에 저장되며, 다른 사용자들에게 도움이 되는 규격 정보로 활용됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
