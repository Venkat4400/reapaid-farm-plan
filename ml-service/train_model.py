"""
Crop Yield Prediction Model Training Script

This script trains a Random Forest Regressor model on crop yield data.
It handles data preprocessing, model training, evaluation, and saves the trained model.
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

# Paths
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "crop_yield.csv")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")
ENCODERS_PATH = os.path.join(MODEL_DIR, "encoders.pkl")
METRICS_PATH = os.path.join(MODEL_DIR, "metrics.json")


def load_data():
    """Load the crop yield dataset."""
    print("Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    print(f"Dataset loaded: {len(df)} samples")
    print(f"Columns: {list(df.columns)}")
    return df


def preprocess_data(df):
    """Preprocess the dataset for training."""
    print("\nPreprocessing data...")
    
    # Create copies of the dataframe
    df = df.copy()
    
    # Define categorical columns
    categorical_cols = ['crop', 'soil_type', 'region', 'season']
    
    # Create label encoders for categorical features
    encoders = {}
    for col in categorical_cols:
        le = LabelEncoder()
        df[col + '_encoded'] = le.fit_transform(df[col].str.lower().str.strip())
        encoders[col] = le
        print(f"  Encoded {col}: {list(le.classes_)}")
    
    # Define features and target
    feature_cols = [col + '_encoded' for col in categorical_cols] + ['rainfall', 'temperature', 'humidity']
    X = df[feature_cols]
    y = df['yield']
    
    print(f"\nFeatures: {list(X.columns)}")
    print(f"Target: yield")
    print(f"X shape: {X.shape}, y shape: {y.shape}")
    
    return X, y, encoders


def train_model(X, y):
    """Train the Random Forest Regressor model."""
    print("\nTraining Random Forest Regressor...")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"Train size: {len(X_train)}, Test size: {len(X_test)}")
    
    # Create and train the model
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    print("Model trained successfully!")
    
    # Evaluate
    y_pred = model.predict(X_test)
    
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    print("\n=== Model Evaluation ===")
    print(f"R² Score: {r2:.4f} ({r2*100:.2f}%)")
    print(f"Mean Absolute Error (MAE): {mae:.2f} kg/ha")
    print(f"Root Mean Square Error (RMSE): {rmse:.2f} kg/ha")
    
    # Cross-validation
    cv_scores = cross_val_score(model, X, y, cv=5, scoring='r2')
    print(f"\nCross-validation R² scores: {cv_scores}")
    print(f"Mean CV R²: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
    
    # Feature importance
    feature_names = list(X.columns)
    importances = model.feature_importances_
    print("\n=== Feature Importance ===")
    for name, importance in sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True):
        print(f"  {name}: {importance:.4f}")
    
    metrics = {
        "r2_score": float(r2),
        "mae": float(mae),
        "rmse": float(rmse),
        "cv_mean_r2": float(cv_scores.mean()),
        "training_samples": len(X_train),
        "test_samples": len(X_test)
    }
    
    return model, metrics


def save_model(model, encoders, metrics):
    """Save the trained model and encoders."""
    print("\nSaving model...")
    
    # Create model directory if it doesn't exist
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    # Save model
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to: {MODEL_PATH}")
    
    # Save encoders
    joblib.dump(encoders, ENCODERS_PATH)
    print(f"Encoders saved to: {ENCODERS_PATH}")
    
    # Save metrics
    import json
    with open(METRICS_PATH, 'w') as f:
        json.dump(metrics, f, indent=2)
    print(f"Metrics saved to: {METRICS_PATH}")


def main():
    """Main training pipeline."""
    print("=" * 50)
    print("CROP YIELD PREDICTION MODEL TRAINING")
    print("=" * 50)
    
    # Load data
    df = load_data()
    
    # Preprocess
    X, y, encoders = preprocess_data(df)
    
    # Train
    model, metrics = train_model(X, y)
    
    # Save
    save_model(model, encoders, metrics)
    
    print("\n" + "=" * 50)
    print("TRAINING COMPLETE!")
    print("=" * 50)
    
    return model, encoders, metrics


if __name__ == "__main__":
    main()
