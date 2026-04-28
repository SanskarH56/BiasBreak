# BiasBreak

Breaking bias in AI hiring decisions

BiasBreak is a simple and interactive tool designed to help organizations understand and improve the fairness of AI-driven hiring systems.

It allows users to analyze hiring data, identify where bias may exist, apply basic corrections, and clearly see how those changes affect outcomes. The goal is to make fairness in AI decisions visible, understandable, and actionable.

---

## Problem

AI is increasingly used to screen and shortlist candidates, but these systems learn from historical data that may contain bias. As a result, certain groups can be unfairly rejected or under-selected.

In most cases, this bias is not obvious, and there are limited tools that allow organizations to easily detect or correct it.

---

## Solution

BiasBreak provides a simple way to audit and improve AI hiring decisions.

It helps users:

- Identify where bias exists in their data and model decisions
- Apply straightforward mitigation techniques
- Compare results before and after changes
- Understand the impact through clear, plain-language explanations

---

## Features

- Upload hiring data in CSV format
- Select a target variable and a sensitive attribute (such as gender)
- Detect bias using key fairness metrics
- View results through a simple dashboard
- Apply mitigation techniques such as threshold adjustment or feature removal
- Compare outcomes before and after mitigation
- Understand fairness and accuracy trade-offs
- Generate a plain-language report

---

## How It Works

1. Upload a dataset
2. Select the target and sensitive feature
3. Train a simple model (logistic regression)
4. Analyze results to detect bias
5. Apply mitigation techniques
6. Compare results before and after
7. Generate a report explaining the outcome

---

## Architecture

- Frontend: React.js for user interaction and visualization
- Backend: FastAPI for handling requests and processing data
- Machine Learning:
  - Scikit-learn for model training
  - Pandas and NumPy for data processing
- Communication between frontend and backend is handled through APIs

---

## Dataset

The system uses a synthetic dataset in CSV format for demonstration purposes.

The dataset includes:

- Candidate information (experience, scores, etc.)
- A sensitive attribute such as gender
- A hiring decision outcome

Bias is intentionally introduced to demonstrate how the system detects and reduces it.

---

## Target Users

- HR teams and recruiters
- Organizations using AI in hiring
- Anyone interested in auditing decision-making systems

---

## Unique Value

BiasBreak focuses on the complete process rather than just detection.

It allows users to:

- See where bias exists
- Apply changes
- Observe how those changes affect outcomes
- Understand the results without needing technical expertise

---

## Limitations

- Designed as a demonstration tool, not a production system
- Uses a simple machine learning model
- Supports only one sensitive attribute at a time
- Does not guarantee perfect fairness

---

## Future Scope

- Integration with real hiring platforms
- Support for multiple sensitive attributes
- More advanced fairness techniques
- Real-time monitoring of decision systems

---

## Contributing

Contributions are welcome. You can open issues or submit pull requests to improve the project.

---

## License

This project is intended for educational and hackathon use.

---

## Acknowledgements

This project was built as part of a hackathon focused on fairness in AI.
