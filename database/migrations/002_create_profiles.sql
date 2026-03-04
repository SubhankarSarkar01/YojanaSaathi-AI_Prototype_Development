-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  date_of_birth DATE,
  gender VARCHAR(20),
  state VARCHAR(100),
  district VARCHAR(100),
  pin_code VARCHAR(10),
  category VARCHAR(20),
  occupation VARCHAR(100),
  annual_income DECIMAL(12, 2),
  family_size INTEGER,
  education_qualification VARCHAR(100),
  profile_completeness INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX idx_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_profiles_state ON user_profiles(state);
CREATE INDEX idx_profiles_category ON user_profiles(category);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
