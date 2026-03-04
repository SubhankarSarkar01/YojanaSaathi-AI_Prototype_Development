-- Create applications table for MySQL
CREATE TABLE IF NOT EXISTS applications (
  application_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  scheme_id VARCHAR(36),
  status VARCHAR(50) DEFAULT 'draft',
  submitted_at TIMESTAMP NULL,
  completion_percentage INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_scheme ON applications(scheme_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_submitted ON applications(submitted_at);
