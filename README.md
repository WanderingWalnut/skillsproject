# AI Maintenance Predictor

An AI-powered predictive maintenance dashboard that converts industrial sensor data into actionable risk assessments. The system uses machine learning to predict equipment failures and provides clear risk levels (Green/Yellow/Red) for proactive maintenance planning.

![Fleet Overview](https://img.shields.io/badge/Status-MVP-blue) ![Python](https://img.shields.io/badge/Python-3.9+-green) ![React](https://img.shields.io/badge/React-19-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.124-teal)

## Features

- **CSV Data Upload**: Import sensor telemetry data (temperature, vibration, pressure, current)
- **ML Model Training**: Train anomaly detection models on historical data
- **Risk Assessment**: Predict failure probability and assign risk levels
- **Fleet Overview**: Dashboard showing all assets with their current risk status
- **Time-Series Visualization**: Interactive charts showing failure risk trends over time
- **Diagnostic Reports**: Detailed asset analysis with root cause suggestions

## Risk Levels

| Level | Probability | Meaning | Action |
|-------|-------------|---------|--------|
| 🟢 Normal | < 50% | Healthy operation | Continue monitoring |
| 🟡 Attention | 50-80% | Warning signals detected | Schedule inspection |
| 🔴 High Risk | > 80% | High failure probability | Urgent action required |

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM (SQLite for development)
- **scikit-learn** - Machine learning (Random Forest classifier)
- **pandas/numpy** - Data processing

### Frontend
- **React 19** + TypeScript
- **Tailwind CSS** - Styling
- **Recharts** - Interactive charts
- **React Router** - Navigation
- **Vite** - Build tool

## Project Structure

```
skillsproject/
├── client/                    # React frontend
│   ├── src/
│   │   ├── app/routes/        # Page components
│   │   ├── components/        # Shared UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # API client & utilities
│   │   ├── stores/            # State management
│   │   └── types/             # TypeScript types
│   └── package.json
├── server/                    # FastAPI backend
│   ├── app/
│   │   ├── api/api_v1/routes/ # API endpoints
│   │   ├── core/services/     # Business logic
│   │   ├── crud/              # Database operations
│   │   ├── models/            # SQLAlchemy models
│   │   └── schemas/           # Pydantic schemas
│   └── requirements.txt
├── sample_maintenance_data.csv # Demo dataset
└── README.md
```

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn

### 1. Clone & Setup Backend

```bash
# Create and activate virtual environment
cd server
python -m venv ../venv
source ../venv/bin/activate  # On Windows: ..\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### 2. Setup Frontend

```bash
# In a new terminal
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

## Usage

### Basic Workflow

1. **Upload Data**: Click "Use Sample Dataset" or upload your own CSV
2. **Train Model**: Click "Train Anomaly Detector" to build the ML model
3. **Run Assessment**: Click "Run Assessment" to predict failure risks
4. **View Results**: Explore the Fleet Overview and click assets for detailed charts

### Sample Data Format

The CSV should contain these columns:

| Column | Type | Description |
|--------|------|-------------|
| `timestamp` | datetime | Reading timestamp (ISO 8601) |
| `asset_id` | string | Unique asset identifier |
| `temperature` | float | Temperature reading (°C) |
| `vibration` | float | Vibration level (mm/s) |
| `pressure` | float | Pressure reading |
| `current` | float | Electrical current (A) |
| `label` | int | Failure label (0=normal, 1=failure) - for training |

### Seed Demo Data

To populate the charts with varied demo prediction history:

```bash
curl -X POST "http://localhost:8000/api/v1/seed-demo-data"
```

This creates 24 hours of prediction history with interesting patterns:
- **PUMP_003**: Escalating risk (equipment degrading)
- **MOTOR_001**: Recovery pattern (post-maintenance improvement)
- **PUMP_001**: Normal operation with occasional spikes
- **PUMP_002**: Hovering around warning threshold

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/train` | Train ML model with CSV data |
| `POST` | `/api/v1/predict` | Run risk assessment on data |
| `GET` | `/api/v1/assets` | List all assets with latest risk |
| `GET` | `/api/v1/assets/{id}` | Get asset detail with prediction history |
| `POST` | `/api/v1/seed-demo-data` | Seed demo prediction data |

## Development

### Running Tests

```bash
# Backend (if tests are added)
cd server
pytest

# Frontend (if tests are added)
cd client
npm test
```

### Building for Production

```bash
# Frontend build
cd client
npm run build

# Output in client/dist/
```

### Database

The project uses SQLite by default (`server/maintenance_predictor.db`). For production, set `DATABASE_URL` environment variable to use PostgreSQL or another database.

## Screenshots

### Fleet Overview
Shows all assets in a table with risk badges, temperature, vibration, and failure probability.

### Asset Detail
Interactive time-series chart showing failure risk trend over 24 hours with Warning (50%) and Critical (80%) threshold lines.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational and demonstration purposes. The code here is not available for reuse!

---

Built with ❤️ for predictive maintenance

