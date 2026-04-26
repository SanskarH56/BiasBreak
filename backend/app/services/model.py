import pandas as pd
from typing import Dict, Any
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

def train_and_evaluate_model(
    X: pd.DataFrame, 
    y: pd.Series, 
    sensitive_series: pd.Series
) -> Dict[str, Any]:
    """
    Splits the data, trains a baseline Logistic Regression model, and evaluates it.
    
    Returns a dictionary containing the trained model, split data, 
    predictions, probabilities, and accuracy score.
    """
    
    # 1. Split the data into Training (80%) and Testing (20%) sets.
    # We include 'sensitive_series' in the split so that we know the 
    # demographic group for every person in our test set.
    X_train, X_test, y_train, y_test, sens_train, sens_test = train_test_split(
        X, y, sensitive_series, test_size=0.2, random_state=42
    )
    
    # 2. Initialize the Logistic Regression Classifier
    # We set a fixed random_state for reproducible results and increase 
    # max_iter to ensure the model math finishes computing on large datasets.
    model = LogisticRegression(random_state=42, max_iter=1000)
    
    # 3. Train the model on the training data
    model.fit(X_train, y_train)
    
    # 4. Generate Predictions (the final Yes/No or 1/0 decisions)
    y_pred = model.predict(X_test)
    
    # 5. Generate Probabilities (the raw percentage confidence)
    # predict_proba returns two columns: [Probability of 0, Probability of 1].
    # We slice [:, 1] to grab just the probability of the "1" (positive) class.
    y_prob = model.predict_proba(X_test)[:, 1]
    
    # 6. Compute baseline accuracy
    accuracy = accuracy_score(y_test, y_pred)
    
    # 7. Return everything needed for downstream fairness calculations
    return {
        "model": model,
        "X_train": X_train,
        "y_train": y_train,
        "sens_train": sens_train,
        "X_test": X_test,
        "y_test": y_test,
        "y_pred": y_pred,
        "y_prob": y_prob,
        "sensitive_test": sens_test,
        "accuracy": accuracy
    }
