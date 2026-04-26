import pandas as pd
from typing import List, Tuple, Dict, Any
from io import BytesIO

def read_csv_to_dataframe(file_content: bytes) -> pd.DataFrame:
    """Read uploaded CSV bytes into a pandas DataFrame."""
    try:
        df = pd.read_csv(BytesIO(file_content))
        return df
    except Exception as e:
        raise ValueError(f"Failed to parse CSV file: {str(e)}")

def handle_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """
    Handle missing values in the DataFrame.
    - Numeric columns: fill with median
    - Categorical columns: fill with 'Unknown'
    """
    df_cleaned = df.copy()
    
    for col in df_cleaned.columns:
        if pd.api.types.is_numeric_dtype(df_cleaned[col]):
            # Numeric column: fill with median
            median_val = df_cleaned[col].median()
            # Fallback if the entire column was NaN
            if pd.isna(median_val):
                median_val = 0
            df_cleaned[col] = df_cleaned[col].fillna(median_val)
        else:
            # Categorical/Text column: fill with 'Unknown'
            df_cleaned[col] = df_cleaned[col].fillna("Unknown")
            
    return df_cleaned

def encode_features(X: pd.DataFrame) -> pd.DataFrame:
    """One-hot encode categorical feature columns."""
    categorical_cols = X.select_dtypes(include=['object', 'category']).columns.tolist()
    
    if not categorical_cols:
        return X
        
    # get_dummies converts categorical variables into dummy/indicator variables.
    # drop_first=True prevents the dummy variable trap (perfect multicollinearity)
    X_encoded = pd.get_dummies(X, columns=categorical_cols, drop_first=True)
    return X_encoded

def preprocess_dataset(
    file_content: bytes,
    target_column: str,
    sensitive_column: str,
    feature_columns: List[str]
) -> Tuple[pd.DataFrame, pd.Series, pd.Series, Dict[str, Any]]:
    """
    Main preprocessing pipeline.
    
    Returns:
        X (pd.DataFrame): Cleaned and encoded feature matrix
        y (pd.Series): Target vector
        sensitive_series (pd.Series): Sensitive feature vector
        summary (Dict): Dataset summary information
    """
    # 1. Read CSV
    df = read_csv_to_dataframe(file_content)
    
    # 2. Check basic existence (assuming full validation already ran or runs before this)
    required_cols = [target_column, sensitive_column] + feature_columns
    missing_cols = [col for col in required_cols if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Missing required columns in dataset: {missing_cols}")

    # 3. Drop rows where the target or sensitive attribute itself is missing
    # We usually don't impute the target or the sensitive attribute we are studying
    df = df.dropna(subset=[target_column, sensitive_column])
    
    # 4. Subset the dataframe to only the columns we need
    df_selected = df[feature_columns + [target_column, sensitive_column]].copy()
    
    # 5. Handle missing values in our selected subset
    df_cleaned = handle_missing_values(df_selected)
    
    # 6. Separate components
    y = df_cleaned[target_column]
    sensitive_series = df_cleaned[sensitive_column]
    X_raw = df_cleaned[feature_columns]
    
    # 7. One-hot encode the features
    X = encode_features(X_raw)
    
    # 8. Create a summary dictionary for the API response
    summary = {
        "total_rows": len(df_cleaned),
        "total_features_used": len(feature_columns),
        "encoded_features_count": len(X.columns),
        "target_distribution": y.value_counts().to_dict(),
        "sensitive_group_distribution": sensitive_series.value_counts().to_dict()
    }
    
    return X, y, sensitive_series, summary
