-- Create documents table for MySQL
CREATE TABLE IF NOT EXISTS documents (
  document_id VARCHAR(36) PRIMARY KEY,
  application_id VARCHAR(36),
  document_type VARCHAR(100) NOT NULL,
  file_path TEXT NOT NULL,
  ocr_data JSON,
  is_verified BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes
CREATE INDEX idx_documents_application ON documents(application_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_verified ON documents(is_verified);
