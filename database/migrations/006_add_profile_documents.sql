-- Add document columns to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN aadhaar_document TEXT NULL,
ADD COLUMN pan_document TEXT NULL,
ADD COLUMN voter_card_document TEXT NULL;
