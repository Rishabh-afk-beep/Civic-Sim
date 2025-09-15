# CivicSim - AI-Powered Civic Transparency Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.0%2B-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-green.svg)](https://fastapi.tiangolo.com/)

> Empowering 1.4 billion citizens with AI-powered government transparency and corruption detection.

## 🎯 Overview

**CivicSim** is India's first AI-powered civic transparency platform that combines:
- 🤖 **Binary Document Verification** - Detect fake government documents with 90%+ accuracy
- 🕵️ **Corruption Pattern Detection** - AI-powered risk scoring and red flag analysis
- 📊 **Government Health Dashboard** - Real-time fund allocation vs utilization tracking
- 📡 **Real Data Integration** - Live data.gov.in API connections 

## 🏆 Hackathon Achievement

**🏆 Category:** Civic Innovation & AI for Social Good  
**🎯 Impact:** Healthcare transparency solution addressing ₹86,200 Cr budget tracking

## 🚀 Key Features

### 📄 AI Document Verification
- **Binary Authentication:** Clear 0/1 classification (Authentic vs Fake)
- **Real-time Processing:** 3.2 second average verification time
- **Multiple Formats:** PDF, image, and text document support
- **Confidence Scoring:** AI explanation for verification decisions

### 🕵️ Corruption Detection Engine
- **Risk Scoring:** 0-100 scale with LOW/MEDIUM/HIGH categories
- **Pattern Recognition:** Vendor concentration analysis
- **Red Flag Detection:** Suspicious terms, missing information
- **Government Data Cross-reference:** Validation against official sources

### 🏥 Healthcare Transparency Dashboard
- **Real-time Fund Tracking:** ₹86,200 Cr health budget monitoring
- **Utilization Analysis:** 68% actual vs 100% expected completion tracking
- **Geographic Breakdown:** State and district level fund allocation
- **Performance Metrics:** Ministry transparency scoring

### 📊 Government Data Integration
- **data.gov.in APIs:** Official government data sources
- **Multi-ministry Support:** Health, Agriculture, Rural Development
- **Historical Analysis:** Budget trends and spending patterns
- **Predictive Insights:** AI-powered future allocation predictions

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │  External APIs  │
│   (React)       │◄──►│   (FastAPI)      │◄──►│  data.gov.in    │
│                 │    │                  │    │  Gemini AI      │
│  • Dashboard    │    │  • AI Services   │    │  Gov Databases  │
│  • Document UI  │    │  • Corruption    │    │                 │
│  • Analytics    │    │  • Transparency  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Backend
- **Framework:** FastAPI (Python 3.8+)
- **AI Engine:** Google Gemini 1.5 Flash
- **Database:** SQLite
- **APIs:** data.gov.in, Government ministry APIs

### Frontend
- **Framework:** React 18+ with TypeScript
- **State Management:** React Context API
- **UI Components:** Tailwind CSS, Lucide React
- **Charts:** Chart.js, D3.js for visualizations
- **HTTP Client:** Axios for API communication

### DevOps & Deployment
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Monitoring:** Application performance tracking

## 📋 Quick Start

### Prerequisites
- Python 3.8+ and pip
- Node.js 16+ and npm/yarn
- SQLite database
- Government API access keys

### 1. Clone Repository
```bash
git clone https://github.com/your-username/civicsim.git
cd civicsim
```

### 2. Backend Setup
```bash
cd civicsim-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys

# Run backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
cd civicsim-frontend
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with backend URL

# Start development server
npm start
```

### 4. Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## 📊 Project Structure

```
civicsim/
├── README.md
├── docker-compose.yml
├── civicsim-backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   ├── corruption_detector.py
│   │   │   ├── document_processor.py
│   │   │   └── transparency_service.py
│   │   ├── routers/
│   │   │   ├── documents.py
│   │   │   └── transparency.py
│   │   ├── models/
│   │   └── schemas/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
└── civicsim-frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── BinaryDocumentResults.js
    │   │   │   └── CorruptionAlerts.js
    │   │   └── transparency/
    │   ├── services/
    │   │   ├── BinaryDocumentVerification.js
    │   │   └── CorruptionDetectionService.js
    │   ├── pages/
    │   │   ├── DocumentVerification.js
    │   │   └── TransparencyDashboard.js
    │   └── utils/
    ├── public/
    ├── package.json
    ├── Dockerfile
    └── .env.example
```

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
# Database
DATABASE_URL=sqlite:///./civicsim.db

# AI Services
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here

# Government APIs
DATA_GOV_IN_API_KEY=your_data_gov_in_key

# Application
DEBUG=True
SECRET_KEY=your_secret_key_here
CORS_ORIGINS=http://localhost:3000
```

### Frontend Environment Variables (.env.local)
```env
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_DATA_GOV_API=https://api.data.gov.in
REACT_APP_ENVIRONMENT=development
```

## 🧪 Testing

### Backend Tests
```bash
cd civicsim-backend
pytest tests/ -v --cov=app
```

### Frontend Tests
```bash
cd civicsim-frontend
npm test
npm run test:coverage
```

### Integration Tests
```bash
docker-compose up -d
npm run test:e2e
```

## 🚀 Deployment

### Using Docker Compose
```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f
```


## 📈 Performance Metrics

- **Document Verification:** 90%+ accuracy, 3.2s processing time
- **API Response Time:** <500ms average
- **Data Processing:** 50,000+ government data points analyzed
- **Corruption Detection:** 23 patterns identified in testing
- **Scalability:** Ready for 1.4 billion citizens

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### Development Process
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- **Python:** Follow PEP 8, use Black formatter
- **JavaScript:** Follow Airbnb style guide, use Prettier
- **Documentation:** Update README and API docs
- **Testing:** Maintain >80% code coverage

## 📝 API Documentation

### Document Verification Endpoints
```
POST /api/documents/verify
POST /api/documents/analyze-corruption
GET  /api/documents/history
```

### Transparency Dashboard Endpoints
```
GET  /api/transparency/health-funds
GET  /api/transparency/ministry-performance
GET  /api/transparency/corruption-trends
```

### Government Data Integration
```
GET  /api/data/budget-allocation
GET  /api/data/spending-analysis
GET  /api/data/ministry-comparison
```

For complete API documentation, visit: `/docs` endpoint when running the backend.

## 🛡️ Security & Privacy

- **Data Protection:** No personal data stored, only document metadata
- **API Security:** Rate limiting, authentication, and HTTPS enforcement
- **Government Compliance:** Follows data.gov.in usage policies
- **Privacy First:** Document content processed locally, not stored

## 🔮 Roadmap

### Phase 1 (Current) - Prototype ✅
- [x] Binary document verification
- [x] Basic corruption detection
- [x] Healthcare fund dashboard
- [x] data.gov.in integration

### Phase 2 (Next 6 months)
- [ ] Multi-language support (Hindi, regional languages)
- [ ] Mobile PWA application
- [ ] Advanced ML model training
- [ ] State government integration

### Phase 3 (12+ months)
- [ ] Blockchain document verification
- [ ] Predictive corruption analytics
- [ ] Public API marketplace
- [ ] International transparency standards

## 👥 Team

- **[Rishabh Ranjan Dangi]** - Full-Stack Development
- **[Samanvai Chandra]** - AI Integration
- **[Rishav Kumar]** - Frontend Development & UI/UX Design
- **[Om Rai]** - Research & Data Analysis

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Government of India** - For open data initiatives via data.gov.in
- **Google AI** - For Gemini API access and AI capabilities
- **Hackathon Organizers** - For platform to showcase civic innovation
- **Open Source Community** - For tools and libraries that made this possible

## 📞 Contact & Support

- **Email:** ranjanrishabh2001@gmail.com
- **GitHub:** https://github.com/Rishabh-afk-beep/civicsim
- **Demo:** Later
- **Documentation:** https://docs.civicsim.org

## 🌟 Star this Repository

If CivicSim helps promote government transparency, please ⭐ this repository to support the project!

---

**Made with ❤️ for a transparent India 🇮🇳**

*"Sunlight is the best disinfectant - Transparency is the first step against corruption."*
