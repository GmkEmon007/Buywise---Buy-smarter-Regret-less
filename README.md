# BuyWise 2.0 — AI-Powered Purchase Intelligence SaaS

BuyWise is a high-performance full-stack web application designed to help consumers make confident purchasing decisions and avoid buyer's remorse. By aggregating reviews, forum sentiment, and specifications in real-time, BuyWise parses telemetry indicators into definitive metrics: **Buy Score, Regret Score, and Community Trust Ratings**.

---

## 🗺️ System Architecture

```mermaid
flowchart TD
    User([Browser Client]) -->|Next.js 15 App| Web[Next.js Frontend]
    Web -->|REST Requests| API[FastAPI Backend API]
    API -->|JWT Authentication| Auth[JWT Guards]
    API -->|Key-Value Cache| Redis[(Upstash Serverless Redis)]
    API -->|Relational Schema| DB[(Neon Serverless Postgres)]
    API -->|In-Context Analysis| AI[OpenAI / Google Gemini API]
    API -->|Product Telemetry| Scraper[Telemetry Product Provider]
```

---

## 📂 Project Structure

```text
buywise-v2/
├── apps/
│   ├── web/           # Next.js 15 Frontend (Vite/TypeScript, Tailwind, framer-motion)
│   └── api/           # FastAPI Backend Service (SQLAlchemy, Uvicorn, OpenAI/Gemini integration)
├── packages/
│   └── database/      # Database migrations and configuration schemas
├── .gitignore         # Root file mapping ignored folders (node_modules, .venv, .next)
├── README.md          # Project developer documentation
└── docker-compose.yml # Local services configuration file (Web, API, Postgres, Redis)
```

---

## ⚡ Technologies

*   **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Lucide icons, Framer Motion, Recharts.
*   **Backend**: Python, FastAPI, Pydantic v2, SQLAlchemy, Uvicorn.
*   **Databases**: PostgreSQL (SQLAlchemy ORM), Redis (caching and logs).
*   **AI Models**: OpenAI (gpt-4o-mini) and Google Gemini (gemini-1.5-flash) compatibility.

---

## 🚀 How to Setup and Run Locally

### 1. Backend Setup
1. Navigate to the API folder and create a virtual environment:
   ```bash
   cd apps/api
   python -m venv .venv
   ```
2. Activate the virtual environment:
   * **Windows (PowerShell)**: `.venv\Scripts\Activate.ps1`
   * **macOS / Linux**: `source .venv/bin/activate`
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file inside `apps/api/` and configure:
   ```env
   # Database Configurations
   DATABASE_URL=postgresql+psycopg://buywise:buywise_password@localhost:5432/buywise
   REDIS_URL=redis://localhost:6379/0
   
   # Choose either OpenAI or Gemini API Key:
   OPENAI_API_KEY=your_openai_key_here
   # OR
   GEMINI_API_KEY=your_gemini_key_here
   ```
5. Start the backend:
   ```bash
   uvicorn app.main:app --port 8000 --reload
   ```

### 2. Frontend Setup
1. Navigate to the web folder and install Node packages:
   ```bash
   cd apps/web
   npm install
   ```
2. Start the local server:
   ```bash
   npm run dev
   ```
3. Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔒 Security & Best Practices
*   **SQL Injection Guard**: All database queries leverage SQLAlchemy parameterized ORM execution, fully protecting database tables.
*   **Dynamic Session Keys**: The backend dynamically generates secure fallback session tokens (`secrets.token_hex(32)`) if the JWT secret is unconfigured, preventing session forgery exploits.
*   **Vulnerability Checks**: Verified **0 vulnerabilities** on package configurations.

---

## 🐙 How to Push to GitHub (Excluding Node & Python Cache)

Because folders like `node_modules`, `.next`, and `.venv` contain hundreds of megabytes of temporary compiled cache, they **must not** be pushed to GitHub. We have created a root `.gitignore` to handle this automatically.

1. **Initialize Git**:
   ```bash
   git init
   ```
2. **Verify Ignored Files**:
   Run the status command to make sure `node_modules`, `.next`, and `.venv` are NOT being tracked:
   ```bash
   git status
   ```
   *(You should only see files like `apps/`, `packages/`, `.gitignore`, and `README.md` listed as untracked).*
3. **Commit & Push**:
   ```bash
   git add .
   git commit -m "feat: initial commit for BuyWise v2 with Gemini API & upgraded admin dashboards"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```
