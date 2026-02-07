"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Search, Filter, MoreHorizontal, GripVertical, X, Calendar, Edit2, Trash2, CheckCircle2, Circle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, Label, Textarea } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  category: string;
  assignee?: string;
  task_order: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

interface TaskStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  backlog?: number;
  todo?: number;
  done?: number;
}

const COLUMNS = [
  { id: "backlog", title: "Backlog", color: "bg-slate-500" },
  { id: "todo", title: "To Do", color: "bg-yellow-500" },
  { id: "in_progress", title: "In Progress", color: "bg-blue-500" },
  { id: "done", title: "Done", color: "bg-green-500" },
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-green-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "high", label: "High", color: "bg-red-500" },
];

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "meetings", label: "Meetings" },
  { value: "communication", label: "Communication" },
  { value: "analytics", label: "Analytics" },
  { value: "automation", label: "Automation" },
  { value: "documentation", label: "Documentation" },
  { value: "support", label: "Support" },
  { value: "maintenance", label: "Maintenance" },
  { value: "reports", label: "Reports" },
];

// Assignees - extensible for future agents
const ASSIGNEES = [
  { value: "chase", label: "👤 Chase" },
  { value: "vyn", label: "🎯 Vyn" },
  { value: "dev", label: "🤖 Dev Agent" },
];

// Sortable Task Card Component
function SortableTask({ task, onEdit, onDelete }: { task: Task; onEdit: () => void; onDelete: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "Task", task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityBadge = PRIORITIES.find(p => p.value === task.priority);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card rounded-lg border p-3 shadow-sm group hover:shadow-md transition-all mb-2",
        isDragging && "opacity-50 shadow-lg ring-2 ring-primary"
      )}
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm truncate">{task.title}</h4>
            <div className="flex items-center gap-1">
              <button
                onClick={onEdit}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent rounded"
              >
                <Edit2 className="h-3 w-3" />
              </button>
              <button
                onClick={onDelete}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 text-destructive rounded"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {priorityBadge && (
              <Badge variant={task.priority as "high" | "medium" | "low"} className="text-xs">
                {priorityBadge.label}
              </Badge>
            )}
            {task.due_date && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Task Card for Drag Overlay
function TaskCard({ task }: { task: Task }) {
  const priorityBadge = PRIORITIES.find(p => p.value === task.priority);

  return (
    <div className="bg-card rounded-lg border p-3 shadow-lg">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{task.title}</h4>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {priorityBadge && (
              <Badge variant={task.priority as "high" | "medium" | "low"} className="text-xs">
                {priorityBadge.label}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Column Component
function TaskColumn({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: {
  column: typeof COLUMNS[0];
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "Column", column },
  });

  return (
    <Card className="flex-1 min-w-[280px] max-w-[320px]">
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", column.color)} />
            <CardTitle className="text-sm font-semibold">{column.title}</CardTitle>
            <Badge variant="secondary" className="text-xs">{tasks.length}</Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAddTask}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <div
        ref={setNodeRef}
        className={cn(
          "p-3 pt-0 min-h-[200px] transition-colors",
          isOver && "bg-primary/5 ring-2 ring-primary ring-inset rounded-lg"
        )}
      >
        <CardContent className="p-0">
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <SortableTask
                key={task.id}
                task={task}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
          </SortableContext>
          {tasks.length === 0 && (
            <div className={cn(
              "text-center py-8 text-muted-foreground text-sm transition-colors",
              isOver && "text-primary font-medium"
            )}>
              {isOver ? "Drop here" : "No tasks"}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}

// Main Task Board Page
export default function TaskBoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [originalStatus, setOriginalStatus] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    category: "general",
    assignee: "",
    due_date: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);

      const url = `${API_BASE}/api/tasks?${params}`;
      console.log("[API] Fetching tasks from:", url);

      const res = await fetch(url);
      console.log("[API] Response status:", res.status);

      const data = await res.json();
      console.log("[API] Received", data.length || 0, "tasks. Statuses:", Array.from(new Set(data.map((t: Task) => t.status) || [])));

      setTasks(data || []);
    } catch (error) {
      console.error("[API] Failed to fetch tasks:", error);
    }
  }, [search, priorityFilter, categoryFilter]);

  const fetchStats = async () => {
    try {
      console.log("[API] Fetching stats from:", `${API_BASE}/api/tasks/stats/summary`);
      const res = await fetch(`${API_BASE}/api/tasks/stats/summary`);
      const data = await res.json();
      console.log("[API] Stats:", data);
      setStats(data);
    } catch (error) {
      console.error("[API] Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTasks(), fetchStats()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchTasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) {
      setActiveTask(task);
      setOriginalStatus(task.status);
      console.log("[DragStart] Started dragging task:", task.title, "originalStatus:", task.status);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    console.log("[DragEnd] Event received:", { activeId: active.id, overId: over?.id });
    setActiveTask(null);

    if (!over) {
      console.log("[DragEnd] No over target, returning");
      return;
    }

    const activeId = active.id as number;
    const overId = over.id as string | number;
    console.log("[DragEnd] activeId:", activeId, "overId:", overId);

    // Find the original task from current tasks state
    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) {
      console.log("[DragEnd] Active task not found in tasks");
      return;
    }
    console.log("[DragEnd] Active task found:", activeTask.title, "status:", activeTask.status);

    // Determine target status
    let newStatus = activeTask.status;
    let newOrder = 0;

    // Check if dropped on a column (column IDs are strings like "backlog", "todo", etc.)
    let targetColumn = COLUMNS.find(c => c.id === overId || c.id === String(overId));
    console.log("[DragEnd] targetColumn match:", targetColumn);

    // If over.id is not a column, it might be a task - find its column
    if (!targetColumn && overId) {
      const taskDroppedOn = tasks.find(t => t.id === Number(overId));
      if (taskDroppedOn) {
        targetColumn = COLUMNS.find(c => c.id === taskDroppedOn.status);
        console.log("[DragEnd] Found target column from task:", targetColumn);
      }
    }

    if (targetColumn) {
      newStatus = targetColumn.id;
      const columnTasks = tasks.filter(t => t.status === newStatus);
      newOrder = columnTasks.length;
      console.log("[DragEnd] Dropped on column:", newStatus, "newOrder:", newOrder);
    }

    console.log("[DragEnd] Comparing status: original=", originalStatus, "new=", newStatus);

    // Only update if status actually changed (compare against original status, not current state)
    if (newStatus === originalStatus) {
      console.log("[DragEnd] Status unchanged, skipping API call");
      setOriginalStatus(null); // Reset
      return;
    }

    // Optimistic update
    const previousTasks = [...tasks];
    console.log("[DragEnd] Updating optimistic UI, calling API...");
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === activeId) {
          return { ...t, status: newStatus, task_order: newOrder };
        }
        return t;
      });
      return updated;
    });

    try {
      console.log("[DragEnd] Calling API:", `${API_BASE}/api/tasks/${activeId}/move`, "PUT", { status: newStatus, newOrder });
      const response = await fetch(`${API_BASE}/api/tasks/${activeId}/move`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, newOrder }),
      });
      console.log("[DragEnd] API response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("[DragEnd] API error:", errorText);
        throw new Error(`API error: ${response.status}`);
      }
      await fetchTasks();
      await fetchStats();
      console.log("[DragEnd] Move completed successfully");
    } catch (error) {
      console.error("[DragEnd] Failed to move task:", error);
      setTasks(previousTasks);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as string | number;

    if (activeId === overId) return;

    const activeTask = tasks.find(t => t.id === activeId);
    const overTask = tasks.find(t => t.id === overId || t.id === Number(overId));

    if (!activeTask) return;

    // Check if dropped on a column (column IDs are strings)
    const overColumn = COLUMNS.find(c => c.id === overId || c.id === String(overId));
    
    // If dragging over a column, update status temporarily
    if (overColumn && activeTask.status !== overColumn.id) {
      setTasks(prev => {
        return prev.map(t => {
          if (t.id === activeId) {
            return { ...t, status: overColumn.id };
          }
          return t;
        });
      });
    }
  };

  const openCreateDialog = () => {
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      category: "general",
      assignee: "",
      due_date: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      category: task.category,
      assignee: task.assignee || "",
      due_date: task.due_date ? task.due_date.split(" ")[0] : "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTask) {
        await fetch(`${API_BASE}/api/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch(`${API_BASE}/api/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      setIsDialogOpen(false);
      await fetchTasks();
      await fetchStats();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await fetch(`${API_BASE}/api/tasks/${taskId}`, { method: "DELETE" });
      await fetchTasks();
      await fetchStats();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(t => t.status === status).sort((a, b) => a.task_order - b.task_order);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Task Board</h1>
          <p className="text-muted-foreground">Manage your tasks with drag and drop</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-slate-500">{stats.backlog || 0}</div>
              <p className="text-xs text-muted-foreground">Backlog</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-500">{stats.todo || 0}</div>
              <p className="text-xs text-muted-foreground">To Do</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-500">{stats.in_progress || 0}</div>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-500">{stats.done || 0}</div>
              <p className="text-xs text-muted-foreground">Done</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 px-8"
          />
        </div>
        <Select
          options={[{ value: "all", label: "All Priorities" }, ...PRIORITIES]}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="w-40"
        />
        <Select
          options={[{ value: "all", label: "All Categories" }, ...CATEGORIES]}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-44"
        />
      </div>

      {/* Board */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading tasks...</div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map((column) => (
              <TaskColumn
                key={column.id}
                column={column}
                tasks={getTasksByStatus(column.id)}
                onAddTask={() => {
                  setFormData(prev => ({ ...prev, status: column.id }));
                  openCreateDialog();
                }}
                onEditTask={openEditDialog}
                onDeleteTask={handleDelete}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Create Task"}</DialogTitle>
            <DialogDescription>
              {editingTask ? "Update the task details below." : "Add a new task to your board."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Task title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Task description (optional)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    options={COLUMNS.map(c => ({ value: c.id, label: c.title }))}
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    id="priority"
                    options={PRIORITIES}
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    id="category"
                    options={CATEGORIES}
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select
                    id="assignee"
                    options={[{ value: "", label: "Unassigned" }, ...ASSIGNEES]}
                    value={formData.assignee}
                    onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!formData.title.trim()}>
                {editingTask ? "Save Changes" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}