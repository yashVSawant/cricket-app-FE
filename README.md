# Cricket Tournament Platform - Frontend Web App

Production-grade Next.js App Router application built with TypeScript, Tailwind CSS, Redux Toolkit + RTK Query, React Hook Form, and Socket.IO.

---

## 🎨 Design System & Theme Tokens
The platform follows a strict visual system conforming to:
- **Primary (Blue)**:
  - 50: `#EFF6FF`
  - 100: `#DBEAFE`
  - 500: `#3B82F6`
  - 600: `#2563EB`
  - 700: `#1D4ED8`
  - 900: `#1E3A8A` (Navbar, brand depth)
- **Accent (Orange)**:
  - 50: `#FFF7ED`
  - 100: `#FFEDD5`
  - 500: `#F97316` (LIVE badges, CTAs, boundaries)
  - 600: `#EA580C`
  - 700: `#C2410C`
- **Surface**: `#FFFFFF`

### 🔒 Architectural Hard Rule
Pages must **NEVER** use raw `<button>`, `<input>`, `<select>`, `<table>` or ad-hoc modals. All views strictly compose from `components/ui/`, `components/forms/`, and `components/layout/`.

---

## 📋 Environment Variables (`.env.local`)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend REST API URL | `http://localhost:4000/api/v1` |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server URL | `http://localhost:4000` |

---

## 🚀 Running Locally

```bash
npm install
npm run dev
```

Visit the app at `http://localhost:3000`.
Explore the complete UI Kit at `http://localhost:3000/styleguide`.

---

## 🐳 Docker Deployment (Separate Web Server)

Frontend is built as a self-contained Next.js `standalone` runner container:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL="https://api.crickethub.example.com/api/v1" \
  --build-arg NEXT_PUBLIC_SOCKET_URL="https://api.crickethub.example.com" \
  -t cricket-frontend:latest .

docker run -p 3000:3000 -d cricket-frontend:latest
```
