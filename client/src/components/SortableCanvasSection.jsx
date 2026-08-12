import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableCanvasSection({
  id,
  index,
  title,
  isEditMode,
  onDuplicate,
  onDelete,
  children
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative'
  };

  if (!isEditMode) {
    return <div className="w-full min-w-0 max-w-full">{children}</div>;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group/sec w-full min-w-0 max-w-full transition-shadow my-1 ${
        isDragging ? 'ring-2 ring-brand-500 ring-offset-2 rounded-2xl shadow-2xl bg-slate-900/10' : 'hover:ring-1 hover:ring-brand-500/40 rounded-2xl'
      }`}
    >
      {/* Editor Floating Section Toolbar with Drag Handle */}
      <div className="opacity-0 group-hover/sec:opacity-100 absolute top-3 left-4 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/90 rounded-xl p-1.5 text-white flex items-center space-x-2 shadow-2xl transition-opacity">
        {/* Dedicated Drag Handle Button (Only dragging from this handle starts movement) */}
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 active:bg-brand-600 rounded-lg text-[10px] font-extrabold uppercase text-amber-300 flex items-center space-x-1 cursor-grab active:cursor-grabbing select-none shadow-sm"
          title="Click & Drag handle to reorder section"
        >
          <span className="text-xs font-mono font-black">⋮⋮</span>
          <span>Drag</span>
        </button>

        <span className="text-[10px] font-extrabold uppercase text-slate-200 px-1 truncate max-w-[140px] font-display">
          {title}
        </span>

        {onDuplicate && (
          <button
            type="button"
            onClick={() => onDuplicate(index)}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
            title="Duplicate Section"
          >
            📋
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(index)}
            className="p-1 hover:bg-red-500/20 rounded-lg text-slate-300 hover:text-red-400 transition-colors"
            title="Delete Section"
          >
            🗑
          </button>
        )}
      </div>

      {children}
    </div>
  );
}
