# Project Overview: AI Maintenance Predictor Dashboard

## What We Are Building
We are building a lightweight **AI-powered predictive maintenance dashboard** for industrial assets such as pumps, motors, compressors, and turbines.

The system allows users to upload historical sensor data (CSV), train a simple machine learning model, and visualize **asset failure risk** in a clear, operationally useful way.

The end goal is to help maintenance teams move from **reactive** to **proactive** maintenance.

---

## Core Problem
Industrial assets generate large volumes of time-series sensor data (temperature, vibration, pressure, current, etc.), but:

- Data is often reviewed manually via CSVs
- Monitoring relies on static thresholds
- Early warning signals are hard to interpret
- Risk is difficult to communicate to non-technical stakeholders

This leads to unplanned downtime and higher repair costs.

---

## Solution Summary
The dashboard converts raw sensor data into **clear risk levels** (Green / Yellow / Red) using a small, explainable ML model.

Users can:
1. Upload sensor CSVs
2. Train a predictive model
3. Run a risk assessment
4. View asset-level risk and recommendations
5. Drill into asset details to understand “why”

---

## Target Users
- **Maintenance Engineers** – plan inspections and repairs
- **Reliability Engineers** – analyze fleet health and failure drivers
- **Operations Leaders** – prioritize work to reduce downtime

---

## Key Capabilities
- CSV upload and validation
- Time-series feature engineering (rolling stats, lag features)
- Binary classification model for failure risk
- Risk mapping to Green / Yellow / Red
- Fleet-level asset overview
- Asset detail view with charts, drivers, and recommendations

---

## High-Level Architecture
- **Backend:** FastAPI (Python)
- **ML:** scikit-learn (Random Forest)
- **Frontend:** React
- **Charts:** Recharts

The system follows a simple batch workflow (not real-time streaming).

---

## Frontend UX Flow (3 Pages)
1. **Dashboard**
   - Step-based workflow: Upload → Train → Assess
2. **Assets (Fleet Overview)**
   - Table of assets with risk badges and key metrics
3. **Asset Detail**
   - Time-series charts
   - Risk explanation (top drivers)
   - Clear maintenance recommendation

The UI is designed to be **clean, modern, and decision-focused**, not an ML tool.

---

## Backend API (Conceptual)
- `POST /upload` – upload sensor CSV
- `POST /train` – train model on historical data
- `POST /predict` – compute asset risk
- `GET /assets` – fleet overview
- `GET /assets/{id}` – asset detail view

---

## Risk Interpretation
- **Green:** Normal operation → continue monitoring
- **Yellow:** Warning signals → plan inspection
- **Red:** High failure risk → urgent action

Risk is derived from model-predicted failure probability.

---

## MVP Scope
This is an MVP focused on clarity and usability:
- No authentication
- No streaming data
- No advanced explainability
- No automated alerts

The emphasis is on:
- Clear workflow
- Explainable risk
- Strong demo value
- Easy extensibility

---

## Mental Model
“Upload sensor history → train a small model → convert noisy data into clear, explainable maintenance decisions.”

This document describes the system at a level intended for AI-assisted frontend/backend iteration and design generation.
