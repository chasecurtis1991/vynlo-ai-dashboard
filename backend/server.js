const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(__dirname, 'data', 'analytics.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

// Create tables
db.serialize(() => {
  // Analytics events table
  db.run(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      event_name TEXT NOT NULL,
      value INTEGER DEFAULT 1,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tasks table - Updated schema for Task Board
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      priority TEXT DEFAULT 'medium',
      category TEXT DEFAULT 'general',
      task_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      due_date DATETIME
    )
  `);

  // Daily metrics table
  db.run(`
    CREATE TABLE IF NOT EXISTS daily_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE UNIQUE NOT NULL,
      tasks_completed INTEGER DEFAULT 0,
      automations_run INTEGER DEFAULT 0,
      ai_responses INTEGER DEFAULT 0,
      efficiency_score REAL DEFAULT 0
    )
  `);

  // Seed some initial data if empty
  db.get("SELECT COUNT(*) as count FROM daily_metrics", (err, row) => {
    if (row.count === 0) {
      seedInitialData();
    }
  });
});

function seedInitialData() {
  const today = new Date();
  const data = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    data.push({
      date: dateStr,
      tasks_completed: Math.floor(Math.random() * 50) + 20,
      automations_run: Math.floor(Math.random() * 30) + 10,
      ai_responses: Math.floor(Math.random() * 100) + 50,
      efficiency_score: Math.random() * 30 + 70
    });
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO daily_metrics (date, tasks_completed, automations_run, ai_responses, efficiency_score)
    VALUES (?, ?, ?, ?, ?)
  `);

  data.forEach(d => {
    stmt.run(d.date, d.tasks_completed, d.automations_run, d.ai_responses, d.efficiency_score);
  });

  stmt.finalize();
  console.log('Seeded initial analytics data');
}

// REST API Endpoints

// Get chart data - Tasks over time
app.get('/api/analytics/tasks-over-time', (req, res) => {
  const days = parseInt(req.query.days) || 30;
  db.all(`
    SELECT date, tasks_completed, automations_run
    FROM daily_metrics
    ORDER BY date DESC
    LIMIT ?
  `, [days], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      labels: rows.reverse().map(r => r.date),
      tasks: rows.reverse().map(r => r.tasks_completed),
      automations: rows.reverse().map(r => r.automations_run)
    });
  });
});

// Get chart data - AI Activity
app.get('/api/analytics/ai-activity', (req, res) => {
  const days = parseInt(req.query.days) || 30;
  db.all(`
    SELECT date, ai_responses, efficiency_score
    FROM daily_metrics
    ORDER BY date DESC
    LIMIT ?
  `, [days], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      labels: rows.reverse().map(r => r.date),
      aiResponses: rows.reverse().map(r => r.ai_responses),
      efficiency: rows.reverse().map(r => Math.round(r.efficiency_score))
    });
  });
});

// Get summary stats
app.get('/api/analytics/summary', (req, res) => {
  db.get(`
    SELECT
      SUM(tasks_completed) as total_tasks,
      SUM(automations_run) as total_automations,
      SUM(ai_responses) as total_ai_responses,
      AVG(efficiency_score) as avg_efficiency
    FROM daily_metrics
  `, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      totalTasks: row.total_tasks || 0,
      totalAutomations: row.total_automations || 0,
      totalAiResponses: row.total_ai_responses || 0,
      avgEfficiency: row.avg_efficiency ? Math.round(row.avg_efficiency) : 0
    });
  });
});

// Get recent events
app.get('/api/analytics/events', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  db.all(`
    SELECT * FROM analytics_events
    ORDER BY created_at DESC
    LIMIT ?
  `, [limit], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Record a new event
app.post('/api/analytics/events', (req, res) => {
  const { event_type, event_name, value, metadata } = req.body;
  db.run(`
    INSERT INTO analytics_events (event_type, event_name, value, metadata)
    VALUES (?, ?, ?, ?)
  `, [event_type, event_name, value || 1, metadata ? JSON.stringify(metadata) : null],
  function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Event recorded' });
  });
});

// Get task distribution for pie chart
app.get('/api/analytics/task-distribution', (req, res) => {
  db.all(`
    SELECT status, COUNT(*) as count
    FROM tasks
    GROUP BY status
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      labels: rows.map(r => r.status),
      data: rows.map(r => r.count)
    });
  });
});

// ============================================
// TASK BOARD API ENDPOINTS
// ============================================

// Get all tasks with optional filtering
app.get('/api/tasks', (req, res) => {
  const { status, priority, category, search } = req.query;
  
  let query = `SELECT * FROM tasks WHERE 1=1`;
  const params = [];
  
  if (status && status !== 'all') {
    query += ` AND status = ?`;
    params.push(status);
  }
  if (priority && priority !== 'all') {
    query += ` AND priority = ?`;
    params.push(priority);
  }
  if (category && category !== 'all') {
    query += ` AND category = ?`;
    params.push(category);
  }
  if (search) {
    query += ` AND (title LIKE ? OR description LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }
  
  query += ` ORDER BY task_order ASC, created_at DESC`;
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get task by ID
app.get('/api/tasks/:id', (req, res) => {
  db.get(`SELECT * FROM tasks WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Task not found' });
    res.json(row);
  });
});

// Create new task
app.post('/api/tasks', (req, res) => {
  const { title, description, status, priority, category, due_date } = req.body;
  
  // Get max order for the status column
  db.get(`SELECT COALESCE(MAX(task_order), -1) as maxOrder FROM tasks WHERE status = ?`, 
    [status || 'pending'], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const newOrder = (row?.maxOrder || 0) + 1;
    
    db.run(`
      INSERT INTO tasks (title, description, status, priority, category, task_order, due_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, description, status || 'pending', priority || 'medium', category || 'general', newOrder, due_date, getNow(), getNow()],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Task created successfully' });
    });
  });
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
  const { title, description, status, priority, category, due_date } = req.body;
  const taskId = req.params.id;
  
  db.run(`
    UPDATE tasks 
    SET title = COALESCE(?, title),
        description = COALESCE(?, description),
        status = COALESCE(?, status),
        priority = COALESCE(?, priority),
        category = COALESCE(?, category),
        due_date = COALESCE(?, due_date),
        updated_at = ?,
        completed_at = CASE WHEN ? = 'completed' AND completed_at IS NULL THEN ? ELSE completed_at END
    WHERE id = ?
  `, [title, description, status, priority, category, due_date, getNow(), status, getNow(), taskId],
  function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task updated successfully' });
  });
});

// Move task (drag and drop)
app.put('/api/tasks/:id/move', (req, res) => {
  const { status, newOrder } = req.body;
  const taskId = req.params.id;
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // Get current task info
    db.get(`SELECT status, task_order FROM tasks WHERE id = ?`, [taskId], (err, task) => {
      if (err || !task) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: err?.message || 'Task not found' });
      }
      
      const oldStatus = task.status;
      const oldOrder = task.task_order;
      
      if (oldStatus === status) {
        // Moving within same column - reorder
        if (newOrder < oldOrder) {
          db.run(`UPDATE tasks SET task_order = task_order + 1 WHERE status = ? AND task_order >= ? AND task_order < ?`,
            [status, newOrder, oldOrder], (err) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: err.message });
            }
          });
        } else if (newOrder > oldOrder) {
          db.run(`UPDATE tasks SET task_order = task_order - 1 WHERE status = ? AND task_order > ? AND task_order <= ?`,
            [status, oldOrder, newOrder], (err) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: err.message });
            }
          });
        }
      } else {
        // Moving to different column
        db.run(`UPDATE tasks SET task_order = task_order - 1 WHERE status = ? AND task_order > ?`,
          [oldStatus, oldOrder], (err) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
        });
        
        // Get max order in new column
        db.get(`SELECT COALESCE(MAX(task_order), -1) as maxOrder FROM tasks WHERE status = ?`, [status], (err, row) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          
          const targetOrder = Math.min(newOrder, (row?.maxOrder || 0) + 1);
          
          db.run(`UPDATE tasks SET task_order = task_order + 1 WHERE status = ? AND task_order >= ?`,
            [status, targetOrder], (err) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: err.message });
            }
          });
        });
      }
      
      // Update the moved task
      db.run(`UPDATE tasks SET status = ?, task_order = ?, updated_at = ? WHERE id = ?`,
        [status, newOrder, getNow(), taskId], function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }
        
        db.run('COMMIT');
        res.json({ message: 'Task moved successfully' });
      });
    });
  });
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    db.get(`SELECT status, task_order FROM tasks WHERE id = ?`, [taskId], (err, task) => {
      if (err || !task) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: err?.message || 'Task not found' });
      }
      
      db.run(`DELETE FROM tasks WHERE id = ?`, [taskId], (err) => {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }
        
        // Reorder remaining tasks
        db.run(`UPDATE tasks SET task_order = task_order - 1 WHERE status = ? AND task_order > ?`,
          [task.status, task.task_order], (err) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          
          db.run('COMMIT');
          res.json({ message: 'Task deleted successfully' });
        });
      });
    });
  });
});

// Get task stats
app.get('/api/tasks/stats/summary', (req, res) => {
  db.get(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
    FROM tasks
  `, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// ============================================
// END TASK BOARD API ENDPOINTS
// ============================================

// Seed some tasks for distribution chart
db.get("SELECT COUNT(*) as count FROM tasks", (err, row) => {
  if (row.count === 0) {
    const tasks = [
      { title: 'Process customer request', status: 'completed', priority: 'high', category: 'support' },
      { title: 'Generate daily report', status: 'completed', priority: 'medium', category: 'reports' },
      { title: 'Update database', status: 'completed', priority: 'high', category: 'development' },
      { title: 'Send notifications', status: 'in_progress', priority: 'medium', category: 'automation' },
      { title: 'Analyze metrics', status: 'in_progress', priority: 'low', category: 'analytics' },
      { title: 'Review emails', status: 'pending', priority: 'medium', category: 'communication' },
      { title: 'Schedule meeting', status: 'pending', priority: 'low', category: 'meetings' },
      { title: 'Backup files', status: 'pending', priority: 'low', category: 'maintenance' },
      { title: 'Code review', status: 'pending', priority: 'high', category: 'development' },
      { title: 'Update documentation', status: 'pending', priority: 'medium', category: 'documentation' },
    ];

    const stmt = db.prepare(`
      INSERT INTO tasks (title, status, priority, category, task_order, created_at, updated_at, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    tasks.forEach((t, index) => {
      stmt.run(t.title, t.status, t.priority, t.category, index, getNow(), getNow(), t.status === 'completed' ? getNow() : null);
    });

    stmt.finalize();
    console.log('Seeded initial task board data');
  }
});

function formatDate(date) {
  return (date || new Date()).toISOString().replace('T', ' ').substring(0, 19);
}

function getNow() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
