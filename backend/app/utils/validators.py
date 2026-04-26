import pandas as pd
from typing import List

def validate_columns_exist(df: pd.DataFrame, columns: List[str]):
    """Ensure that all specified columns exist in the DataFrame."""
    missing_columns = [col for col in columns if col not in df.columns]
    if missing_columns:
        raise ValueError(
            f"The following required columns are missing from the dataset: {', '.join(missing_columns)}"
        )

def validate_target_column(df: pd.DataFrame, target_column: str):
    """Validate that the target column exists and is not entirely empty."""
    validate_columns_exist(df, [target_column])
    
    if df[target_column].isnull().all():
        raise ValueError(f"The target column '{target_column}' is completely empty (contains only missing values).")

def validate_sensitive_column(df: pd.DataFrame, sensitive_column: str):
    """Validate that the sensitive attribute column exists and represents discrete groups."""
    validate_columns_exist(df, [sensitive_column])
    
    unique_values = df[sensitive_column].nunique()
    
    if unique_values <= 1:
        raise ValueError(
            f"The sensitive column '{sensitive_column}' must have more than one unique value "
            "to measure bias between different groups."
        )
        
    if unique_values > 50:
        raise ValueError(
            f"The sensitive column '{sensitive_column}' has too many unique values ({unique_values}). "
            "It should represent distinct demographic groups (like age groups, gender, etc.), not a continuous number."
        )

def validate_feature_columns(df: pd.DataFrame, feature_columns: List[str]):
    """Validate that feature columns are provided and exist in the dataset."""
    if not feature_columns:
        raise ValueError("You must provide at least one feature column for the model to use.")
        
    validate_columns_exist(df, feature_columns)

def validate_binary_target(df: pd.DataFrame, target_column: str):
    """Ensure the target column is binary (exactly two unique outcomes)."""
    validate_target_column(df, target_column)
    
    # Drop nulls before counting to ensure we're counting actual classes
    unique_values = df[target_column].dropna().unique()
    
    if len(unique_values) != 2:
        raise ValueError(
            f"The target column '{target_column}' must be binary (exactly 2 classes, like Yes/No or 1/0) "
            f"for this analysis. Found {len(unique_values)} unique value(s): {unique_values.tolist()}"
        )
