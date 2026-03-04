-- Create schemes table for MySQL
CREATE TABLE IF NOT EXISTS schemes (
  scheme_id VARCHAR(36) PRIMARY KEY,
  scheme_code VARCHAR(50) UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_hi TEXT,
  name_ta TEXT,
  name_te TEXT,
  name_bn TEXT,
  description_en TEXT,
  description_hi TEXT,
  description_ta TEXT,
  description_te TEXT,
  description_bn TEXT,
  category VARCHAR(50) NOT NULL,
  level VARCHAR(20) NOT NULL,
  department VARCHAR(255),
  benefit_amount DECIMAL(12, 2),
  deadline DATE,
  is_ongoing BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for faster queries
CREATE INDEX idx_schemes_category ON schemes(category);
CREATE INDEX idx_schemes_level ON schemes(level);
CREATE INDEX idx_schemes_code ON schemes(scheme_code);
CREATE INDEX idx_schemes_ongoing ON schemes(is_ongoing);
