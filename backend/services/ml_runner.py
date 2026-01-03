import os
import tempfile
from concurrent.futures import ProcessPoolExecutor
from typing import Dict, Any

# We'll call ML code from the repository. To keep this runnable in a subprocess,
# define a module-level wrapper function that takes a local file path and returns
# a serializable dict (score, report, details).


def _run_ml_on_path(path: str) -> Dict[str, Any]:
    # Defensive import: ensure the repository root (parent of backend/) is on sys.path
    # so `import ml` works when the code runs from different CWDs or inside a subprocess.
    import sys
    from pathlib import Path
    repo_root = Path(__file__).resolve().parents[1]
    if str(repo_root) not in sys.path:
        sys.path.insert(0, str(repo_root))

    # Import here so subprocess has the same module path
    from ml import loader, detector, bias_metrics, scorer, report as report_module

    # Load dataset
    df = loader.load_dataset(path)

    sensitive = detector.detect_sensitive_columns(df)

    details = {}
    scores = []
    statuses = []

    # Find candidate outcome column: look for numeric columns with names containing 'score', 'outcome', 'elig' etc.
    candidate_outcome = None
    for c in df.columns:
        lower = c.lower()
        if any(k in lower for k in ["score", "outcome", "eligib", "result", "label"]):
            if df[c].dtype.kind in ("i", "u", "f"):
                candidate_outcome = c
                break
    if not candidate_outcome:
        # fallback to first numeric column
        for c in df.columns:
            if df[c].dtype.kind in ("i", "u", "f"):
                candidate_outcome = c
                break

    if not sensitive:
        # No sensitive columns detected
        details["sensitive_columns"] = []
        # Use default unbiased score (1.0 -> zero bias)
        score = 0.0
        status = "No sensitive attributes detected"
        rec = report_module.generate_report(score, "Unbiased", details)
        return {"score": score, "status": "Unbiased", "report": rec, "details": details}

    details["sensitive_columns"] = sensitive
    details["candidate_outcome"] = candidate_outcome

    # For each sensitive attribute compute representation and outcome bias if possible
    for key, col in sensitive.items():
        rep = bias_metrics.representation_bias(df[col])
        out = None
        if candidate_outcome:
            try:
                out = bias_metrics.outcome_bias(df, col, candidate_outcome)
            except Exception:
                out = None
        details[f"{key}_representation_bias"] = rep
        details[f"{key}_outcome_bias"] = out
        if out is None:
            out_val = 0.0
        else:
            out_val = out
        # Use average of rep and outcome (if present)
        if out is None:
            combined = rep
        else:
            combined = (rep + out_val) / 2
        scores.append(combined)

    # Combine scores across sensitive attributes by taking max (worst-case)
    raw_score = max(scores) if scores else 0.0
    # scorer.fairness_score expects rep and out for single attribute; we will derive label
    # We'll approximate label using raw_score similar to scorer
    score_label = None
    if raw_score <= 0.10:
        score_label = "Unbiased"
    elif raw_score <= 0.25:
        score_label = "Mildly Biased"
    else:
        score_label = "Highly Biased"

    represent = raw_score  # our internal bias metric 0..1 or more
    rec = report_module.generate_report(represent, score_label, details)

    return {"score": represent, "status": score_label, "report": rec, "details": details}


# Executor used for running ML in separate processes
_executor = None


def run_verification_file(path: str) -> Dict[str, Any]:
    global _executor
    if _executor is None:
        _executor = ProcessPoolExecutor(max_workers=os.cpu_count() or 1)
    future = _executor.submit(_run_ml_on_path, path)
    return future.result()
