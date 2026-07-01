const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Database setup ----------
const db = new Database(path.join(__dirname, 'prisma.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    date TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// ---------- Helpers ----------
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------- Routes ----------

// Create a booking
app.post('/api/bookings', (req, res) => {
  const { name, phone, service, date, notes } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'الاسم مطلوب', field: 'name' });
  }
  if (!phone || !phone.trim()) {
    return res.status(400).json({ error: 'رقم الهاتف مطلوب', field: 'phone' });
  }
  if (!service || !service.trim()) {
    return res.status(400).json({ error: 'الخدمة مطلوبة', field: 'service' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO bookings (name, phone, service, date, notes)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name.trim(), phone.trim(), service.trim(), date || null, notes || null);
    res.status(201).json({ success: true, id: info.lastInsertRowid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

// List bookings (for admin/internal use)
app.get('/api/bookings', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM bookings ORDER BY id DESC').all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

// Create a contact message
app.post('/api/messages', (req, res) => {
  const { name, email, phone, message } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'الاسم مطلوب', field: 'name' });
  }
  if (!email || !isValidEmail(email.trim())) {
    return res.status(400).json({ error: 'البريد الإلكتروني غير صحيح', field: 'email' });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'الرسالة مطلوبة', field: 'message' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO messages (name, email, phone, message)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(name.trim(), email.trim(), phone || null, message.trim());
    res.status(201).json({ success: true, id: info.lastInsertRowid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

// List messages (for admin/internal use)
app.get('/api/messages', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM messages ORDER BY id DESC').all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

app.listen(PORT, () => {
  console.log(`Prisma Dental backend running on http://localhost:${PORT}`);
});
