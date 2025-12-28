import pandas as pd

SENSITIVE_MAP = {
    "gender": ["gender", "sex"],
    "age": ["age", "dob"],
    "ethnicity": ["ethnicity", "race"],
    "region": ["region", "location"]
}


def detect_sensitive_columns(df):
    detected = {}
    for col in df.columns:
        col_lower = col.lower()
        for key, keywords in SENSITIVE_MAP.items():
            if any(k in col_lower for k in keywords):
                detected[key] = col
    return detected
