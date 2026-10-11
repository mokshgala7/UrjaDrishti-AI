# UrjaDrishti AI — Local MySQL Database Integration & Workbench Guide

This guide describes how to run and demonstrate the entire **UrjaDrishti AI** system locally on your macOS laptop using a local **MySQL Server** managed with **MySQL Workbench**.

---

## 1. System Architecture

```text
React + Vite Frontend (Port 3000)
        │
        │ HTTP API requests (/api/v1/...)
        ▼
Flask REST Backend (Port 5001)
        │
        │ SQLAlchemy 2.0 + PyMySQL Driver (Connection Pool, Pre-Ping)
        ▼
Local MySQL Server (Port 3306)
        │
        ▼
Database: urjadrishti_ai (InnoDB)
        ▲
        │ Visual Inspection & Queries
MySQL Workbench GUI
```

- **All database queries flow through the Flask backend.** The frontend never talks directly to MySQL.
- **Local Laptop Execution:** No cloud databases (AWS RDS, Supabase, Atlas, Firebase) are used.
- **CSV Data Integrity:** Electricity consumption CSV datasets and dynamic registry hot-reloading remain completely preserved on disk in `ml/data/`. MySQL stores application records (bills, predictions, anomaly events, logs).

---

## 2. Prerequisites

| Software | Version | Purpose |
| :--- | :--- | :--- |
| **macOS** | Monterey (12)+ / Sonoma / Sequoia | Operating System |
| **MySQL Community Server** | 8.0+ or 8.4 LTS | Local relational database daemon |
| **MySQL Workbench** | 8.0+ | Visual database management and inspection |
| **Python** | 3.10+ (Tested on 3.14) | Flask backend, ML models, SQLAlchemy |
| **Node.js & npm** | Node 18+ | React + Vite frontend |

---

## 3. Starting MySQL Server on macOS

On macOS, MySQL Server can be started in one of the following standard ways:

### Option A: macOS System Settings (Recommended for Official MySQL .pkg)
1. Open **System Settings** on your Mac.
2. Scroll to the bottom of the left sidebar and click **MySQL**.
3. Click **Start MySQL Server**. Ensure the status indicator turns **Active (Green)**.

### Option B: Terminal Command
```bash
sudo /usr/local/mysql/support-files/mysql.server start
```
To check status:
```bash
/usr/local/mysql/support-files/mysql.server status
```

### Option C: Homebrew (If installed via brew)
```bash
brew services start mysql
```

---

## 4. Connecting MySQL Workbench

1. Launch **MySQL Workbench** from your Applications folder.
2. Under **MySQL Connections**, click the **+** (Add Connection) icon.
3. Configure the connection parameters:
   - **Connection Name:** `Local UrjaDrishti MySQL`
   - **Connection Method:** `Standard (TCP/IP)`
   - **Hostname:** `127.0.0.1`
   - **Port:** `3306`
   - **Username:** `root` (or your dedicated user)
4. Click **Test Connection**. Enter your MySQL root password if prompted.
5. Click **OK** to save the connection, then double-click the connection tile to open the SQL editor.

---

## 5. Creating the Database Schema

You can create the database in MySQL Workbench or via the automated CLI script.

### Method A: Run `schema.sql` in MySQL Workbench (Recommended)
1. In MySQL Workbench, click **File** > **Open SQL Script...**
2. Select:
   ```text
   UrjaDrishti-AI/backend/database/schema.sql
   ```
3. Click the **Execute (⚡ Execute the selected portion)** icon on the toolbar.
4. In the left **Navigator** pane, right-click and click **Refresh All**.
5. You will see the database `urjadrishti_ai` with 4 tables:
   - `consumption_logs`
   - `prediction_history`
   - `billing_history`
   - `anomaly_events`

### Method B: Automated CLI Script
From your terminal:
```bash
cd "/Users/moksh/Downloads/Electricity Bill Ml project/UrjaDrishti-AI/backend"
venv/bin/python -m database.init_db
```

---

## 6. Configuring Backend Environment Variables

Configure your credentials in `backend/.env`.

```dotenv
# Server Settings
PORT=5001
HOST=0.0.0.0
DEBUG=True
CORS_ORIGINS=*
CEA_GRID_EMISSION_FACTOR=0.716

# Local MySQL Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=urjadrishti_ai
DB_USER=root
DB_PASSWORD=your_local_mysql_password
```

> **Security Note:**
> - Never commit `.env` to GitHub. It is ignored by `.gitignore`.
> - Special characters in passwords (e.g. `@`, `#`, `!`, `:`) are safely and automatically URL-encoded by SQLAlchemy's `URL.create()` utility.

### Optional: Creating a Dedicated MySQL User
If you prefer not to use `root`, run this in MySQL Workbench:
```sql
CREATE USER IF NOT EXISTS 'urja_app'@'localhost' IDENTIFIED BY 'UrjaSecure2026!';
GRANT ALL PRIVILEGES ON urjadrishti_ai.* TO 'urja_app'@'localhost';
FLUSH PRIVILEGES;
```
Then update `backend/.env`:
```dotenv
DB_USER=urja_app
DB_PASSWORD=UrjaSecure2026!
```

---

## 7. Installing Dependencies

Activate the backend virtual environment and install the requirements (including SQLAlchemy 2.0+, PyMySQL, and cryptography):

```bash
cd "/Users/moksh/Downloads/Electricity Bill Ml project/UrjaDrishti-AI/backend"
venv/bin/pip install -r requirements.txt
```

---

## 8. Initializing Tables via CLI

Run the database verification tool to ensure all 4 tables are ready:

```bash
cd "/Users/moksh/Downloads/Electricity Bill Ml project/UrjaDrishti-AI/backend"
venv/bin/python -m database.init_db
```

Expected output:
```text
=================================================================
  UrjaDrishti AI — Database Initialization Tool
  Target: mysql+pymysql://root:***@127.0.0.1:3306/urjadrishti_ai
=================================================================
[INFO] Connecting to MySQL host 127.0.0.1:3306...
[INFO] Target database 'urjadrishti_ai' exists and is accessible.
[INFO] Ensuring all application tables exist in 'urjadrishti_ai'...
[INFO] Database verification results:
  [✓] Table 'consumption_logs' present (7 columns)
  [✓] Table 'prediction_history' present (8 columns)
  [✓] Table 'billing_history' present (8 columns)
  [✓] Table 'anomaly_events' present (10 columns)

[SUCCESS] UrjaDrishti AI database is ready!
```

---

## 9. Starting the Project Locally

### Step 1: Start Backend (Terminal 1)
```bash
cd "/Users/moksh/Downloads/Electricity Bill Ml project/UrjaDrishti-AI/backend"
venv/bin/python app.py
```
Backend will start on `http://127.0.0.1:5001`.

### Step 2: Start Frontend (Terminal 2)
```bash
cd "/Users/moksh/Downloads/Electricity Bill Ml project/UrjaDrishti-AI/frontend"
npm run dev
```
Frontend will be accessible at `http://localhost:3000`.

---

## 10. Verifying Database Health & Live Operations

### 1. Database Health Check API
In your browser or terminal, check the dedicated database health endpoint:
```bash
curl http://127.0.0.1:5001/api/v1/health/database
```
Response when connected:
```json
{
  "connected": true,
  "database_name": "urjadrishti_ai",
  "database_type": "mysql",
  "host": "127.0.0.1:3306",
  "masked_url": "mysql+pymysql://root:***@127.0.0.1:3306/urjadrishti_ai",
  "error": null
}
```

### 2. Verify Persistence in MySQL Workbench
1. Open the calculator on the frontend (`http://localhost:3000`).
2. Move the slider (e.g. 175 units) and calculate a bill for **Adani Electricity** or **BEST Undertaking**.
3. In **MySQL Workbench**, open a Query Tab and run:
   ```sql
   USE urjadrishti_ai;
   SELECT id, created_at, provider, units, tariff_fy, total_bill, calculation_status 
   FROM billing_history 
   ORDER BY id DESC LIMIT 10;
   ```
4. You will see your simulated bill saved with accurate monetary precision (`DECIMAL(10, 2)`).

5. To inspect prediction history:
   ```sql
   SELECT id, created_at, model_id, horizon_hours, predicted_load_kw, confidence_lower, confidence_upper 
   FROM prediction_history 
   ORDER BY id DESC LIMIT 10;
   ```

6. To inspect anomaly events:
   ```sql
   SELECT id, timestamp, household_id, actual_kwh, severity, score, detector 
   FROM anomaly_events 
   ORDER BY id DESC LIMIT 10;
   ```

---

## 11. Troubleshooting Common Errors

### Error: `[Errno 61] Connection refused`
- **Cause:** Local MySQL Server is not running on port 3306.
- **Fix:** Open macOS **System Settings** > **MySQL** > click **Start MySQL Server**, or run `sudo /usr/local/mysql/support-files/mysql.server start`.

### Error: `(1045) Access denied for user 'root'@'localhost'`
- **Cause:** Incorrect password specified in `backend/.env`.
- **Fix:** Verify `DB_PASSWORD` in `backend/.env`. If you set a root password during MySQL installation, ensure it matches.

### Error: `(1049) Unknown database 'urjadrishti_ai'`
- **Cause:** Database has not yet been created.
- **Fix:** Open `backend/database/schema.sql` in MySQL Workbench and click the ⚡ Execute icon, or run `venv/bin/python -m database.init_db`.

### Driver Authentication: `caching_sha2_password`
- **Fix:** Already resolved! `cryptography>=42.0.0` is included in `requirements.txt` to support MySQL 8's default authentication mechanism natively.

---

## 12. Running Automated Tests

The automated test suite runs in an isolated in-memory test environment to prevent modifying or dropping any live local records in your `urjadrishti_ai` database:

```bash
cd "/Users/moksh/Downloads/Electricity Bill Ml project/UrjaDrishti-AI"
backend/venv/bin/pytest tests/ -v
```

All 49 unit and integration tests pass, covering:
- Safe MySQL URL encoding with special characters
- Database connection lifecycle and connection pooling
- Transaction rollback on failure
- Prediction, billing, anomaly, and consumption persistence
- CSV dataset discovery and hot reload
- Tariff calculations for Adani Electricity and BEST Undertaking
