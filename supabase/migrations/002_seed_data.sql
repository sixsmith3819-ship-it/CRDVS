-- ============================================================
-- CRDVS Migration: 002_seed_data.sql
-- Description: Seed data for development and testing
-- WARNING: Do NOT run in production
-- ============================================================

-- NOTE: Profiles are created via Supabase Auth trigger (Phase 3)
-- These seeds are for the national_ids and criminal_records tables
-- to allow testing of the verification and duplicate detection modules.

-- ============================================================
-- SEED: national_ids
-- ============================================================

INSERT INTO national_ids (
  national_id_number, full_name, date_of_birth, gender,
  nationality, place_of_birth, address
) VALUES
  ('63-6323979A13', 'John Tendai Moyo',        '1985-03-15', 'male',   'Zimbabwean', 'Harare',   '23 Samora Machel Ave, Harare'),
  ('47-1892034B99', 'Grace Ruvimbo Chigamba',  '1990-07-22', 'female', 'Zimbabwean', 'Bulawayo', '14 Jason Moyo Street, Bulawayo'),
  ('52-4401287C08', 'Emmanuel Tatenda Dube',   '1978-11-03', 'male',   'Zimbabwean', 'Mutare',   '5 Herbert Chitepo St, Mutare'),
  ('39-7765432D17', 'Nomsa Faith Ncube',       '1995-01-28', 'female', 'Zimbabwean', 'Gweru',    '88 Robert Mugabe Way, Gweru'),
  ('71-3309876E04', 'Patrick Lovemore Banda',  '1982-09-14', 'male',   'Zimbabwean', 'Masvingo', '3 Josiah Tongogara Rd, Masvingo'),
  ('28-5548913F22', 'Tendai Blessing Mhaka',   '1975-05-07', 'male',   'Zimbabwean', 'Harare',   '102 Enterprise Rd, Harare'),
  ('65-2237401G31', 'Rudo Chipo Zvenyika',     '1993-12-19', 'female', 'Zimbabwean', 'Chitungwiza', '7 Seke Road, Chitungwiza'),
  ('44-9981256H06', 'Solomon Garai Mutasa',    '1968-04-30', 'male',   'Zimbabwean', 'Harare',   '45 Borrowdale Rd, Harare');

-- ============================================================
-- SEED: criminal_records
-- ============================================================

INSERT INTO criminal_records (
  record_id, national_id_number, full_name, aliases,
  date_of_birth, gender, nationality, address,
  status, risk_level, notes
) VALUES
  (
    'CR-0012345B26', '63-6323979A13', 'John Tendai Moyo',
    ARRAY['Johnny Moyo', 'JT Moyo'],
    '1985-03-15', 'male', 'Zimbabwean', '23 Samora Machel Ave, Harare',
    'active', 3,
    'Known associate of organized crime networks in Harare CBD.'
  ),
  (
    'CR-0023456C26', '47-1892034B99', 'Grace Ruvimbo Chigamba',
    ARRAY['Grace Chigamba'],
    '1990-07-22', 'female', 'Zimbabwean', '14 Jason Moyo Street, Bulawayo',
    'active', 2,
    'Financial fraud related offenses.'
  ),
  (
    'CR-0034567D26', '52-4401287C08', 'Emmanuel Tatenda Dube',
    ARRAY['Tatenda Dube', 'ET Dube', 'Manu'],
    '1978-11-03', 'male', 'Zimbabwean', '5 Herbert Chitepo St, Mutare',
    'under_investigation', 4,
    'Multiple offenses across Manicaland province. High risk profile.'
  ),
  (
    'CR-0045678E26', '39-7765432D17', 'Nomsa Faith Ncube',
    NULL,
    '1995-01-28', 'female', 'Zimbabwean', '88 Robert Mugabe Way, Gweru',
    'closed', 1,
    'Single minor offense. Case closed.'
  ),
  (
    'CR-0056789F26', '71-3309876E04', 'Patrick Lovemore Banda',
    ARRAY['Patrick Banda', 'Love Banda'],
    '1982-09-14', 'male', 'Zimbabwean', '3 Josiah Tongogara Rd, Masvingo',
    'active', 5,
    'Violent crime repeat offender. Maximum risk classification.'
  );

-- ============================================================
-- SEED: convictions
-- ============================================================

INSERT INTO convictions (
  case_number, criminal_record_id, offense_category,
  offense_description, court_name, verdict,
  sentence_description, charge_date, conviction_date
) VALUES
  (
    'CASE-2022-00101',
    (SELECT id FROM criminal_records WHERE record_id = 'CR-0012345B26'),
    'property_crime',
    'Armed robbery at First Capital Bank, Harare CBD',
    'Harare Magistrates Court', 'convicted',
    '4 years imprisonment', '2022-03-10', '2022-07-15'
  ),
  (
    'CASE-2023-00234',
    (SELECT id FROM criminal_records WHERE record_id = 'CR-0012345B26'),
    'violent_crime',
    'Assault with intent to cause grievous bodily harm',
    'Harare High Court', 'convicted',
    '2 years imprisonment, suspended 1 year', '2023-01-20', '2023-05-08'
  ),
  (
    'CASE-2021-00089',
    (SELECT id FROM criminal_records WHERE record_id = 'CR-0023456C26'),
    'financial_crime',
    'Fraud and misrepresentation in real estate transaction',
    'Bulawayo Magistrates Court', 'convicted',
    'ZWL 500,000 fine and 18 months suspended', '2021-06-14', '2021-11-22'
  ),
  (
    'CASE-2020-00412',
    (SELECT id FROM criminal_records WHERE record_id = 'CR-0034567D26'),
    'drug_offense',
    'Possession and distribution of controlled substances',
    'Mutare Regional Court', 'convicted',
    '3 years imprisonment', '2020-08-03', '2020-12-17'
  ),
  (
    'CASE-2024-00071',
    (SELECT id FROM criminal_records WHERE record_id = 'CR-0034567D26'),
    'violent_crime',
    'Aggravated assault and robbery with weapon',
    'Mutare High Court', 'pending',
    'Awaiting sentencing', '2024-02-28', NULL
  ),
  (
    'CASE-2019-00303',
    (SELECT id FROM criminal_records WHERE record_id = 'CR-0045678E26'),
    'traffic_offense',
    'Driving under the influence causing property damage',
    'Gweru Magistrates Court', 'convicted',
    'ZWL 50,000 fine, 6-month license suspension', '2019-09-12', '2019-10-05'
  ),
  (
    'CASE-2018-00178',
    (SELECT id FROM criminal_records WHERE record_id = 'CR-0056789F26'),
    'violent_crime',
    'Murder, reduced to culpable homicide on appeal',
    'Masvingo High Court', 'convicted',
    '10 years imprisonment', '2018-04-22', '2018-11-30'
  ),
  (
    'CASE-2021-00267',
    (SELECT id FROM criminal_records WHERE record_id = 'CR-0056789F26'),
    'violent_crime',
    'Assault with a dangerous weapon on prison staff (while incarcerated)',
    'Masvingo Magistrates Court', 'convicted',
    'Additional 2 years imprisonment', '2021-07-14', '2021-09-02'
  ),
  (
    'CASE-2024-00198',
    (SELECT id FROM criminal_records WHERE record_id = 'CR-0056789F26'),
    'organized_crime',
    'Conspiracy to commit robbery upon release on parole',
    'Masvingo High Court', 'convicted',
    '7 years imprisonment', '2024-05-10', '2024-10-18'
  );
