-- Create user_profiles table for MySQL
CREATE TABLE IF NOT EXISTS user_profiles (
  profile_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE,
  date_of_birth DATE,
  gender VARCHAR(20),
  state VARCHAR(100),
  district VARCHAR(100),
  pin_code VARCHAR(10),
  category VARCHAR(20),
  occupation VARCHAR(100),
  annual_income DECIMAL(12, 2),
  family_size INT,
  education_qualification VARCHAR(100),
  profile_completeness INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes
CREATE INDEX idx_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_profiles_state ON user_profiles(state);
CREATE INDEX idx_profiles_category ON user_profiles(category);
