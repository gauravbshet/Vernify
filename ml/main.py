from loader import load_dataset
from detector import detect_sensitive_columns
from bias_metrics import representation_bias, outcome_bias
from scorer import fairness_score
from report import generate_report

df = load_dataset("trial_01_Diabetes_unbiased.csv")
sensitive = detect_sensitive_columns(df)

rep = representation_bias(df[sensitive['gender']])
out = outcome_bias(df, sensitive['gender'], 'eligibility_score')

score, status = fairness_score(rep, out)
report = generate_report(
    score, status, {"gender_representation_bias": rep, "gender_outcome_bias": out})

print(report)
