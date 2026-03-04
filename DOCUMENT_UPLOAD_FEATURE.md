# Document Upload Feature - Complete Guide

## Overview
Users can now upload identity documents (Aadhaar Card, PAN Card, Voter ID Card) during profile creation for authentication purposes.

## Features Implemented

### 1. Backend Implementation

#### File Upload Configuration
- **Location**: `backend/src/utils/fileUpload.ts`
- **Storage**: Local file system (`backend/uploads/documents/`)
- **Allowed formats**: JPG, PNG, PDF
- **File size limit**: 5MB per file
- **Security**: Files are renamed with random hash to prevent conflicts

#### Database Schema
- **Table**: `user_profiles`
- **New columns**:
  - `aadhaar_document` (TEXT, nullable)
  - `pan_document` (TEXT, nullable)
  - `voter_card_document` (TEXT, nullable)

#### API Endpoints

**Create Profile with Documents**
```
POST /api/profile
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body (FormData):
- date_of_birth
- gender
- state
- district
- pin_code
- category
- occupation
- annual_income
- family_size
- education_qualification
- aadhaar_document (file, optional)
- pan_document (file, optional)
- voter_card_document (file, optional)
```

**Update Profile with Documents**
```
PUT /api/profile
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: Same as create (only changed fields needed)
```

**Download Document**
```
GET /api/profile/document/:filename
Authorization: Bearer <token>

Returns: File download (with security check)
```

#### Security Features
- Only authenticated users can upload documents
- Users can only download their own documents
- Old files are automatically deleted when new ones are uploaded
- Files are cleaned up if profile creation/update fails

### 2. Frontend Implementation

#### Profile Create Page
- **Location**: `frontend/src/pages/profile/ProfileCreatePage.tsx`
- **Features**:
  - Drag-and-drop style file upload UI
  - File type validation (JPG, PNG, PDF only)
  - File size validation (5MB max)
  - Preview of selected files with remove option
  - Visual feedback with icons and colors
  - Optional uploads (users can skip)

#### Profile View Page
- **Location**: `frontend/src/pages/profile/ProfilePage.tsx`
- **Features**:
  - Display uploaded documents with color-coded cards
  - Download button for each document
  - Shows document type and upload status
  - Only displays section if documents exist

## Usage Instructions

### For Users

1. **Creating Profile with Documents**:
   - Navigate to Profile Create page
   - Fill in personal information
   - Scroll to "Identity Documents" section
   - Click on upload area for each document type
   - Select file (JPG, PNG, or PDF, max 5MB)
   - File name will appear with green checkmark
   - Click "Create Profile" to save

2. **Viewing Uploaded Documents**:
   - Go to Profile page
   - Scroll to "Identity Documents" section
   - See all uploaded documents with color-coded cards
   - Click "Download" button to download any document

3. **Updating Documents**:
   - Go to Profile Edit page (to be implemented)
   - Upload new documents to replace old ones
   - Old files are automatically deleted

### For Developers

#### Adding New Document Types

1. **Update Profile Model** (`backend/src/models/Profile.ts`):
```typescript
@Column({ type: 'text', nullable: true })
new_document_type?: string
```

2. **Update File Upload** (`backend/src/utils/fileUpload.ts`):
```typescript
const documentUpload = upload.fields([
  { name: 'aadhaar_document', maxCount: 1 },
  { name: 'pan_document', maxCount: 1 },
  { name: 'voter_card_document', maxCount: 1 },
  { name: 'new_document_type', maxCount: 1 }, // Add this
])
```

3. **Update Frontend State** (`ProfileCreatePage.tsx`):
```typescript
const [documents, setDocuments] = useState({
  aadhaar_document: null,
  pan_document: null,
  voter_card_document: null,
  new_document_type: null, // Add this
})
```

4. **Add UI Component** in ProfileCreatePage.tsx (copy existing document upload section)

#### Switching to AWS S3

To use AWS S3 instead of local storage:

1. Configure AWS credentials in `backend/.env`:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=yojanasaathi-documents
```

2. Update `backend/src/utils/fileUpload.ts`:
```typescript
import { uploadToS3 } from '../config/aws'

// Replace multer storage with S3 upload logic
```

3. Update controller to use S3 URLs instead of filenames

## File Structure

```
backend/
├── src/
│   ├── models/
│   │   └── Profile.ts (updated with document fields)
│   ├── controllers/
│   │   └── profile.controller.ts (updated with file handling)
│   ├── routes/
│   │   └── profile.routes.ts (updated with multer middleware)
│   └── utils/
│       └── fileUpload.ts (NEW - multer configuration)
├── uploads/
│   └── documents/ (NEW - file storage directory)

frontend/
└── src/
    └── pages/
        └── profile/
            ├── ProfileCreatePage.tsx (updated with file upload UI)
            └── ProfilePage.tsx (updated with document display)

database/
└── migrations/
    └── 006_add_profile_documents.sql (NEW - database migration)
```

## Testing

### Manual Testing Steps

1. **Test File Upload**:
   - Create new profile with all three documents
   - Verify files are saved in `backend/uploads/documents/`
   - Check database for filename entries

2. **Test File Validation**:
   - Try uploading file > 5MB (should fail)
   - Try uploading .txt file (should fail)
   - Try uploading valid JPG/PNG/PDF (should succeed)

3. **Test File Download**:
   - View profile page
   - Click download button for each document
   - Verify correct file downloads

4. **Test Security**:
   - Try accessing another user's document URL (should fail)
   - Try accessing without authentication (should fail)

5. **Test File Replacement**:
   - Update profile with new document
   - Verify old file is deleted
   - Verify new file is saved

## Known Limitations

1. **Storage**: Currently uses local file system (not scalable for production)
2. **Validation**: No OCR or document verification implemented
3. **Compression**: Large images are not compressed before upload
4. **Preview**: No image preview before upload
5. **Edit Page**: Profile edit page not yet implemented

## Future Enhancements

1. Implement AWS S3 storage for production
2. Add OCR for automatic data extraction from documents
3. Add document verification/validation
4. Implement image compression
5. Add image preview modal
6. Add profile edit page with document update
7. Add document expiry tracking
8. Add admin document verification workflow

## Troubleshooting

### Files not uploading
- Check `backend/uploads/documents/` directory exists
- Verify file size < 5MB
- Check file format (JPG, PNG, PDF only)
- Check browser console for errors

### Download not working
- Verify user is authenticated
- Check file exists in uploads directory
- Verify filename matches database entry

### Database errors
- Run migration: `mysql -u root -p yojanasaathi < database/migrations/006_add_profile_documents.sql`
- Verify columns exist: `DESCRIBE user_profiles;`

## Support

For issues or questions, check:
1. Browser console for frontend errors
2. Backend logs for server errors
3. MySQL logs for database errors
4. File permissions on uploads directory
