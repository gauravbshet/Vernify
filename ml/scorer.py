def fairness_score(rep_bias, out_bias):
    score = round((rep_bias + out_bias) / 2, 3)

    if score <= 0.10:
        return score, "Unbiased"
    elif score <= 0.25:
        return score, "Mildly Biased"
    else:
        return score, "Highly Biased"
