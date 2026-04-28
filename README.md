# А.Номин-Эрдэнэ — Portfolio Web App

Их Засаг Их Сургуулийн програм хангамжийн оюутан А.Номин-Эрдэнийн хувийн portfolio веб аппликейшн. Next.js 14 (App Router), React, Tailwind CSS, Firebase болон Cloudinary дээр бүтээгдсэн, бүрэн динамик production түвшний систем.

---

## ✨ Онцлог шинж чанарууд

- **Бүрэн динамик контент** — бүх мэдээлэл Firestore-оос уншигдана (static data байхгүй)
- **Admin Dashboard** — Firebase Auth-аар хамгаалагдсан, бүх контентыг засах CRUD
- **Cloudinary зураг upload** — admin-аас шууд зураг оруулах
- **Dark mode** — toggle-той, системийн тохиргоог хүндэтгэдэг
- **Responsive** — гар утас, таблет, desktop бүгдэд тохиромжтой
- **Framer Motion animation** — гөлгөр шилжилтүүд
- **Toast мэдэгдэл** — амжилт/алдааны UI feedback
- **SEO meta tags** — OpenGraph, viewport, theme color
- **Mongolian UI** — бүх интерфэйс монгол хэл дээр

---

## 📁 Хуудсууд

| Хуудас | Замчлал | Тайлбар |
|--------|---------|---------|
| Нүүр | `/` | Hero, profile, онцлох төслүүд |
| Танилцуулга | `/about` | Намтар, ажлын туршлага, боловсрол |
| Төслүүд | `/projects` | Бүх төсөл, ангилалаар шүүх |
| Чадварууд | `/skills` | Чадваруудын progress bar |
| Холбоо барих | `/contact` | Холбоо барих маягт |
| Admin Login | `/admin/login` | Нэвтрэх хэсэг |
| Admin Dashboard | `/admin/dashboard` | Удирдлагын самбар |

---

## 🛠 Техникийн стек

- **Next.js 14.2** — App Router
- **React 18**
- **Tailwind CSS 3.4**
- **Firebase 10** — Authentication, Firestore
- **Cloudinary** — зургийн storage (unsigned upload)
- **Framer Motion** — animation
- **react-hot-toast** — мэдэгдэл
- **next-themes** — dark mode
- **lucide-react** — icon

---

## 🚀 Алхам алхмаар суулгах заавар

### 1. Шаардлагатай зүйлс

- Node.js 18+ ([татах](https://nodejs.org/))
- npm эсвэл yarn
- GitHub бүртгэл
- Google бүртгэл (Firebase-д хэрэгтэй)
- Cloudinary бүртгэл ([бүртгүүлэх](https://cloudinary.com/users/register/free) — үнэгүй)

### 2. Төслийг суулгах

```bash
# Repository clone хийх (эсвэл ZIP-ээс задлах)
cd portfolio-app

# Dependency суулгах
npm install
```

### 3. Firebase төсөл үүсгэх

1. [Firebase Console](https://console.firebase.google.com/) руу орно
2. **"Add project"** дээр дарж шинэ төсөл үүсгэнэ (нэр: `nomin-portfolio` гэх мэт)
3. Google Analytics-ыг идэвхгүй болгож болно (заавал биш)

#### 3.1. Authentication идэвхжүүлэх

1. Зүүн талын цэснээс **Build → Authentication** сонгоно
2. **"Get started"** дарна
3. **Sign-in method** таб дээр **Email/Password** -г идэвхжүүлнэ
4. **Users** таб дээр **"Add user"** дарж admin хэрэглэгч үүсгэнэ:
   - Email: `nomin@example.com` (өөрийн email)
   - Password: хүчтэй нууц үг сонгоно

#### 3.2. Firestore Database үүсгэх

1. **Build → Firestore Database** руу орно
2. **"Create database"** дарна
3. **Start in production mode** сонгоно
4. Бүс нутаг сонгоно (Asia/Tokyo эсвэл хамгийн ойр байгаа)

#### 3.3. Firestore Security Rules тохируулах

**Rules** таб дээр дараах rule-уудыг тохируулна:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public хуудсууд: нийтэд унших боломжтой
    match /home/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /about/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /contact/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /projects/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /skills/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Messages: хэн ч илгээх боломжтой, зөвхөн admin унших
    match /messages/{document=**} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

#### 3.4. Web App бүртгэх

1. Project Overview хуудас руу буцна
2. Web icon (`</>`) дээр дарна
3. App nickname өгнө (`portfolio-web`)
4. **Register app** дарна
5. `firebaseConfig` объектыг хуулж аваад дараагийн алхамд ашиглана

### 4. Cloudinary тохируулах

1. [Cloudinary Console](https://console.cloudinary.com/) руу орно
2. **Cloud name** -г Dashboard-аас тэмдэглэнэ
3. **Settings → Upload** руу орно
4. **Upload presets** хэсэгт **"Add upload preset"** дарна
5. Тохиргоо:
   - Preset name: `portfolio_unsigned`
   - Signing Mode: **Unsigned**
   - Folder: `portfolio` (заавал биш)
6. Save хийнэ

### 5. .env.local файл үүсгэх

Төслийн үндсэн фолдерт `.env.local` файл үүсгээд `.env.local.example` -ийн загвараар бөглөнө:

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nomin-portfolio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nomin-portfolio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nomin-portfolio.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234:web:abcd

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=portfolio_unsigned
```

### 6. Локалаар ажиллуулах

```bash
npm run dev
```

Хөтчөөс [http://localhost:3000](http://localhost:3000) -г нээнэ.

Admin руу нэвтрэхийн тулд: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### 7. Эхний өгөгдөл оруулах

Admin руу нэвтэрсний дараа дараах дарааллаар бөглөнө:

1. **Нүүр** — нэр, tagline, bio, profile зураг
2. **Танилцуулга** — их сургууль, мэргэжил, ажлын туршлага, боловсрол
3. **Холбоо барих** — email, утас, social media
4. **Чадварууд** — програмчлалын хэл, framework нэмэх
5. **Төслүүд** — өөрийн бүтээлүүдийг нэмэх

> 💡 **Зөвлөгөө:** Firestore дотор `home/main`, `about/main`, `contact/main` нэртэй ганц document байх ба үлдсэн нь `projects`, `skills`, `messages` collection хэлбэртэй байна. Admin form-ууд автоматаар үүсгэнэ.

---

## 📦 Production Build

```bash
npm run build
npm start
```

---

## 🌐 Vercel дээр deploy хийх

### 1. GitHub-д push хийх

```bash
git init
git add .
git commit -m "Initial commit: portfolio web app"
git branch -M main
git remote add origin https://github.com/<your-username>/portfolio.git
git push -u origin main
```

### 2. Vercel-д холбох

1. [Vercel](https://vercel.com/) руу орж GitHub-ээр нэвтэрнэ
2. **"Add New Project"** дарна
3. Repository-гоо сонгоно
4. **Environment Variables** хэсэгт `.env.local` -ийн бүх хувьсагчдыг нэмнэ
5. **Deploy** дарна

### 3. Firebase-д Vercel domain-г зөвшөөрөх

1. Firebase Console → Authentication → Settings → **Authorized domains**
2. Vercel domain-г нэмнэ (жишээ: `nomin-portfolio.vercel.app`)

---

## 📂 Файлын бүтэц

```
portfolio-app/
├── src/
│   ├── app/
│   │   ├── (public)/           # Public хуудаснууд
│   │   │   ├── layout.js       # Navbar + Footer
│   │   │   ├── page.js         # Нүүр
│   │   │   ├── about/page.js
│   │   │   ├── projects/page.js
│   │   │   ├── skills/page.js
│   │   │   └── contact/page.js
│   │   ├── admin/              # Admin (хамгаалагдсан)
│   │   │   ├── layout.js
│   │   │   ├── page.js         # Redirect
│   │   │   ├── login/page.js
│   │   │   ├── dashboard/page.js
│   │   │   ├── home/page.js
│   │   │   ├── about/page.js
│   │   │   ├── projects/page.js
│   │   │   ├── skills/page.js
│   │   │   └── contact/page.js
│   │   ├── globals.css
│   │   └── layout.js           # Root layout
│   ├── components/
│   │   ├── ui/                 # Reusable UI
│   │   │   ├── Button.js
│   │   │   ├── Card.js
│   │   │   ├── Input.js
│   │   │   ├── Modal.js
│   │   │   ├── Loading.js
│   │   │   ├── ImageUpload.js
│   │   │   └── ThemeToggle.js
│   │   ├── layout/
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   ├── admin/
│   │   │   ├── AdminSidebar.js
│   │   │   └── ProtectedRoute.js
│   │   └── Providers.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── hooks/
│   │   └── useFirestore.js
│   └── lib/
│       ├── firebase.js
│       ├── firestore.js
│       ├── cloudinary.js
│       └── validation.js
├── .env.local.example
├── .gitignore
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── firestore.rules
└── README.md
```

---

## 🗄 Firestore өгөгдлийн схем

### `home/main` (single document)
```js
{
  name: string,
  tagline: string,
  bio: string,
  profileImage: string  // Cloudinary URL
}
```

### `about/main` (single document)
```js
{
  fullName: string,
  email: string,
  university: string,
  year: string,
  major: string,
  location: string,
  image: string,
  description: string,
  experience: [{ title, company, period, description }],
  education: [{ degree, school, period }]
}
```

### `contact/main` (single document)
```js
{
  email: string,
  phone: string,
  location: string,
  github: string,
  linkedin: string,
  facebook: string,
  instagram: string
}
```

### `projects` (collection)
```js
{
  title: string,
  description: string,
  category: string,
  image: string,
  technologies: string[],
  liveUrl: string,
  githubUrl: string,
  createdAt: Timestamp
}
```

### `skills` (collection)
```js
{
  name: string,
  category: string,    // Frontend | Backend | Database | Tools | Design | Other
  level: number,        // 0-100
  icon: string,         // emoji (заавал биш)
  createdAt: Timestamp
}
```

### `messages` (collection)
```js
{
  name: string,
  email: string,
  subject: string,
  message: string,
  read: boolean,
  createdAt: Timestamp
}
```

---

## 🔐 Аюулгүй байдал

- Admin route-ууд `ProtectedRoute` component-аар хамгаалагдсан
- Firestore Rules-ээр зөвхөн authenticated user write хийх боломжтой
- `messages` collection-ийг хэн ч `create` хийх боломжтой ч зөвхөн admin унших боломжтой
- Бүх форм input validation хийгдсэн
- `.env.local` файл нь `.gitignore`-т нэмэгдсэн

---

## 📝 Лиценз

Хувийн ашиглалтад зориулсан төсөл.

---

## 👤 Зохиогч

**А.Номин-Эрдэнэ**
Их Засаг Их Сургууль, Програм хангамжийн 3-р курсын оюутан
