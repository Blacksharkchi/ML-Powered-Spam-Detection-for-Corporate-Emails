import joblib
import os

# Get the path of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "app", "spam_detection_pipeline.pkl")

print(f"🔍 Looking for model at: {model_path}")

# Load the model
try:
    model = joblib.load(model_path)
    print("Model loaded successfully!")

    # Test with a sample email
    test_email = ["WIN FREE PRIZE! Click here to claim your $1000"]
    prediction = model.predict(test_email)
    
    print(f"Test Prediction: {prediction}")  # Output should be [1] for spam or [0] for ham

except Exception as e:
    print(f"Error loading model: {e}")
