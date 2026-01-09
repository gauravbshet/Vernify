# 🔬 Vernify

**Blockchain-Powered Bias Detection Platform for Clinical Trials Data**

Automatically detects bias in clinical trials datasets, provides fairness reports, and stores verification results on blockchain for auditability.

---

## ✨ Features

- 🔍 Automated bias detection with ML pipeline
- 📊 Explainable fairness reports
- 🔐 Dual-blockchain storage (Hyperledger Fabric + MultiChain)
- ☁️ Secure file storage with Supabase
- 👥 Multi-role dashboards (User, Admin, Validator)

---

## 🛠️ Tech Stack

**Backend:** FastAPI, Supabase, Pandas  
**Frontend:** React, Vite, Tailwind CSS  
**Blockchain:** Hyperledger Fabric, MultiChain

---

## 🚀 Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

### Environment Variables

**Backend `.env`:**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_STORAGE_BUCKET=uploads
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:8000
```

### Database

Run migration:
```bash
supabase sql "$(cat backend/db/migrations/001_create_tables.sql)"
```

### Run

**Backend:**
```bash
cd backend
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## 📡 API Endpoints

- `POST /auth/signup` - Register
- `POST /auth/signin` - Login
- `POST /api/upload` - Upload CSV/XLSX file
- `POST /api/verify/{upload_id}` - Start verification
- `GET /api/results/{verification_id}` - Get results
- `GET /api/history` - Verification history
- `GET /api/blockchain/audit/{verification_id}` - Blockchain audit

---

## 🔬 How It Works

1. Upload clinical trials dataset (CSV/XLSX)
2. ML engine detects sensitive columns and calculates bias
3. Generates fairness score (0-100) with explainable report
4. Stores results in database and blockchain

---

## 📁 Project Structure

```
Vernify/
├── backend/     # FastAPI backend
├── frontend/    # React frontend
└── ml/          # ML bias detection engine
```

---

**Built for fair and transparent clinical trials**
