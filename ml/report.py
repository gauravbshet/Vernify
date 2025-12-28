def generate_report(score, status, details):
    return {
        "fairness_score": score,
        "bias_status": status,
        "details": details,
        "recommendation": "Review sampling strategy"
    }
