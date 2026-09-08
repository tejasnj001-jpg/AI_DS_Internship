import os
import joblib
from django.conf import settings


# Path to the saved AI model
MODEL_PATH = os.path.join(
    settings.BASE_DIR,
    "ai_matching",
    "blood_donor_model.pkl"
)


# Load the trained model
model = joblib.load(MODEL_PATH)


def predict_donor_suitability(
    compatibility,
    distance_km,
    urgency,
    same_location,
    is_available
):
    """
    Predict donor suitability and confidence.
    """

    features = [[
        compatibility,
        distance_km,
        urgency,
        same_location,
        is_available
    ]]

    # AI prediction
    prediction = model.predict(features)

    # AI probability
    probabilities = model.predict_proba(features)

    confidence = max(probabilities[0]) * 100

    if prediction[0] == 1:
        result = "Suitable"
    else:
        result = "Not Suitable"

    return result, round(confidence, 2)