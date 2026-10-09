# Sample Data Guide

## Overview
This guide explains the comprehensive sample dataset created for testing the Criminal Record Digital Verification System (CRDVS). The data includes 25 criminal records with over 50 convictions, specifically designed to test all system features including duplicate detection.

## Installation
Run the migration script in Supabase SQL Editor:
```sql
-- File: supabase/migrations/005_sample_data.sql
```

## Dataset Summary

### Total Records: 25
- **Gweru**: 8 records
- **Kadoma**: 6 records
- **Kwekwe**: 6 records
- **Chegutu**: 5 records

### Total Convictions: 50+
Various conviction types across all offense categories

## Duplicate Detection Test Scenarios

The dataset includes **intentional duplicates** to test the AI-based duplicate detection system:

### Scenario 1: Tapiwanashe Moyo (Records 1, 2, 14)
**Testing**: Name variations and data entry errors

- **Record 1**: `CR-0012345A90` - "Tapiwanashe Moyo" (Original)
  - National ID: `85-1234567B12`
  - DOB: 1985-03-15
  - Address: 123 Mkoba Street, Gweru
  - Aliases: Tapi, T-Man

- **Record 2**: `CR-0012346A91` - "Tapiwanashe Moyyo" (Surname typo)
  - National ID: `85-1234568B13` (different by 1 digit)
  - DOB: 1985-03-15 (same)
  - Address: 123 Mkoba Street, Gweru (same)
  - Aliases: Tapi, T-Man Moyo

- **Record 14**: `CR-0012347A92` - "Tapiwanashe James Moyo" (Middle name added)
  - National ID: `85-1234569B14` (different)
  - DOB: 1985-03-15 (same)
  - Address: 123 Mkoba, Gweru
  - Aliases: TJ, Tapi James

**Expected Detection**: High similarity (85-95%)
- Same DOB
- Similar/same address
- Overlapping aliases
- Name similarity with Levenshtein distance


### Scenario 2: Simbarashe Dube (Records 7, 8)
**Testing**: Nickname vs full name

- **Record 7**: `CR-0067890F35` - "Simbarashe Dube"
  - National ID: `87-2345678G34`
  - DOB: 1987-08-05
  - Address: 89 Ngezi Street, Kadoma
  - Aliases: Simba, SimbaDube

- **Record 8**: `CR-0067891F36` - "Simba Dube"
  - National ID: `87-2345679G35` (different by 1 digit)
  - DOB: 1987-08-05 (same)
  - Address: 89 Ngezi Street, Kadoma (same)
  - Aliases: Simbarashe

**Expected Detection**: Very high similarity (90-98%)
- Nickname "Simba" is alias in Record 7
- Same DOB, address
- Nearly identical National IDs

### Scenario 3: Tapiwa Mpofu (Records 13, 21)
**Testing**: Surname spelling error

- **Record 13**: `CR-0112345K60` - "Tapiwa Mpofu"
  - National ID: `89-5678901L78`
  - DOB: 1989-06-12
  - Address: 45 Amaveni, Kwekwe
  - Currently serving sentence

- **Record 21**: `CR-0112346K61` - "Tapiwa Mphofu" (Mpofu vs Mphofu)
  - National ID: `89-5678902L79` (different by 1 digit)
  - DOB: 1989-06-12 (same)
  - Address: 45 Amaveni, Kwekwe (same)
  - Aliases include "Mpofu"

**Expected Detection**: High similarity (85-92%)
- Surname phonetically similar (Soundex match)
- Same DOB and address
- Nearly identical National IDs

## Testing the Duplicate Detection System

### Step 1: Run Detection
Navigate to `/dashboard/duplicates` and click **"Run Detection"**

### Step 2: Review Flags
The system should detect the following duplicate pairs:
1. CR-0012345A90 ↔ CR-0012346A91 (Tapiwanashe Moyo variants)
2. CR-0012345A90 ↔ CR-0012347A92 (Tapiwanashe Moyo with middle name)
3. CR-0067890F35 ↔ CR-0067891F36 (Simbarashe/Simba Dube)
4. CR-0112345K60 ↔ CR-0112346K61 (Tapiwa Mpofu spelling)

### Step 3: Verify Similarity Scores
Check that scores reflect:
- Name similarity (Levenshtein distance)
- DOB matches
- Address similarity
- National ID patterns

## Record Types for Testing

### Repeat Offenders (Multiple Convictions)
Test conviction counting and risk assessment:


- **Tendai Ncube** (CR-0034567C20): 5 convictions, Risk Level 5, violent crimes
- **Mukudzei Mandaza** (CR-0145678N75): 6 convictions, Risk Level 5, organized crime
- **Tapiwa Mpofu** (CR-0112345K60): 4 drug convictions, currently serving
- **Tapiwanashe Moyo** (CR-0012345A90): 3 property crimes, active repeat offender

### Active Cases
Test real-time monitoring and verification:
- Most records have "active" status
- Some with "serving_sentence" status
- Prison facilities specified for incarcerated offenders

### Pending Cases
Test court workflow:
- **Chenai Mutasa** (CR-0056789E30): Embezzlement case pending
- Status: under_investigation

### Closed/Acquitted Cases
Test complete lifecycle:
- **Lloyd Musarurwa** (CR-0178901Q90): Acquitted of embezzlement
- **Prosper Sibanda** (CR-0078901G40): Closed case, sentence completed

## Offense Categories Covered

### Property Crimes
- Theft, burglary, breaking and entering
- Motor vehicle theft
- Shoplifting
- Receiving stolen goods

Examples: Tapiwanashe Moyo, Takudzwa Gumbo, Memory Kadungure

### Violent Crimes
- Assault (simple and aggravated)
- Assault with deadly weapon
- Robbery with violence
- Armed robbery

Example: Tendai Ncube (5 violent crime convictions)

### Drug Offenses
- Possession
- Possession with intent to distribute
- Drug trafficking

Example: Tapiwa Mpofu (currently serving 8 years)

### Financial Crimes
- Fraud and misrepresentation
- Embezzlement
- Identity theft
- Money laundering

Examples: Simbarashe Dube (fraud), Mukudzei Mandaza (money laundering)

### Cybercrime
- Online fraud and phishing
- Unauthorized access to computer systems
- Electronic fraud
- Computer fraud

Example: Brighton Nyathi (3 cybercrime convictions)

### Traffic Offenses
- DUI (Driving under influence)
- Reckless driving
- Driving without license
- Hit and run

Examples: Prosper Sibanda, Blessing Mapfumo

### Organized Crime
- Racketeering
- Extortion

Example: Mukudzei Mandaza (linked to organized crime network)

### Sexual Offenses
- Sexual assault
- Indecent assault

Example: Shuvai Mlambo (high risk, strict monitoring)

## Risk Levels Distribution

- **Level 1** (Low): 4 records - minor offenses, first-time offenders
- **Level 2** (Low-Medium): 6 records - shoplifting, minor theft
- **Level 3** (Medium): 5 records - burglary, fraud
- **Level 4** (High): 4 records - repeat property crimes, drug trafficking
- **Level 5** (Critical): 6 records - violent crimes, organized crime, sexual offenses

## Testing Features

### 1. Criminal Records Search
Search by:
- Record ID (e.g., CR-0012345A90)
- National ID (e.g., 85-1234567B12)
- Name (e.g., Tapiwanashe Moyo)
- Location (Gweru, Kadoma, Kwekwe, Chegutu)

### 2. Identity Verification
Test verification with:
- Exact matches
- Partial matches
- No matches

### 3. Report Generation
Generate reports for:
- Simple cases (1 conviction)
- Complex cases (multiple convictions)
- Active cases (serving sentence)
- Closed cases (completed)

### 4. Conviction Management
View and analyze:
- Single convictions
- Multiple convictions per offender
- Different conviction statuses
- Prison assignments

### 5. Duplicate Detection
Run automated detection to find:
- Name variations
- Data entry errors
- Nickname usage
- Spelling mistakes

## Sample Queries for Testing

### Find all records from Gweru
```sql
SELECT * FROM criminal_records WHERE address LIKE '%Gweru%';
```

### Find high-risk offenders
```sql
SELECT * FROM criminal_records WHERE risk_level >= 4;
```

### Find repeat offenders
```sql
SELECT * FROM criminal_records WHERE is_repeat_offender = TRUE;
```

### Find drug offenses
```sql
SELECT cr.*, c.* 
FROM criminal_records cr
JOIN convictions c ON c.criminal_record_id = cr.id
WHERE c.offense_category = 'drug_offense';
```

### Find currently serving sentences
```sql
SELECT * FROM criminal_records WHERE status = 'serving_sentence';
```

## Expected System Behavior

### After Running Migration:
1. **Dashboard Statistics** should show:
   - 25 total records
   - Distribution across locations
   - Risk level breakdown

2. **Records Page** should display all 25 records with:
   - Correct conviction counts
   - Accurate risk levels
   - Proper status indicators

3. **Duplicate Detection** should identify:
   - At least 4 duplicate pairs
   - Similarity scores 85%+
   - Matching fields highlighted

4. **Verification** should work for:
   - Any National ID in the dataset
   - Name searches returning multiple results
   - Address-based filtering

5. **Reports** can be generated for:
   - Any criminal record
   - Include all convictions
   - Show statistics correctly

## Notes
- All dates are realistic and chronological
- Prison facilities are real Zimbabwean prisons
- Addresses use actual area names in each city
- National ID format follows Zimbabwean standard
- Case numbers follow system format (CASE-YYYY-DDDDD)
- Record IDs follow system format (CR-DDDDDDDADD)

## Cleanup (if needed)
To remove all sample data:
```sql
DELETE FROM convictions WHERE case_number LIKE 'CASE-%';
DELETE FROM criminal_records WHERE record_id LIKE 'CR-%';
```
