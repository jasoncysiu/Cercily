"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Minus, Maximize, X, Plus, Edit3 } from "lucide-react"

interface CanvasItem {
  id: string
  type: "decision" | "factor" | "outcome" | "model" | "note"
  title: string
  content: string
  x: number
  y: number
  color: string
}

interface VisualCanvasProps {
  problem: string
  activeModels: any[]
  canvasItems?: any[]
}

export function VisualCanvas({ problem, activeModels, canvasItems = [] }: VisualCanvasProps) {
  const [items, setItems] = useState<CanvasItem[]>([])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<"title" | "content" | null>(null)
  const [editValue, setEditValue] = useState("")
  const canvasRef = useRef<HTMLDivElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const editTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Initialize items from AI-generated canvas items
  useEffect(() => {
    if (canvasItems.length > 0) {
      const initialItems = canvasItems.map((item: any) => ({
        ...item,
        color: getColorForType(item.type),
      }))
      setItems(initialItems)
    } else {
      // Fallback default items
      setItems([
        {
          id: "main-decision",
          type: "decision",
          title: "Your Decision",
          content: problem,
          x: 200,
          y: 30,
          color: "bg-blue-100 border-blue-300",
        },
        {
          id: "option-1",
          type: "outcome",
          title: "Yes",
          content: "Proceed with this choice",
          x: 50,
          y: 150,
          color: "bg-green-100 border-green-300",
        },
        {
          id: "option-2",
          type: "outcome",
          title: "No",
          content: "Decline or wait",
          x: 350,
          y: 150,
          color: "bg-orange-100 border-orange-300",
        },
      ])
    }
  }, [canvasItems, problem])

  const getColorForType = (type: string) => {
    switch (type) {
      case "decision":
        return "bg-blue-100 border-blue-300"
      case "outcome":
        return "bg-green-100 border-green-300"
      case "factor":
        return "bg-purple-100 border-purple-300"
      case "model":
        return "bg-indigo-100 border-indigo-300"
      case "note":
        return "bg-yellow-100 border-yellow-300"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, itemId: string) => {
      if (editingItem) return // Don't drag while editing

      // Don't start dragging if clicking on editable content
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return

      const item = items.find((i) => i.id === itemId)
      if (!item) return

      const rect = e.currentTarget.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setDraggedItem(itemId)
    },
    [items, editingItem],
  )

  // Touch support for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent, itemId: string) => {
      if (editingItem) return

      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return

      const item = items.find((i) => i.id === itemId)
      if (!item) return

      const touch = e.touches[0]
      const rect = e.currentTarget.getBoundingClientRect()
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      })
      setDraggedItem(itemId)
    },
    [items, editingItem],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggedItem || !canvasRef.current || editingItem) return

      const canvasRect = canvasRef.current.getBoundingClientRect()
      const newX = e.clientX - canvasRect.left - dragOffset.x
      const newY = e.clientY - canvasRect.top - dragOffset.y

      setItems((prev) =>
        prev.map((item) =>
          item.id === draggedItem
            ? {
                ...item,
                x: Math.max(0, Math.min(newX, canvasRect.width - 180)),
                y: Math.max(0, Math.min(newY, canvasRect.height - 100)),
              }
            : item,
        ),
      )
    },
    [draggedItem, dragOffset, editingItem],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!draggedItem || !canvasRef.current || editingItem) return

      const touch = e.touches[0]
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const newX = touch.clientX - canvasRect.left - dragOffset.x
      const newY = touch.clientY - canvasRect.top - dragOffset.y

      setItems((prev) =>
        prev.map((item) =>
          item.id === draggedItem
            ? {
                ...item,
                x: Math.max(0, Math.min(newX, canvasRect.width - 180)),
                y: Math.max(0, Math.min(newY, canvasRect.height - 100)),
              }
            : item,
        ),
      )
    },
    [draggedItem, dragOffset, editingItem],
  )

  const handleMouseUp = useCallback(() => {
    setDraggedItem(null)
  }, [])

  const handleTouchEnd = useCallback(() => {
    setDraggedItem(null)
  }, [])

  const startEditing = (itemId: string, field: "title" | "content") => {
    const item = items.find((i) => i.id === itemId)
    if (!item) return

    setEditingItem(itemId)
    setEditingField(field)
    setEditValue(field === "title" ? item.title : item.content)

    // Focus the input after state update
    setTimeout(() => {
      if (field === "title" && editInputRef.current) {
        editInputRef.current.focus()
        editInputRef.current.select()
      } else if (field === "content" && editTextareaRef.current) {
        editTextareaRef.current.focus()
        editTextareaRef.current.select()
      }
    }, 0)
  }

  const saveEdit = () => {
    if (!editingItem || !editingField) return

    setItems((prev) =>
      prev.map((item) =>
        item.id === editingItem
          ? {
              ...item,
              [editingField]: editValue,
            }
          : item,
      ),
    )

    setEditingItem(null)
    setEditingField(null)
    setEditValue("")
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setEditingField(null)
    setEditValue("")
  }

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const addNote = () => {
    if (!newNoteTitle.trim()) return

    const newNote: CanvasItem = {
      id: `note-${Date.now()}`,
      type: "note",
      title: newNoteTitle,
      content: newNoteContent,
      x: Math.random() * 200 + 100,
      y: Math.random() * 100 + 200,
      color: "bg-yellow-100 border-yellow-300",
    }

    setItems((prev) => [...prev, newNote])
    setNewNoteTitle("")
    setNewNoteContent("")
    setShowAddNote(false)
  }

  const resetCanvas = () => {
    // Reset to original AI-generated items
    if (canvasItems.length > 0) {
      const resetItems = canvasItems.map((item: any) => ({
        ...item,
        color: getColorForType(item.type),
      }))
      setItems(resetItems)
    } else {
      setItems([
        {
          id: "main-decision",
          type: "decision",
          title: "Your Decision",
          content: problem,
          x: 200,
          y: 30,
          color: "bg-blue-100 border-blue-300",
        },
        {
          id: "option-1",
          type: "outcome",
          title: "Yes",
          content: "Proceed with this choice",
          x: 50,
          y: 150,
          color: "bg-green-100 border-green-300",
        },
        {
          id: "option-2",
          title: "No",
          content: "Decline or wait",
          x: 350,
          y: 150,
          color: "bg-orange-100 border-orange-300",
        },
      ])
    }
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case "decision":
        return "❓"
      case "outcome":
        return "🎯"
      case "factor":
        return "⚡"
      case "model":
        return "🧠"
      case "note":
        return "📝"
      default:
        return "📝"
    }
  }

  const CanvasContent = () => (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-base">Interactive Decision Map</h4>
          <Badge variant="secondary" className="text-xs">
            {items.length} items
          </Badge>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setShowAddNote(true)} className="text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Add Note
          </Button>
          {!isFullScreen && (
            <Button variant="outline" size="sm" onClick={() => setIsFullScreen(true)} className="text-xs">
              <Maximize className="h-3 w-3 mr-1" />
              Full Screen
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={resetCanvas} className="text-xs bg-transparent">
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Add Note Modal */}
      {showAddNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 md:p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add Your Note</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  ref={titleInputRef}
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Note title..."
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  ref={contentTextareaRef}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your thoughts..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddNote(false)
                    setNewNoteTitle("")
                    setNewNoteContent("")
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={addNote} disabled={!newNoteTitle.trim()}>
                  Add Note
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`relative w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-auto touch-none ${ // Changed overflow-hidden to overflow-auto
          isFullScreen ? "h-[80vh]" : "h-64 md:h-96"
        }`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {items.find((i) => i.id === "main-decision") && items.find((i) => i.id === "option-1") && (
            <line
              x1={(items.find((i) => i.id === "main-decision")?.x || 0) + 90}
              y1={(items.find((i) => i.id === "main-decision")?.y || 0) + 50}
              x2={(items.find((i) => i.id === "option-1")?.x || 0) + 90}
              y2={(items.find((i) => i.id === "option-1")?.y || 0) + 25}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
          {items.find((i) => i.id === "main-decision") && items.find((i) => i.id === "option-2") && (
            <line
              x1={(items.find((i) => i.id === "main-decision")?.x || 0) + 90}
              y1={(items.find((i) => i.id === "main-decision")?.y || 0) + 50}
              x2={(items.find((i) => i.id === "option-2")?.x || 0) + 90}
              y2={(items.find((i) => i.id === "option-2")?.y || 0) + 25}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
        </svg>

        {/* Canvas Items */}
        {items.map((item) => (
          <div
            key={item.id}
            className={`absolute transition-shadow hover:shadow-lg ${item.color} border-2 rounded-lg p-4 md:p-5 min-w-[160px] md:min-w-[180px] max-w-[180px] md:max-w-[200px] ${
              editingItem === item.id ? "ring-2 ring-blue-500" : "cursor-move"
            }`}
            style={{
              left: item.x,
              top: item.y,
              zIndex: draggedItem === item.id ? 10 : editingItem === item.id ? 9 : 1,
            }}
            onMouseDown={(e) => handleMouseDown(e, item.id)}
            onTouchStart={(e) => handleTouchStart(e, item.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-base md:text-lg">{getItemIcon(item.type)}</span>
                <Badge variant="outline" className="text-xs">
                  {item.type}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                {(item.type === "note" || item.type === "factor") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 md:h-6 md:w-6 p-0 hover:bg-blue-100"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      startEditing(item.id, "title")
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <Edit3 className="h-2 w-2 md:h-3 md:w-3" />
                  </Button>
                )}
                {(item.type === "model" || item.type === "note") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 md:h-6 md:w-6 p-0 hover:bg-red-100"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeItem(item.id)
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <Minus className="h-2 w-2 md:h-3 md:w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Title */}
            {editingItem === item.id && editingField === "title" ? (
              <div className="mb-2">
                <input
                  ref={editInputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onFocus={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="w-full text-xs md:text-sm font-semibold bg-white border border-blue-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    e.stopPropagation()
                    if (e.key === "Enter") saveEdit()
                    if (e.key === "Escape") cancelEdit()
                  }}
                  onBlur={saveEdit}
                />
              </div>
            ) : (
              <h5
                className="font-semibold text-xs md:text-sm mb-1 cursor-pointer hover:bg-white hover:bg-opacity-50 rounded px-1 py-0.5"
                onClick={(e) => {
                  if (item.type === "note" || item.type === "factor") {
                    e.preventDefault()
                    e.stopPropagation()
                    startEditing(item.id, "title")
                  }
                }}
                onMouseDown={(e) => {
                  if (item.type === "note" || item.type === "factor") {
                    e.stopPropagation()
                  }
                }}
                onTouchStart={(e) => {
                  if (item.type === "note" || item.type === "factor") {
                    e.stopPropagation()
                  }
                }}
              >
                {item.title}
              </h5>
            )}

            {/* Content */}
            {editingItem === item.id && editingField === "content" ? (
              <div>
                <textarea
                  ref={editTextareaRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onFocus={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="w-full text-xs bg-white border border-blue-300 rounded px-1 py-0.5 h-12 md:h-16 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    e.stopPropagation()
                    if (e.key === "Enter" && e.ctrlKey) saveEdit()
                    if (e.key === "Escape") cancelEdit()
                  }}
                  onBlur={saveEdit}
                />
                <div className="text-xs text-gray-500 mt-1">Ctrl+Enter to save, Esc to cancel</div>
              </div>
            ) : (
              <p
                className="text-xs text-gray-600 line-clamp-2 cursor-pointer hover:bg-white hover:bg-opacity-50 rounded px-1 py-0.5"
                onClick={(e) => {
                  if (item.type === "note" || item.type === "factor") {
                    e.preventDefault()
                    e.stopPropagation()
                    startEditing(item.id, "content")
                  }
                }}
                onMouseDown={(e) => {
                  if (item.type === "note" || item.type === "factor") {
                    e.stopPropagation()
                  }
                }}
                onTouchStart={(e) => {
                  if (item.type === "note" || item.type === "factor") {
                    e.stopPropagation()
                  }
                }}
              >
                {item.content}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500 mt-2">
        💡 <strong>Tip:</strong> Drag items around to organize your thoughts. Tap on note titles/content to edit them
        inline.
      </div>
    </div>
  )

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-white z-50 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg md:text-xl font-semibold">Decision Canvas - Full Screen</h3>
          <Button variant="outline" onClick={() => setIsFullScreen(false)}>
            <X className="h-4 w-4 mr-2" />
            Exit Full Screen
          </Button>
        </div>
        <CanvasContent />
      </div>
    )
  }

  return (
    <Card className="p-4 md:p-5">
      <CanvasContent />
    </Card>
  )
}