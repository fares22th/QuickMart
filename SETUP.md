# QuickMart — خطوات التشغيل

## المتطلبات
- Node.js 18+
- PostgreSQL 15+
- npm أو pnpm

---

## 1. إعداد قاعدة البيانات

```bash
# تثبيت PostgreSQL وإنشاء قاعدة البيانات
psql -U postgres
CREATE DATABASE quickmart;
\q
```

---

## 2. تشغيل الباك اند

```bash
cd backend

# تثبيت المكتبات
npm install

# تعديل ملف .env
# افتح backend/.env وغيّر:
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/quickmart?schema=public"

# مزامنة قاعدة البيانات
npm run db:push

# تعبئة البيانات الأولية
npm run db:seed

# تشغيل السيرفر
npm run dev
# السيرفر يعمل على http://localhost:4000
```

---

## 3. تشغيل تطبيق العميل

```bash
cd customer
npm install
npm run dev
# يعمل على http://localhost:5173
```

---

## 4. تشغيل تطبيق البائع

```bash
cd seller
npm install
npm run dev
# يعمل على http://localhost:5174
```

---

## 5. تشغيل تطبيق الأدمن

```bash
cd admin
npm install
npm run dev
# يعمل على http://localhost:5175
```

---

## بيانات الدخول التجريبية

| الدور     | رقم الهاتف  | كلمة المرور |
|-----------|------------|-------------|
| أدمن      | 0500000000 | Admin@123   |
| بائع 1    | 0511111111 | Seller@123  |
| بائع 2    | 0522222222 | Seller@123  |
| عميل      | 0555555555 | Customer@123|

---

## ملاحظات

- للتحميل الصور (Cloudinary): عدّل CLOUDINARY_* في backend/.env
- الـ JWT_SECRET في الملف التجريبي - غيّره في الإنتاج
- Socket.io يعمل تلقائياً لتتبع الطلبات في الوقت الفعلي
