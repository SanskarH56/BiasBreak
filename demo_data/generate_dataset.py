import csv
import random

# Set random seed for reproducibility
random.seed(42)

# Number of rows
n_samples = 800

candidates = []

genders = ['Male', 'Female']
age_groups = ['20-25', '26-30', '31-35']
regions = ['Urban', 'Rural']
college_tiers = ['Tier1', 'Tier2', 'Tier3']
tier_scores = {'Tier1': 100, 'Tier2': 70, 'Tier3': 40}

total_males = 0
total_females = 0
males_hired = 0
females_hired = 0

for i in range(1, n_samples + 1):
    gender = random.choice(genders)
    # Using specific probabilities
    age_group = random.choices(age_groups, weights=[0.3, 0.4, 0.3], k=1)[0]
    region = random.choices(regions, weights=[0.6, 0.4], k=1)[0]
    college_tier = random.choices(college_tiers, weights=[0.2, 0.5, 0.3], k=1)[0]
    
    years_experience = random.randint(0, 10)
    assessment_score = random.randint(40, 100)
    interview_score = random.randint(40, 100)
    
    # Base score calculation
    college_score = tier_scores[college_tier]
    base_score = (assessment_score * 0.4) + (interview_score * 0.4) + (years_experience * 10 * 0.1) + (college_score * 0.1)
    
    # Apply bias penalty to Female candidates
    # We want selection rate difference: Male ~60%, Female ~40%.
    penalty = 6.0 if gender == 'Female' else 0.0
    final_score = base_score - penalty
    
    candidate = {
        'candidate_id': i,
        'gender': gender,
        'age_group': age_group,
        'region': region,
        'college_tier': college_tier,
        'years_experience': years_experience,
        'assessment_score': assessment_score,
        'interview_score': interview_score,
        'final_score': final_score
    }
    candidates.append(candidate)

# Find median score as threshold to get roughly 50% hired overall
all_scores = [c['final_score'] for c in candidates]
all_scores.sort()
threshold = all_scores[len(all_scores) // 2]

for c in candidates:
    hired = 1 if c['final_score'] > threshold else 0
    c['hired'] = hired
    
    if c['gender'] == 'Male':
        total_males += 1
        males_hired += hired
    else:
        total_females += 1
        females_hired += hired

# Write to CSV
output_file = 'synthetic_hiring_data.csv'
with open(output_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow([
        'candidate_id', 'gender', 'age_group', 'region', 'college_tier',
        'years_experience', 'assessment_score', 'interview_score', 'hired'
    ])
    for c in candidates:
        writer.writerow([
            c['candidate_id'], c['gender'], c['age_group'], c['region'], c['college_tier'],
            c['years_experience'], c['assessment_score'], c['interview_score'], c['hired']
        ])

print(f"Dataset generated and saved to {output_file}")

male_selection_rate = males_hired / total_males if total_males > 0 else 0
female_selection_rate = females_hired / total_females if total_females > 0 else 0

print("\nSelection rate by gender:")
print(f"Male: {male_selection_rate:.2f}")
print(f"Female: {female_selection_rate:.2f}")

print(f"\nTotal rows: {len(candidates)}")
