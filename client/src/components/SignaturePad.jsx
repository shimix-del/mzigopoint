import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check } from 'lucide-react';

export default function SignaturePad({ onSave, onCancel }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0F2A4A';
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (isDrawing) {
      e.preventDefault();
      setIsDrawing(false);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirm = () => {
    if (!hasDrawn) {
      alert('Please provide a signature before saving.');
      return;
    }
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-3 space-y-2">
      <div className="flex justify-between items-center text-xs text-gray-500 pb-1">
        <span>Collector Digital Signature (Draw with finger or mouse)</span>
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 overflow-hidden relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={130}
          className="w-full h-32 touch-none cursor-crosshair bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-300 text-xs italic">
            Sign here to confirm receipt of items
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleConfirm}
          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Confirm Signature</span>
        </button>
      </div>
    </div>
  );
}
