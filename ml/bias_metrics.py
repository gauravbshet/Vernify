def representation_bias(series):
    dist = series.value_counts(normalize=True)
    return round(dist.max() - dist.min(), 3)


def outcome_bias(df, sensitive_col, outcome_col):
    rates = df.groupby(sensitive_col)[outcome_col].mean()
    return round(rates.max() - rates.min(), 3)
