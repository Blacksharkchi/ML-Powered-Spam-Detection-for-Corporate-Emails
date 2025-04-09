from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Union
import joblib
import logging
from fastapi.middleware.cors import CORSMiddleware
import os
from tensorflow.keras.models import load_model  # For LSTM support
import numpy as np

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

# Model paths
current_dir = os.path.dirname(os.path.abspath(__file__))
vectorizer_path = os.path.join(current_dir, "tfidf_vectorizer.pkl")
# model_path = os.path.join(current_dir, "best_model.pkl")  # Updated path
model_path = os.path.join(current_dir, "baseline_model.pkl")  # Updated path
# lstm_model_path = os.path.join(current_dir, "best_lstm_model.h5")  # LSTM alternative

# Model type detection
is_lstm = os.path.exists(lstm_model_path)
model = None
vectorizer = None

try:
    # Load vectorizer (same for all models)
    vectorizer = joblib.load(vectorizer_path)
    
    # Load appropriate model
    if is_lstm:
        model = load_model(lstm_model_path)
        logging.info("LSTM model loaded successfully")
    else:
        model = joblib.load(model_path)
        logging.info("Scikit-learn model loaded successfully")
        
except Exception as e:
    logging.error(f"Error loading model or vectorizer: {str(e)}")
    raise RuntimeError("Failed to load model files")

# Request/Response models (unchanged)
class EmailRequest(BaseModel):
    email_text: str

class BatchRequest(BaseModel):
    emails: List[str]

class ClassificationResult(BaseModel):
    classification: str
    is_spam: bool
    spam_probability: float
    model_version: str = "svm-v1" if not is_lstm else "lstm-v1"

def predict_proba(text_data: Union[str, List[str]]):
    """Unified prediction function handling both model types"""
    transformed = vectorizer.transform(text_data if isinstance(text_data, list) else [text_data])
    
    if is_lstm:
        # LSTM requires dense array reshaping
        dense_data = transformed.toarray().reshape((-1, 1, transformed.shape[1]))
        proba = model.predict(dense_data)
        return proba.flatten()
    else:
        # Standard scikit-learn predict_proba
        return model.predict_proba(transformed)[:, 1]

# API Endpoints (refactored)
@app.post("/classify_email", response_model=ClassificationResult)
async def classify_single_email(request: EmailRequest):
    try:
        proba = predict_proba(request.email_text)[0]
        
        return {
            "classification": "spam" if proba >= 0.5 else "ham",
            "is_spam": proba >= 0.5,
            "spam_probability": round(float(proba), 4),
            "model_version": "lstm-v1" if is_lstm else "svm-v1"
        }
    except Exception as e:
        logging.error(f"Classification error: {str(e)}")
        raise HTTPException(status_code=500, detail="Classification failed")

@app.post("/classify_emails", response_model=List[ClassificationResult])
async def classify_batch_emails(
    request: BatchRequest, 
    background_tasks: BackgroundTasks
):
    background_tasks.add_task(lambda: logging.info("Metrics updated"))
    
    try:
        probabilities = predict_proba(request.emails)
        return [{
            "classification": "spam" if proba >= 0.5 else "ham",
            "is_spam": proba >= 0.5,
            "spam_probability": round(float(proba), 4),
            "model_version": "lstm-v1" if is_lstm else "svm-v1"
        } for proba in probabilities]
    except Exception as e:
        logging.error(f"Batch classification error: {str(e)}")
        raise HTTPException(status_code=500, detail="Batch processing failed")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "model_loaded": model is not None,
        "model_type": "lstm" if is_lstm else "scikit-learn"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
