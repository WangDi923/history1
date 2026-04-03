'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ScriptGeneratorFormProps {
  onGenerate?: (scriptId: string, content: string) => void;
}

export function ScriptGeneratorForm({ onGenerate }: ScriptGeneratorFormProps) {
  const [eventName, setEventName] = useState('');
  const [teachingObjective, setTeachingObjective] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/scripts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName,
          teachingObjective,
          gradeLevel,
          durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : null,
        }),
      });

      const responseText = await response.text();
      let data: { error?: string; scriptId?: string; content?: string } = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          if (!response.ok) {
            setError(`請求失敗（${response.status}）：服務返回了非 JSON 響應`);
            return;
          }
          setError('服務返回格式異常，請稍後重試');
          return;
        }
      }

      if (!response.ok) {
        setError(data.error || `Failed to generate script (${response.status})`);
        return;
      }

      if (!data.scriptId || !data.content) {
        setError('生成結果不完整，請稍後重試');
        return;
      }

      setSuccess('劇本生成成功！');
      if (onGenerate) {
        onGenerate(data.scriptId, data.content);
      }

      // 重置表单
      setEventName('');
      setTeachingObjective('');
      setGradeLevel('');
      setDurationMinutes('45');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#fbf8f1] border-2 border-double border-[#d4c4b7] rounded shadow-[4px_4px_0px_rgba(139,38,38,0.1)] p-8 mb-8 relative font-serif text-stone-800">
      <div className="absolute top-0 right-8 w-8 h-12 bg-[#8b2626] flex items-center justify-center -translate-y-2 rounded-b shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
        <span className="text-[#fbf8f1] font-bold text-xs font-serif writing-vertical-rl">撰</span>
      </div>
      
      <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-[#8b2626] block"></span>
        敬撰史劇編演卷
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50/80 border-l-4 border-red-700 text-red-900 rounded-r">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-50/80 border-l-4 border-emerald-700 text-emerald-900 rounded-r">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {/* 歷史事件 */}
        <div>
          <label htmlFor="eventName" className="block text-base font-bold text-stone-900 mb-2">
            史劇選題 (歷史事件) <span className="text-[#8b2626]">*</span>
          </label>
          <input
            id="eventName"
            type="text"
            required
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="例如：鴻門宴、赤壁之戰"
            className="w-full px-4 py-3 bg-white/50 border border-[#d4c4b7] shadow-inner rounded focus:outline-none focus:ring-1 focus:ring-[#8b2626] focus:border-[#8b2626] transition-colors"
          />
          <p className="text-sm text-stone-500 mt-2">選定即將搬上舞台的歷史節點</p>
        </div>

        {/* 教學目標 */}
        <div>
          <label htmlFor="objective" className="block text-base font-bold text-stone-900 mb-2">
            傳道宗旨 (教學目標) <span className="text-[#8b2626]">*</span>
          </label>
          <textarea
            id="objective"
            required
            value={teachingObjective}
            onChange={(e) => setTeachingObjective(e.target.value)}
            placeholder="例如：揭示秦末楚漢相爭背後的政治博弈與人物性格..."
            rows={4}
            className="w-full px-4 py-3 bg-white/50 border border-[#d4c4b7] shadow-inner rounded focus:outline-none focus:ring-1 focus:ring-[#8b2626] focus:border-[#8b2626] transition-colors resize-y"
          />
          <p className="text-sm text-stone-500 mt-2">闡明此番推演所冀望達成的教化之功</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 年級 */}
          <div>
            <label htmlFor="gradeLevel" className="block text-base font-bold text-stone-900 mb-2">
              受教齋堂 (適用年級) <span className="text-stone-400 font-normal text-sm ml-1">選填</span>
            </label>
            <input
              id="gradeLevel"
              type="text"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              placeholder="例如：高一甲班、初二生"
              className="w-full px-4 py-3 bg-white/50 border border-[#d4c4b7] shadow-inner rounded focus:outline-none focus:ring-1 focus:ring-[#8b2626] focus:border-[#8b2626] transition-colors"
            />
          </div>

          {/* 課時長度 */}
          <div>
            <label htmlFor="duration" className="block text-base font-bold text-stone-900 mb-2">
              演卷時長 (課時/分鐘)
            </label>
            <input
              id="duration"
              type="number"
              min="15"
              max="180"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-[#d4c4b7] shadow-inner rounded focus:outline-none focus:ring-1 focus:ring-[#8b2626] focus:border-[#8b2626] transition-colors"
            />
          </div>
        </div>

        {/* 提交按鈕 */}
        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#8b2626] hover:bg-[#701e1e] text-[#fbf8f1] font-bold text-lg py-6 rounded shadow-[3px_3px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all"
          >
            {loading ? '文淵閣構思中...' : '執筆落印'}
          </Button>
        </div>
      </div>
    </form>
  );
}
