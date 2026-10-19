-- Migration: Remove all criminal records with 0 convictions
-- Description: Delete records where prior_conviction_count is 0 to clean up the database

DELETE FROM criminal_records
WHERE prior_conviction_count = 0;
