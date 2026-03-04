# Document Upload Feature - Testing Guide

## Quick Test Steps

### 1. Start the Servers

Run the batch file to start both backend and frontend:
```bash
START_SERVERS.bat
```

Or manually:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Login to Your Account

1. Open browser: `http://localhost:5173`
2. Login with your admin account:
   - Email: `subh@gmail.com`
   - Password: `Subh@8617`

### 3. Test Document Upload

#### Option A: Create New Profile (if you don't have one)

1. Click on "Profile" in the header
2. If redirected to create profile page, you'll see the form
3. Fill in basic information (optional fields)
4. Scroll down to "Identity Documents" section
5. Test each document type:

   **Aadhaar Card:**
   - Click on "Click to upload Aadhaar Card" area
   - Select a JPG, PNG, or PDF file (max 5MB)
   - You should see the filename appear with a green background
   - Click the X button to remove and try again

   **PAN Card:**
   - Click on "Click to upload PAN Card" area
   - Select a file
   - Verify it appears correctly

   **Voter ID Card:**
   - Click on "Click to upload Voter ID Card" area
   - Select a file
   - Verify it appears correctly

6. Click "Create Profile" button
7. You should see success message and be redirected to profile page

#### Option B: Update Existing Profile

1. If you already have a profile, you'll need to delete it first:
   ```sql
   mysql -u root -pSubh@8617 -e "DELETE FROM user_profiles WHERE user_id = (SELECT user_id FROM users WHERE email = 'subh@gmail.com');" yojanasaathi
   ```
2. Refresh the page and follow Option A steps

### 4. View Uploaded Documents

1. After creating profile, you should be on the Profile page
2. Scroll down to see "Identity Documents" section
3. You should see color-coded cards for each uploaded document:
   - Aadhaar Card (green background)
   - PAN Card (blue background)
   - Voter ID Card (purple background)
4. Each card shows:
   - Document icon
   - Document type name
   - "Uploaded" status
   - Download button

### 5. Test Document Download

1. Click the "Download" button on any document card
2. The file should download to your Downloads folder
3. Open the downloaded file to verify it's correct
4. Repeat for all uploaded documents

### 6. Test File Validation

Try these scenarios to test validation:

**Test 1: Invalid File Type**
1. Try uploading a .txt or .docx file
2. You should see error: "Only JPG, PNG, and PDF files are allowed"

**Test 2: File Too Large**
1. Try uploading a file larger than 5MB
2. You should see error: "File size must be less than 5MB"

**Test 3: Valid Files**
1. Upload JPG image - should work
2. Upload PNG image - should work
3. Upload PDF document - should work

### 7. Verify Backend Storage

1. Check that files are saved in the backend:
   ```bash
   ls backend/uploads/documents/
   ```
2. You should see files with random hash names (e.g., `a1b2c3d4e5f6...jpg`)

### 8. Verify Database Entries

1. Check database for document filenames:
   ```sql
   mysql -u root -pSubh@8617 -e "SELECT aadhaar_document, pan_document, voter_card_document FROM user_profiles WHERE user_id = (SELECT user_id FROM users WHERE email = 'subh@gmail.com');" yojanasaathi
   ```
2. You should see the filenames stored in the database

## Expected Results

✅ **Success Indicators:**
- File upload UI appears in profile create page
- Files can be selected and appear with green background
- Profile creates successfully with documents
- Documents appear in profile view page with color-coded cards
- Download buttons work and download correct files
- Invalid files are rejected with error messages
- Files are stored in `backend/uploads/documents/`
- Filenames are stored in database

❌ **Failure Indicators:**
- Upload area doesn't appear
- Files don't upload or show errors
- Profile creation fails
- Documents don't appear in profile view
- Download doesn't work
- Invalid files are accepted
- Files not saved to disk
- Database not updated

## Troubleshooting

### Issue: Upload area not visible
**Solution**: Clear browser cache and refresh page

### Issue: "Failed to create profile" error
**Solution**: 
1. Check backend console for errors
2. Verify MySQL is running
3. Check backend logs: `backend/logs/`

### Issue: Download not working
**Solution**:
1. Verify file exists: `ls backend/uploads/documents/`
2. Check browser console for errors
3. Verify you're logged in

### Issue: "Invalid file type" for valid files
**Solution**: 
1. Check file extension is .jpg, .jpeg, .png, or .pdf
2. Check file MIME type is correct
3. Try a different file

## Sample Test Files

You can use these types of files for testing:
- Any JPG/PNG image from your computer
- Any PDF document
- Screenshots work great for testing

## Clean Up After Testing

To reset and test again:

1. **Delete uploaded files:**
   ```bash
   rm backend/uploads/documents/*
   ```

2. **Delete profile from database:**
   ```sql
   mysql -u root -pSubh@8617 -e "DELETE FROM user_profiles WHERE user_id = (SELECT user_id FROM users WHERE email = 'subh@gmail.com');" yojanasaathi
   ```

3. **Refresh browser and test again**

## What's Next?

After successful testing, you can:
1. Create profiles for other users
2. Test with different file types and sizes
3. Implement profile edit page (future enhancement)
4. Add document verification workflow (future enhancement)
5. Switch to AWS S3 for production (see DOCUMENT_UPLOAD_FEATURE.md)

## Need Help?

Check these files for more information:
- `DOCUMENT_UPLOAD_FEATURE.md` - Complete feature documentation
- Backend logs: `backend/logs/`
- Browser console: F12 → Console tab
- Network tab: F12 → Network tab (to see API calls)
