from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List
import joblib
import logging
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
import os

# Initialize app and load model
app = FastAPI(title="Spam Detection API")
logging.basicConfig(level=logging.INFO)

# Load pre-trained ensemble model and preprocessing

current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "spam_detection_pipeline.pkl")


try:
    model = joblib.load(model_path)
    logging.info("Model loaded successfully")
except Exception as e:
    logging.error(f"Model loading failed: {str(e)}")
    raise RuntimeError("Failed to initialize model")

# Request/Response models
class EmailRequest(BaseModel):
    email_text: str

class BatchRequest(BaseModel):
    emails: List[str]

class ClassificationResult(BaseModel):
    classification: str
    is_spam: bool
    spam_probability: float
    model_version: str = "ensemble-v1"

# Function to update metrics (background task)
def update_metrics():
    logging.info("Background task: Metrics updated.")

# Function to process a batch of emails (using the model)
async def process_batch(emails: List[str]):
    return model.predict_proba(emails)[:, 1]

# API Endpoints
@app.post("/classify_email", response_model=ClassificationResult)
async def classify_single_email(request: EmailRequest):
    """Classify single email"""
    try:
        proba = model.predict_proba([request.email_text])[0][1]
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
    probabilities = await process_batch(request.emails)
    return [{
        "classification": "spam" if proba >= 0.5 else "ham",
        "is_spam": proba >= 0.5,
        "spam_probability": round(float(proba), 4)
    } for proba in probabilities]

@app.get("/health")
async def health_check():
    """Service health endpoint"""
    return {"status": "healthy", "model_loaded": model is not None}

# Add HTTPS redirect middleware
app.add_middleware(HTTPSRedirectMiddleware)

# For local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)

