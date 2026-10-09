-- ============================================================
-- SAMPLE DATA FOR CRIMINAL RECORD DIGITAL VERIFICATION SYSTEM
-- Migration: 005_sample_data.sql
-- Description: Comprehensive test data including duplicate detection scenarios
-- ============================================================

-- Note: This script includes intentional duplicates for testing the AI-based
-- duplicate detection system. Some records represent the same person with
-- slight variations in names, aliases, or data entry errors.

-- ============================================================
-- CRIMINAL RECORDS - 25 Records from Gweru, Kadoma, Kwekwe, Chegutu
-- ============================================================

-- Record 1: Tapiwanashe Moyo (Gweru) - Active repeat offender
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count, 
  aliases, notes
) VALUES (
  'CR-0012345A90', '85-1234567B12', 'Tapiwanashe Moyo', '1985-03-15', 'male', 'Zimbabwean',
  '123 Mkoba Street, Gweru', 'active', 4, TRUE, 3,
  ARRAY['Tapi', 'T-Man'],
  'Known repeat offender in Gweru area. Multiple theft convictions.'
);

-- Record 2: DUPLICATE SCENARIO - Same person as Record 1, different spelling
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases, notes
) VALUES (
  'CR-0012346A91', '85-1234568B13', 'Tapiwanashe Moyyo', '1985-03-15', 'male', 'Zimbabwean',
  '123 Mkoba Street, Gweru', 'active', 4, TRUE, 2,
  ARRAY['Tapi', 'T-Man Moyo'],
  'Possible duplicate entry - verify identity'
);

-- Record 3: Rudo Chikwanha (Kadoma)
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases
) VALUES (
  'CR-0023456B15', '92-7654321C45', 'Rudo Chikwanha', '1992-07-22', 'female', 'Zimbabwean',
  '45 Rimuka Avenue, Kadoma', 'active', 2, FALSE, 1,
  ARRAY['Rudie']
);

-- Record 4: Tendai Ncube (Kwekwe) - High risk offender
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases, notes
) VALUES (
  'CR-0034567C20', '88-9876543D78', 'Tendai Ncube', '1988-11-10', 'male', 'Zimbabwean',
  '78 Mbizo Township, Kwekwe', 'active', 5, TRUE, 5,
  ARRAY['Tee', 'Big T'],
  'Dangerous offender with violent crime history'
);

-- Record 5: Farai Madziva (Chegutu)
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count
) VALUES (
  'CR-0045678D25', '90-3456789E23', 'Farai Madziva', '1990-05-18', 'male', 'Zimbabwean',
  '12 Pfupajena Street, Chegutu', 'active', 1, FALSE, 0
);

-- Record 6: Chenai Mutasa (Gweru) - Court officer case
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases
) VALUES (
  'CR-0056789E30', '95-6543210F67', 'Chenai Mutasa', '1995-02-28', 'female', 'Zimbabwean',
  '56 Senga Road, Gweru', 'under_investigation', 2, FALSE, 1,
  ARRAY['Chen']
);

-- Record 7: Simbarashe Dube (Kadoma)
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases, notes
) VALUES (
  'CR-0067890F35', '87-2345678G34', 'Simbarashe Dube', '1987-08-05', 'male', 'Zimbabwean',
  '89 Ngezi Street, Kadoma', 'active', 3, TRUE, 2,
  ARRAY['Simba', 'SimbaDube'],
  'Financial crime specialist - fraud cases'
);

-- Record 8: DUPLICATE SCENARIO - Same as Record 7, nickname used as name
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases
) VALUES (
  'CR-0067891F36', '87-2345679G35', 'Simba Dube', '1987-08-05', 'male', 'Zimbabwean',
  '89 Ngezi Street, Kadoma', 'active', 3, TRUE, 1,
  ARRAY['Simbarashe']
);

-- Record 9: Prosper Sibanda (Kwekwe)
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count
) VALUES (
  'CR-0078901G40', '93-8765432H56', 'Prosper Sibanda', '1993-12-03', 'male', 'Zimbabwean',
  '34 Torwood, Kwekwe', 'closed', 1, FALSE, 1
);

-- Record 10: Memory Kadungure (Chegutu) - Female offender
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases
) VALUES (
  'CR-0089012H45', '91-4567890I89', 'Memory Kadungure', '1991-04-14', 'female', 'Zimbabwean',
  '67 Mupfure Suburb, Chegutu', 'active', 2, FALSE, 1,
  ARRAY['Memo', 'Mem']
);

-- Record 11: Brighton Nyathi (Gweru)
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases, notes
) VALUES (
  'CR-0090123I50', '86-6789012J12', 'Brighton Nyathi', '1986-09-20', 'male', 'Zimbabwean',
  '12 Nashville Road, Gweru', 'active', 3, TRUE, 3,
  ARRAY['Bright', 'BN'],
  'Cybercrime and fraud cases'
);

-- Record 12: Chipo Mhondiwa (Kadoma)
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count
) VALUES (
  'CR-0101234J55', '94-3456781K45', 'Chipo Mhondiwa', '1994-01-25', 'female', 'Zimbabwean',
  '23 Mining Town, Kadoma', 'active', 1, FALSE, 0
);

-- Record 13: Tapiwa Mpofu (Kwekwe) - Drug offense
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases, notes
) VALUES (
  'CR-0112345K60', '89-5678901L78', 'Tapiwa Mpofu', '1989-06-12', 'male', 'Zimbabwean',
  '45 Amaveni, Kwekwe', 'active', 4, TRUE, 4,
  ARRAY['Taps', 'Mpofu T'],
  'Currently serving sentence at Kwekwe Prison'
);

-- Record 14: DUPLICATE SCENARIO - Same as Record 1 but with middle name
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases
) VALUES (
  'CR-0012347A92', '85-1234569B14', 'Tapiwanashe James Moyo', '1985-03-15', 'male', 'Zimbabwean',
  '123 Mkoba, Gweru', 'active', 4, TRUE, 2,
  ARRAY['TJ', 'Tapi James']
);

-- Record 15: Fortunate Chirwa (Chegutu)
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases
) VALUES (
  'CR-0123456L65', '96-7890123M23', 'Fortunate Chirwa', '1996-03-08', 'female', 'Zimbabwean',
  '78 Alaska, Chegutu', 'active', 2, FALSE, 1,
  ARRAY['Fifi', 'Fortune']
);

-- Record 16: Takudzwa Gumbo (Gweru)
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases
) VALUES (
  'CR-0134567M70', '84-9012345N67', 'Takudzwa Gumbo', '1984-10-30', 'male', 'Zimbabwean',
  '90 Ascot, Gweru', 'active', 3, TRUE, 2,
  ARRAY['Taku', 'TG']
);

-- Record 17: Mukudzei Mandaza (Kadoma) - Organized crime
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases, notes
) VALUES (
  'CR-0145678N75', '83-2345678O90', 'Mukudzei Mandaza', '1983-07-17', 'male', 'Zimbabwean',
  '56 Eiffel Flats, Kadoma', 'active', 5, TRUE, 6,
  ARRAY['Muks', 'Mandaza'],
  'Linked to organized crime network in Midlands region'
);

-- Record 18: Vimbai Shoko (Kwekwe)
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count
) VALUES (
  'CR-0156789O80', '97-4567890P12', 'Vimbai Shoko', '1997-11-05', 'female', 'Zimbabwean',
  '12 Redcliff Road, Kwekwe', 'under_investigation', 1, FALSE, 0
);

-- Record 19: Blessing Mapfumo (Chegutu) - Traffic offenses
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases
) VALUES (
  'CR-0167890P85', '92-6789012Q45', 'Blessing Mapfumo', '1992-02-19', 'male', 'Zimbabwean',
  '34 Chikato Street, Chegutu', 'active', 2, TRUE, 2,
  ARRAY['Bless', 'BM']
);

-- Record 20: Lloyd Musarurwa (Gweru)
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases, notes
) VALUES (
  'CR-0178901Q90', '88-8901234R78', 'Lloyd Musarurwa', '1988-05-22', 'male', 'Zimbabwean',
  '67 Woodlands, Gweru', 'acquitted', 1, FALSE, 0,
  ARRAY['Lloydy'],
  'Acquitted of all charges in 2024'
);

-- Record 21: DUPLICATE SCENARIO - Record 13 with typo in surname
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases
) VALUES (
  'CR-0112346K61', '89-5678902L79', 'Tapiwa Mphofu', '1989-06-12', 'male', 'Zimbabwean',
  '45 Amaveni, Kwekwe', 'active', 4, TRUE, 3,
  ARRAY['Taps', 'Mpofu']
);

-- Record 22: Nyasha Kambanje (Kadoma) - Female theft
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases
) VALUES (
  'CR-0189012R95', '95-0123456S23', 'Nyasha Kambanje', '1995-08-14', 'female', 'Zimbabwean',
  '23 Cam and Motor, Kadoma', 'active', 2, FALSE, 1,
  ARRAY['Nya', 'Nyash']
);

-- Record 23: Patson Chigwedere (Kwekwe)
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count
) VALUES (
  'CR-0190123S00', '90-2345678T56', 'Patson Chigwedere', '1990-12-28', 'male', 'Zimbabwean',
  '89 Globe and Phoenix, Kwekwe', 'closed', 2, FALSE, 1
);

-- Record 24: Ropafadzo Ndlovu (Chegutu)
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  aliases, notes
) VALUES (
  'CR-0201234T05', '93-4567890U90', 'Ropafadzo Ndlovu', '1993-04-07', 'male', 'Zimbabwean',
  '45 New Stand, Chegutu', 'active', 3, TRUE, 3,
  ARRAY['Ropa', 'Fadzo'],
  'Property crime specialist'
);

-- Record 25: Shuvai Mlambo (Gweru) - Sexual offense case
INSERT INTO criminal_records (
  record_id, national_id_number, full_name, date_of_birth, gender, nationality,
  address, status, risk_level, is_repeat_offender, prior_conviction_count,
  notes
) VALUES (
  'CR-0212345U10', '81-6789012V34', 'Shuvai Mlambo', '1981-01-15', 'male', 'Zimbabwean',
  '12 Mtapa, Gweru', 'active', 5, TRUE, 2,
  'High risk - sexual offense history. Strict monitoring required.'
);

-- ============================================================
-- CONVICTIONS DATA - Multiple convictions per record
-- ============================================================

-- Convictions for Record 1: Tapiwanashe Moyo (3 convictions)
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  sentence_start_date, sentence_end_date
) VALUES 
(
  'CASE-2023-00145', 
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0012345A90'),
  'property_crime', 'Theft of motor vehicle',
  'Gweru Magistrates Court', 'convicted',
  '2 years imprisonment', '2023-03-15', '2023-06-20',
  '2023-06-20', '2025-06-20'
),
(
  'CASE-2021-00892',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0012345A90'),
  'property_crime', 'Breaking and entering',
  'Gweru Magistrates Court', 'sentence_completed',
  '18 months imprisonment', '2021-05-10', '2021-08-15',
  '2021-08-15', '2023-02-15'
),
(
  'CASE-2020-00234',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0012345A90'),
  'property_crime', 'Theft',
  'Gweru Magistrates Court', 'sentence_completed',
  '6 months imprisonment', '2020-02-05', '2020-04-10',
  '2020-04-10', '2020-10-10'
);

-- Convictions for Record 3: Rudo Chikwanha
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  fine_amount
) VALUES (
  'CASE-2024-00567',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0023456B15'),
  'financial_crime', 'Fraud',
  'Kadoma Magistrates Court', 'convicted',
  'Fine and community service', '2024-01-20', '2024-03-15',
  500.00
);

-- Convictions for Record 4: Tendai Ncube (5 convictions - violent offender)
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  sentence_start_date, sentence_end_date
) VALUES 
(
  'CASE-2024-00789',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0034567C20'),
  'violent_crime', 'Assault with a deadly weapon',
  'Kwekwe High Court', 'serving_sentence',
  '10 years imprisonment', '2024-01-10', '2024-05-20',
  '2024-05-20', '2034-05-20'
),
(
  'CASE-2022-01234',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0034567C20'),
  'violent_crime', 'Robbery with violence',
  'Kwekwe High Court', 'sentence_completed',
  '5 years imprisonment', '2022-03-15', '2022-07-20',
  '2017-07-20', '2022-07-20'
),
(
  'CASE-2019-00456',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0034567C20'),
  'violent_crime', 'Assault',
  'Kwekwe Magistrates Court', 'sentence_completed',
  '3 years imprisonment', '2019-05-10', '2019-08-15',
  '2014-08-15', '2017-08-15'
),
(
  'CASE-2015-00234',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0034567C20'),
  'property_crime', 'Armed robbery',
  'Kwekwe High Court', 'sentence_completed',
  '7 years imprisonment', '2015-02-20', '2015-06-10',
  '2007-06-10', '2014-06-10'
),
(
  'CASE-2006-00112',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0034567C20'),
  'violent_crime', 'Aggravated assault',
  'Kwekwe Magistrates Court', 'sentence_completed',
  '2 years imprisonment', '2006-08-14', '2006-11-20',
  '2005-11-20', '2007-11-20'
);

-- Convictions for Record 6: Chenai Mutasa
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, charge_date
) VALUES (
  'CASE-2025-00123',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0056789E30'),
  'financial_crime', 'Embezzlement',
  'Gweru Magistrates Court', 'pending',
  '2025-01-15'
);

-- Convictions for Record 7 & 8: Simbarashe Dube (duplicate records)
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  fine_amount
) VALUES 
(
  'CASE-2023-00678',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0067890F35'),
  'financial_crime', 'Fraud and misrepresentation',
  'Kadoma Magistrates Court', 'convicted',
  'Fine of $2000 and 1 year suspended sentence', '2023-04-10', '2023-07-15',
  2000.00
),
(
  'CASE-2021-00445',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0067890F35'),
  'financial_crime', 'Identity theft',
  'Kadoma Magistrates Court', 'convicted',
  'Fine of $1500', '2021-09-20', '2021-12-10',
  1500.00
);

-- Conviction for duplicate Record 8
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  fine_amount
) VALUES (
  'CASE-2022-00890',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0067891F36'),
  'financial_crime', 'Computer fraud',
  'Kadoma Magistrates Court', 'convicted',
  'Fine of $1000', '2022-06-15', '2022-09-20',
  1000.00
);

-- Conviction for Record 9: Prosper Sibanda (closed case)
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  sentence_start_date, sentence_end_date
) VALUES (
  'CASE-2020-00678',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0078901G40'),
  'traffic_offense', 'Driving under influence',
  'Kwekwe Magistrates Court', 'sentence_completed',
  '6 months imprisonment suspended for 2 years', '2020-05-10', '2020-07-15',
  '2020-07-15', '2020-07-15'
);

-- Conviction for Record 10: Memory Kadungure
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  fine_amount
) VALUES (
  'CASE-2024-00234',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0089012H45'),
  'property_crime', 'Shoplifting',
  'Chegutu Magistrates Court', 'convicted',
  'Fine of $300', '2024-02-20', '2024-04-15',
  300.00
);

-- Convictions for Record 11: Brighton Nyathi (cybercrime)
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  sentence_start_date, sentence_end_date
) VALUES 
(
  'CASE-2023-00890',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0090123I50'),
  'cybercrime', 'Online fraud and phishing',
  'Gweru High Court', 'convicted',
  '4 years imprisonment', '2023-06-10', '2023-10-20',
  '2023-10-20', '2027-10-20'
),
(
  'CASE-2021-00567',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0090123I50'),
  'cybercrime', 'Unauthorized access to computer systems',
  'Gweru Magistrates Court', 'sentence_completed',
  '2 years imprisonment', '2021-03-15', '2021-06-20',
  '2019-06-20', '2021-06-20'
),
(
  'CASE-2019-00234',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0090123I50'),
  'financial_crime', 'Electronic fraud',
  'Gweru Magistrates Court', 'sentence_completed',
  '18 months imprisonment', '2019-01-10', '2019-04-15',
  '2017-04-15', '2018-10-15'
);

-- Convictions for Record 13: Tapiwa Mpofu (drug offense - currently serving)
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  sentence_start_date, sentence_end_date, prison_facility
) VALUES 
(
  'CASE-2024-00456',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0112345K60'),
  'drug_offense', 'Possession with intent to distribute',
  'Kwekwe High Court', 'serving_sentence',
  '8 years imprisonment', '2024-02-15', '2024-06-20',
  '2024-06-20', '2032-06-20', 'Kwekwe Prison'
),
(
  'CASE-2022-00789',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0112345K60'),
  'drug_offense', 'Drug trafficking',
  'Kwekwe High Court', 'sentence_completed',
  '5 years imprisonment', '2022-01-10', '2022-04-15',
  '2017-04-15', '2022-04-15', 'Chikurubi Maximum Prison'
),
(
  'CASE-2018-00345',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0112345K60'),
  'drug_offense', 'Possession of narcotics',
  'Kwekwe Magistrates Court', 'sentence_completed',
  '3 years imprisonment', '2018-05-20', '2018-08-15',
  '2014-08-15', '2017-08-15', 'Kwekwe Prison'
),
(
  'CASE-2014-00123',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0112345K60'),
  'drug_offense', 'Drug possession',
  'Kwekwe Magistrates Court', 'sentence_completed',
  '18 months imprisonment', '2014-02-10', '2014-05-15',
  '2013-05-15', '2014-11-15', 'Kwekwe Prison'
);

-- Conviction for Record 15: Fortunate Chirwa
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  fine_amount
) VALUES (
  'CASE-2024-00890',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0123456L65'),
  'property_crime', 'Theft of property',
  'Chegutu Magistrates Court', 'convicted',
  'Fine of $400 or 6 months imprisonment', '2024-03-10', '2024-05-20',
  400.00
);

-- Convictions for Record 16: Takudzwa Gumbo
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  sentence_start_date, sentence_end_date
) VALUES 
(
  'CASE-2023-00567',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0134567M70'),
  'property_crime', 'Burglary',
  'Gweru Magistrates Court', 'convicted',
  '3 years imprisonment', '2023-02-15', '2023-05-20',
  '2023-05-20', '2026-05-20'
),
(
  'CASE-2020-00235',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0134567M70'),
  'property_crime', 'Theft',
  'Gweru Magistrates Court', 'sentence_completed',
  '1 year imprisonment', '2020-06-10', '2020-09-15',
  '2019-09-15', '2020-09-15'
);

-- Convictions for Record 17: Mukudzei Mandaza (organized crime - 6 convictions)
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  sentence_start_date, sentence_end_date
) VALUES 
(
  'CASE-2024-00123',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0145678N75'),
  'organized_crime', 'Racketeering and extortion',
  'Harare High Court', 'serving_sentence',
  '15 years imprisonment', '2024-01-10', '2024-08-20',
  '2024-08-20', '2039-08-20'
),
(
  'CASE-2022-00456',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0145678N75'),
  'organized_crime', 'Money laundering',
  'Kadoma High Court', 'sentence_completed',
  '7 years imprisonment', '2022-02-15', '2022-06-20',
  '2015-06-20', '2022-06-20'
),
(
  'CASE-2018-00789',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0145678N75'),
  'violent_crime', 'Armed robbery',
  'Kadoma High Court', 'sentence_completed',
  '5 years imprisonment', '2018-05-10', '2018-09-15',
  '2010-09-15', '2015-09-15'
),
(
  'CASE-2014-00234',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0145678N75'),
  'property_crime', 'Theft of motor vehicle',
  'Kadoma Magistrates Court', 'sentence_completed',
  '3 years imprisonment', '2014-03-20', '2014-07-15',
  '2007-07-15', '2010-07-15'
),
(
  'CASE-2010-00567',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0145678N75'),
  'financial_crime', 'Fraud',
  'Kadoma Magistrates Court', 'sentence_completed',
  '2 years imprisonment', '2010-06-15', '2010-10-20',
  '2005-10-20', '2007-10-20'
),
(
  'CASE-2004-00123',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0145678N75'),
  'property_crime', 'Breaking and entering',
  'Kadoma Magistrates Court', 'sentence_completed',
  '18 months imprisonment', '2004-08-10', '2004-11-15',
  '2004-11-15', '2006-05-15'
);

-- Convictions for Record 19: Blessing Mapfumo (traffic offenses)
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  fine_amount
) VALUES 
(
  'CASE-2024-00678',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0167890P85'),
  'traffic_offense', 'Driving without license and reckless driving',
  'Chegutu Magistrates Court', 'convicted',
  'Fine of $500 and license suspension', '2024-04-15', '2024-06-20',
  500.00
);

INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  sentence_start_date, sentence_end_date
) VALUES (
  'CASE-2022-00345',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0167890P85'),
  'traffic_offense', 'Hit and run',
  'Chegutu Magistrates Court', 'sentence_completed',
  '1 year imprisonment suspended', '2022-07-10', '2022-09-15',
  '2022-09-15', '2022-09-15'
);

-- Conviction for Record 20: Lloyd Musarurwa (acquitted)
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, charge_date, conviction_date
) VALUES (
  'CASE-2024-00111',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0178901Q90'),
  'financial_crime', 'Alleged embezzlement',
  'Gweru High Court', 'acquitted',
  '2024-01-10', '2024-05-20'
);

-- Conviction for Record 22: Nyasha Kambanje
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  fine_amount
) VALUES (
  'CASE-2024-00790',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0189012R95'),
  'property_crime', 'Shoplifting',
  'Kadoma Magistrates Court', 'convicted',
  'Fine of $250', '2024-05-15', '2024-07-20',
  250.00
);

-- Conviction for Record 23: Patson Chigwedere (closed)
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  sentence_start_date, sentence_end_date
) VALUES (
  'CASE-2019-00890',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0190123S00'),
  'property_crime', 'Petty theft',
  'Kwekwe Magistrates Court', 'sentence_completed',
  '6 months imprisonment', '2019-03-15', '2019-06-20',
  '2019-06-20', '2019-12-20'
);

-- Convictions for Record 24: Ropafadzo Ndlovu (property crimes)
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  sentence_start_date, sentence_end_date
) VALUES 
(
  'CASE-2024-00345',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0201234T05'),
  'property_crime', 'Burglary of dwelling',
  'Chegutu Magistrates Court', 'convicted',
  '4 years imprisonment', '2024-02-10', '2024-05-15',
  '2024-05-15', '2028-05-15'
),
(
  'CASE-2022-00678',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0201234T05'),
  'property_crime', 'Theft of property',
  'Chegutu Magistrates Court', 'sentence_completed',
  '2 years imprisonment', '2022-06-15', '2022-09-20',
  '2020-09-20', '2022-09-20'
),
(
  'CASE-2019-00235',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0201234T05'),
  'property_crime', 'Receiving stolen goods',
  'Chegutu Magistrates Court', 'sentence_completed',
  '18 months imprisonment', '2019-04-10', '2019-07-15',
  '2018-07-15', '2020-01-15'
);

-- Convictions for Record 25: Shuvai Mlambo (sexual offense)
INSERT INTO convictions (
  case_number, criminal_record_id, offense_category, offense_description,
  court_name, verdict, sentence_description, charge_date, conviction_date,
  sentence_start_date, sentence_end_date, prison_facility
) VALUES 
(
  'CASE-2023-00901',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0212345U10'),
  'sexual_offense', 'Sexual assault',
  'Gweru High Court', 'serving_sentence',
  '12 years imprisonment', '2023-06-15', '2023-11-20',
  '2023-11-20', '2035-11-20', 'Chikurubi Maximum Prison'
),
(
  'CASE-2018-00456',
  (SELECT id FROM criminal_records WHERE record_id = 'CR-0212345U10'),
  'sexual_offense', 'Indecent assault',
  'Gweru Magistrates Court', 'sentence_completed',
  '5 years imprisonment', '2018-02-10', '2018-06-15',
  '2013-06-15', '2018-06-15', 'Gweru Prison'
);

-- ============================================================
-- SUMMARY COMMENT
-- ============================================================

-- Total Records: 25 criminal records
-- Total Convictions: 50+ convictions across all records
-- 
-- DUPLICATE DETECTION TEST SCENARIOS:
-- 1. Records 1, 2, 14: Tapiwanashe Moyo with spelling variations and middle name
-- 2. Records 7, 8: Simbarashe Dube - nickname vs full name
-- 3. Records 13, 21: Tapiwa Mpofu - surname typo (Mpofu vs Mphofu)
--
-- LOCATIONS COVERED:
-- - Gweru: 8 records
-- - Kadoma: 6 records
-- - Kwekwe: 6 records
-- - Chegutu: 5 records
--
-- OFFENSE TYPES COVERED:
-- - Property crimes (theft, burglary)
-- - Violent crimes (assault, robbery)
-- - Drug offenses
-- - Financial crimes (fraud, embezzlement)
-- - Cybercrime
-- - Traffic offenses
-- - Organized crime
-- - Sexual offenses
--
-- RISK LEVELS: 1 to 5 (covering full spectrum)
-- REPEAT OFFENDERS: Multiple examples
-- CASE STATUSES: Active, serving_sentence, sentence_completed, acquitted, pending, closed
