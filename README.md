# Prisma Dental – Backend

باك إند بسيط بـ Node.js + Express + SQLite لاستقبال:
- طلبات حجز المواعيد (Booking Form)
- رسائل التواصل (Contact Form)

## التشغيل

```bash
npm install
npm start
```

السيرفر هيشتغل على: `http://localhost:3000`
وهيعرض الصفحة نفسها (public/index.html) متصلة بالباك إند تلقائيًا.

## الـ API Endpoints

### POST /api/bookings
يستقبل حجز جديد.
```json
{
  "name": "أحمد محمد",
  "phone": "01012345678",
  "service": "ortho",
  "date": "2026-07-10",
  "notes": "أول مرة أزور العيادة"
}
```

### GET /api/bookings
يرجع كل الحجوزات (مرتبة من الأحدث للأقدم).

### POST /api/messages
يستقبل رسالة تواصل جديدة.
```json
{
  "name": "سارة علي",
  "email": "sara@example.com",
  "phone": "01098765432",
  "message": "عايزة أستفسر عن أسعار التقويم"
}
```

### GET /api/messages
يرجع كل رسائل التواصل (مرتبة من الأحدث للأقدم).

## قاعدة البيانات

ملف SQLite بيتعمل تلقائيًا باسم `prisma.db` في نفس المجلد، فيه جدولين:
- `bookings`
- `messages`

## ملاحظات
- تم التحقق (validation) من البيانات الأساسية في كل endpoint (الاسم، الهاتف، الإيميل، الخدمة، الرسالة).
- لو حبيت تضيف لوحة تحكم (Admin) لعرض الحجوزات والرسائل بصريًا، أو تبعت إيميل/واتساب تلقائي عند كل حجز، قول لي وهضيفهم.
