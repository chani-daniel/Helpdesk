# HelpDesk - מערכת ניהול פניות

## 🙏 תודות והוקרה


תודה רבה למורה שרה אבער על כל הקורס, היה פשוט חויה, המורה מסבירה כל כך טוב, והכל בסבלנות רבה שלא נגמרת, במאור פנים ובנעימות...
 היה ממש כיף, בזכות המורה אנחנו יודעות ריאקט! אז ממש תודה!
  ההוראות לפרויקט היו מאוד ברורות, המורה הסבירה שוב ושוב את ההנחיות, הרגשנו שיש מישהו מאחורינו שאכפת לו ממנו... !


**תודה רבה על הכל! 💙**

## 📋 מה המערכת עושה

מערכת HelpDesk היא אפליקציית ווב לניהול פניות תמיכה (Tickets), המאפשרת ללקוחות לפתוח פניות, לנציגי תמיכה לטפל בהן, ולמנהלים לנהל את כל המערכת.

**תכונות עיקריות:**
- יצירת פניות חדשות עם רמות עדיפות
- מעקב אחר סטטוס הפניות (Open, In Progress, Resolved)
- הוספת תגובות לפניות
- הקצאת פניות לנציגי תמיכה (Admin)
- עדכון סטטוס פניות (Agent/Admin)
- Dashboard ייעודי לכל תפקיד

---

## 👥 תפקידים במערכת

### 1. Customer (לקוח) 👤
**הרשאות:**
- ✅ יצירת פניות חדשות
- ✅ צפייה בפניות שפתח בלבד
- ✅ הוספת תגובות לפניות שלו
- ❌ אינו יכול לשנות סטטוס או להקצות פניות

**משתמש לדוגמה:**
- Email: `customer1@example.com`
- Password: `password`

---

### 2. Agent (נציג תמיכה) 🛠️
**הרשאות:**
- ✅ צפייה בפניות שהוקצו אליו בלבד
- ✅ עדכון סטטוס פניות
- ✅ הוספת תגובות לפניות
- ❌ אינו יכול להקצות פניות

**משתמש לדוגמה:**
- Email: `agent@example.com`
- Password: `password`

---

### 3. Admin (מנהל) 👑
**הרשאות:**
- ✅ צפייה בכל הפניות במערכת
- ✅ הקצאת פניות לנציגי תמיכה
- ✅ הוספת נציגי תמיכה חדשים (Agents)
- ✅ עדכון סטטוס פניות
- ✅ הוספת תגובות לכל הפניות
- ✅ גישה למידע סטטיסטי מלא

**משתמש לדוגמה:**
- Email: `admin@example.com`
- Password: `password`

---

## 🔧 חשוב לגבי השרת

⚠️ **שרת ה-API אינו חלק מהפיתוח שלי** - השרת הורד מ-GitHub והשימוש בו הוא לפי ההנחיות:
- **מקור השרת:** https://github.com/sarataber/helpdesk-api
- השרת **לא שונה בשום צורה** - עבודה מלאה מול ה-API הקיים
- כל התקשורת מול השרת דרך ה-API המוגדר
- ניתן לבדוק את ה-API דרך **Swagger:** http://localhost:4000/api-docs

---

## 🚀 הנחיות הרצה

### דרישות מקדימות
- **Node.js** גרסה 16 ומעלה
- **npm** או **yarn**

---

### שלב 1: הפעלת השרת (Backend)

1. פתח terminal ונווט לתיקיית השרת:
```bash
cd helpdesk-api-main
```

2. התקן את התלויות (רק בפעם הראשונה):
```bash
npm install
```

3. הפעל את השרת:
```bash
npm start
```

השרת ירוץ על: **http://localhost:4000**

---

### שלב 2: הפעלת הקליינט (Frontend)

1. פתח terminal **נוסף** ונווט לתיקיית הקליינט:
```bash
cd helpdesk-client
```

2. התקן את התלויות (רק בפעם הראשונה):
```bash
npm install
```

3. הפעל את אפליקציית React:
```bash
npm run dev
```

האפליקציה תרוץ על: **http://localhost:5173**

---

### שלב 3: כניסה למערכת

1. פתח דפדפן וגש ל: **http://localhost:5173**
2. תועבר אוטומטית לדף התחברות
3. התחבר עם אחד מהמשתמשים:

| תפקיד | Email | Password |
|-------|-------|----------|
| Customer | customer1@example.com | password |
| Agent | agent@example.com | password |
| Admin | admin@example.com | password |

---

## 🗂️ מבנה הפרויקט

### Backend (Server)
```
helpdesk-api-main/
├── src/
│   ├── controllers/      # לוגיקה עסקית
│   ├── routes/           # נתיבי API
│   ├── services/         # שירותים
│   ├── repositories/     # גישה לבסיס נתונים
│   ├── middleware/       # אימות והרשאות
│   └── db/               # בסיס נתונים SQLite
```

### Frontend (Client)
```
helpdesk-client/
├── src/
│   ├── components/       # קומפוננטות React
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── TicketsList.tsx
│   │   ├── TicketDetails.tsx
│   │   ├── NewTicket.tsx
│   │   ├── AddAgent.tsx
│   │   ├── PrivateRoute.tsx
│   │   └── NotFound.tsx
│   ├── contexts/         # ניהול state גלובלי
│   │   └── context.tsx
│   └── routes/           # ניהול ניתוב
│       └── route.tsx
```

---

## 🛠️ טכנולוגיות

### Frontend
- **React 19** + TypeScript
- **Material-UI (MUI)** - עיצוב
- **React Hook Form** - ניהול טפסים
- **React Router v6** - ניתוב
- **Axios** - בקשות HTTP
- **SweetAlert2** - התראות
- **Context API** - ניהול state

### Backend
- **Node.js** + Express
- **SQLite** - בסיס נתונים
- **JWT** - אימות
- **TypeScript**

---

## 📚 ספריות וכלים שנעשה בהם שימוש

בהתאם להמלצות הקורס:
- ✅ [React Hook Form](https://react-hook-form.com/) - ניהול טפסים יעיל ומאומת
- ✅ [Material-UI (MUI)](https://mui.com/material-ui/) - ספריית עיצוב מקצועית
- ✅ [React Router](https://reactrouter.com/start/data/routing) - ניתוב מתקדם
- ✅ [SweetAlert2](https://sweetalert2.github.io/) - התראות מעוצבות
- ✅ [Context API](https://react.dev/) - ניהול state גלובלי
- ✅ [Axios](https://axios-http.com/) - תקשורת HTTP עם השרת

---

## 📌 נתיבים באפליקציה

| נתיב | תיאור | הרשאות |
|------|-------|---------|
| /login | דף התחברות | כולם |
| /register | הרשמה למערכת | כולם |
| /dashboard | דף בית | משתמשים מחוברים |
| /tickets | רשימת פניות | משתמשים מחוברים |
| /tickets/new | יצירת פניה חדשה | Customer בלבד |
| /tickets/:id | פרטי פניה | משתמשים מחוברים |
| /add-agent | הוספת נציג תמיכה | Admin בלבד |
| /* | דף 404 | כולם |

**🔐 Route Guard:**
- משתמש לא מחובר → הפניה אוטומטית ל-/login
- גישה למסכים לפי תפקיד → חסימה בצד לקוח (PrivateRoute)
- בדיקת הרשאות לפני כל ניתוב

---

## 🔒 אבטחה

- כל הנתיבים מוגנים עם JWT tokens
- בדיקת הרשאות לפי תפקיד (Role-Based Access Control)
- הצפנת סיסמאות בבסיס הנתונים
- Validation על כל הטפסים (Client & Server side)
- Protected Routes - חסימת גישה לא מורשית

---

## ⚠️ הערות חשובות

1. **אל תעצור את השרת והקליינט** - שניהם צריכים לרוץ במקביל
2. **פורטים:** ודא שפורט 4000 ו-5173 פנויים
3. **בסיס נתונים:** הנתונים נשמרים ב-SQLite, לא נמחקים בין הפעלות
4. **איפוס נתונים:** הרץ `npm run reset` בתיקיית השרת לאיפוס המערכת
5. **Swagger UI:** לבדיקת ה-API גש ל-http://localhost:4000/api-docs

---

## 📞 תמיכה

במקרה של בעיות:
1. ודא שהשרת רץ על פורט 4000
2. בדוק שהקליינט רץ על פורט 5173
3. נקה cache של הדפדפן (Ctrl+Shift+Delete)
4. בדוק את ה-Console לשגיאות
5. וודא ש-Node.js מעודכן לגרסה 16 ומעלה

---

## 👨‍💻 פותח על ידי

חני דניאל - פרויקט גמר React

---

**גרסה:** 1.0.0  
**תאריך:** דצמבר 2025
