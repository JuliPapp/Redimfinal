import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical } from 'lucide-react';

type DraggableModuleProps = {
  id: string;
  index: number;
  isEditMode: boolean;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
};

const MODULE_TYPE = 'HOME_MODULE';

export function DraggableModule({ id, index, isEditMode, onMove, children }: DraggableModuleProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: MODULE_TYPE,
    item: { id, index },
    canDrag: isEditMode,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: MODULE_TYPE,
    hover: (item: { id: string; index: number }, monitor) => {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      
      if (!clientOffset) return;
      
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  if (isEditMode) {
    drag(drop(ref));
  }

  return (
    <div
      ref={ref}
      className={`relative transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'} ${
        isEditMode ? 'cursor-move' : ''
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {isEditMode && (
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-primary/10 rounded p-1 cursor-grab active:cursor-grabbing">
          <GripVertical className="w-5 h-5 text-primary" />
        </div>
      )}
      <div className={isEditMode ? 'ml-6' : ''}>
        {children}
      </div>
    </div>
  );
}
