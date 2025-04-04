from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List
import joblib
import logging
from fastapi.middleware.cors import CORSMiddleware
import os

# Initialize FastAPI app
app = FastAPI(title="Spam Detection API")
logging.basicConfig(level=logging.INFO)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load pre-trained vectorizer & model separately
current_dir = os.path.dirname(os.path.abspath(__file__))
vectorizer_path = os.path.join(current_dir, "tfidf_vectorizer.pkl")
model_path = os.path.join(current_dir, "svm_model.pkl")

if not os.path.exists(vectorizer_path) or not os.path.exists(model_path):
    raise FileNotFoundError(f"Model files not found at {vectorizer_path} or {model_path}")
else:
    print(f"Model files found at: {vectorizer_path} and {model_path}")

try:
    vectorizer = joblib.load(vectorizer_path)
    model = joblib.load(model_path)
    logging.info("Vectorizer and Model loaded successfully")
except Exception as e:
    logging.error(f"Error loading model or vectorizer: {str(e)}")
    model = None
    vectorizer = None

# Request/Response models
class EmailRequest(BaseModel):
    email_text: str

class BatchRequest(BaseModel):
    emails: List[str]

class ClassificationResult(BaseModel):
    classification: str
    is_spam: bool
    spam_probability: float
    model_version: str = "svm-v1"

# Function to update metrics (background task)
def update_metrics():
    logging.info("Background task: Metrics updated.")

# Function to process a batch of emails
async def process_batch(emails: List[str]):
    transformed_emails = vectorizer.transform(emails) 
    return model.predict_proba(transformed_emails)[:, 1]

# API Endpoints
@app.post("/classify_email", response_model=ClassificationResult)
async def classify_single_email(request: EmailRequest):
    """Classify single email"""
    try:
        transformed_text = vectorizer.transform([request.email_text])  # Convert input
        proba = model.predict_proba(transformed_text)[0][1]

        return {
            "classification": "spam" if proba >= 0.5 else "ham",
            "is_spam": proba >= 0.5,
            "spam_probability": round(float(proba), 4)
        }
    except Exception as e:
        logging.error(f"Classification error: {str(e)}")
        raise HTTPException(status_code=500, detail="Classification failed")

@app.post("/classify_emails", response_model=List[ClassificationResult])
async def classify_batch_emails(
    request: BatchRequest, 
    background_tasks: BackgroundTasks
):
    """Classify multiple emails in batch"""
    background_tasks.add_task(update_metrics)

    transformed_emails = vectorizer.transform(request.emails)  # Ensure correct transformation
    probabilities = model.predict_proba(transformed_emails)[:, 1]

    return [{
        "classification": "spam" if proba >= 0.5 else "ham",
        "is_spam": proba >= 0.5,
        "spam_probability": round(float(proba), 4)
    } for proba in probabilities]

@app.get("/health")
async def health_check():
    """Service health endpoint"""
    return {"status": "healthy", "model_loaded": model is not None}

# For local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
