### **Backend API: FastAPI Implementation**  
*Expose the SVM model as a scalable microservice with RESTful endpoints.*  

---

### **1. Core Architecture**  
- **Framework**: FastAPI (async, auto-docs, production-ready).  
- **Key Components**:  
  ```python
  # Load model pipeline (TF-IDF + SVM)
  model = joblib.load("spam_detection_pipeline.pkl")  # Pre-trained
  
  # Enable CORS for frontend integration
  app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"])
  ```

---

### **2. Key Endpoints**  
#### **A. Single Email Classification (`/classify_email`)**  
- **Input**: Raw email text.  
- **Output**:  
  ```json
  {
    "classification": "spam",
    "is_spam": true,
    "spam_probability": 0.9921,
    "model_version": "ensemble-v1"
  }
  ```
- **Logic**:  
  ```python
  proba = model.predict_proba([email_text])[0][1]  
  ```

#### **B. Batch Processing (`/classify_emails`)**  
- **Input**: List of emails (e.g., corporate inbox dump).  
- **Features**:  
  - Background task to log metrics (`update_metrics()`).  
  - Parallel prediction using `predict_proba()`.  

#### **C. Health Check (`/health`)**  
- **Use Case**: Monitoring/alerts.  
- **Response**:  
  ```json
  {"status": "healthy", "model_loaded": true}
  ```

---

### **3. Production-Ready Features**  
- **Type Safety**: Pydantic models validate all requests/responses.  
- **Error Handling**:  
  - Logs errors (e.g., model loading failures).  
  - Returns HTTP 500 with details if classification fails.  
- **Scalability**:  
  - Async support for high-concurrency workloads.  
  - Background tasks for non-critical ops (e.g., metrics).  

---

### **4. Security**  
- **CORS**: Restricted to frontend origin (`http://localhost:5173`).  
- **HTTPS**: Ready for deployment (commented middleware for local testing).  

---
