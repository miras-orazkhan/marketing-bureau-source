'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

type SortableItemProps = {
  id: string
  children: React.ReactNode
}

/**
 * Обёртка для элемента списка, который можно перетаскивать.
 * Добавляет drag-handle (GripVertical иконка) и применяет transform
 * во время перетаскивания.
 */
function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-stretch ${isDragging ? 'ring-2 ring-primary rounded-lg' : ''}`}
    >
      {/* Drag handle — отдельная зона, чтобы клики по контенту работали */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="flex items-center px-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        aria-label="Перетащить для сортировки"
        title="Перетащите для изменения порядка"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

type SortableListProps<T extends { id: string }> = {
  items: T[]
  /** Вызывается при изменении порядка. Получает новый массив items. */
  onReorder: (items: T[]) => void
  /** Рендер одного элемента списка. */
  renderItem: (item: T) => React.ReactNode
}

/**
 * Переиспользуемый drag-and-drop список.
 *
 * Использование:
 *   <SortableList
 *     items={items}
 *     onReorder={(newItems) => {
 *       setItems(newItems)
 *       // Сохранить новый порядок на сервере:
 *       newItems.forEach((item, idx) => onUpdate(item.id, { sortOrder: idx }))
 *     }}
 *     renderItem={(item) => <Card>...{item.title}...</Card>}
 *   />
 */
export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Требуем движения на 5px прежде чем начать drag — чтобы клики работали
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    const newItems = arrayMove(items, oldIndex, newIndex)
    onReorder(newItems)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              {renderItem(item)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
