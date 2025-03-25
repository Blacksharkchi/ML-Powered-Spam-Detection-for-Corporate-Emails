from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_classification():
    response = client.post("/classify_email", 
        json={"email_text": "Free crypto investment opportunity!"}
    )
    assert response.status_code == 200
    assert response.json()["classification"] == "spam"
    assert response.json()["spam_probability"] > 0.9