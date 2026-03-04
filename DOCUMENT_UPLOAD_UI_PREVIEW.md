# Document Upload UI Preview

## What Users Will See

### 1. Profile Create Page - Document Upload Section

```
┌─────────────────────────────────────────────────────────────┐
│ 📄 Identity Documents                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Upload your identity documents for verification (Optional). │
│ Accepted formats: JPG, PNG, PDF (Max 5MB each)              │
│                                                              │
│ Aadhaar Card                                                 │
│ ┌───────────────────────────────────────────────────────┐   │
│ │  ⬆️  Click to upload Aadhaar Card                     │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                              │
│ PAN Card                                                     │
│ ┌───────────────────────────────────────────────────────┐   │
│ │  ⬆️  Click to upload PAN Card                         │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                              │
│ Voter ID Card                                                │
│ ┌───────────────────────────────────────────────────────┐   │
│ │  ⬆️  Click to upload Voter ID Card                    │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2. After Selecting a File

```
┌─────────────────────────────────────────────────────────────┐
│ 📄 Identity Documents                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Aadhaar Card                                                 │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ 📄 my_aadhaar_card.pdf                            ❌  │   │
│ └───────────────────────────────────────────────────────┘   │
│ (Green background indicating file selected)                 │
│                                                              │
│ PAN Card                                                     │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ 📄 pan_card_image.jpg                             ❌  │   │
│ └───────────────────────────────────────────────────────┘   │
│ (Green background indicating file selected)                 │
│                                                              │
│ Voter ID Card                                                │
│ ┌───────────────────────────────────────────────────────┐   │
│ │  ⬆️  Click to upload Voter ID Card                    │   │
│ └───────────────────────────────────────────────────────┘   │
│ (Still empty, user can skip this)                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3. Profile View Page - Documents Section

```
┌─────────────────────────────────────────────────────────────┐
│ 📄 Identity Documents                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📄 Aadhaar Card                    [⬇️ Download]       │ │
│ │    Uploaded                                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│ (Green background)                                           │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📄 PAN Card                        [⬇️ Download]       │ │
│ │    Uploaded                                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│ (Blue background)                                            │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📄 Voter ID Card                   [⬇️ Download]       │ │
│ │    Uploaded                                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│ (Purple background)                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## User Interactions

### Upload Flow

1. **Click Upload Area**
   - User clicks on the dashed border area
   - File picker dialog opens
   - User selects JPG, PNG, or PDF file

2. **File Validation**
   - ✅ Valid file: Shows filename with green background
   - ❌ Invalid type: Shows error toast "Only JPG, PNG, and PDF files are allowed"
   - ❌ Too large: Shows error toast "File size must be less than 5MB"

3. **Remove File**
   - User clicks ❌ button
   - File is removed from selection
   - Upload area returns to empty state

4. **Submit Form**
   - User clicks "Create Profile" button
   - Files are uploaded with form data
   - Success: Redirects to profile page
   - Error: Shows error message

### Download Flow

1. **View Documents**
   - User navigates to Profile page
   - Scrolls to "Identity Documents" section
   - Sees all uploaded documents

2. **Download Document**
   - User clicks "Download" button
   - File downloads to browser's download folder
   - Success toast: "Document downloaded successfully"
   - Error toast: "Failed to download document"

## Visual Design

### Colors

- **Aadhaar Card**: Green theme
  - Background: `bg-green-50`
  - Border: `border-green-200`
  - Icon: `text-green-600`
  - Button: `text-green-700`, `border-green-300`

- **PAN Card**: Blue theme
  - Background: `bg-blue-50`
  - Border: `border-blue-200`
  - Icon: `text-blue-600`
  - Button: `text-blue-700`, `border-blue-300`

- **Voter ID Card**: Purple theme
  - Background: `bg-purple-50`
  - Border: `border-purple-200`
  - Icon: `text-purple-600`
  - Button: `text-purple-700`, `border-purple-300`

### Icons

- 📄 `FileText` - Document icon
- ⬆️ `Upload` - Upload icon
- ❌ `X` - Remove icon
- ⬇️ `Download` - Download icon

### States

1. **Empty State** (No file selected)
   - Dashed border
   - Gray background on hover
   - Upload icon and text

2. **Selected State** (File selected)
   - Solid border
   - Colored background (green)
   - File icon, filename, and remove button

3. **Uploaded State** (In profile view)
   - Solid border
   - Colored background (green/blue/purple)
   - Document type, status, and download button

## Responsive Design

### Desktop (md and above)
- Full width upload areas
- Side-by-side layout for document info and download button
- Larger icons and text

### Mobile (below md)
- Stacked layout
- Full width buttons
- Smaller icons
- Touch-friendly tap targets

## Accessibility

- ✅ Keyboard navigation supported
- ✅ Screen reader friendly labels
- ✅ Clear error messages
- ✅ Visual feedback for all actions
- ✅ Color contrast meets WCAG standards

## Error Messages

### File Upload Errors

```
❌ "Only JPG, PNG, and PDF files are allowed"
   - Shown when user selects invalid file type

❌ "File size must be less than 5MB"
   - Shown when file exceeds size limit

❌ "Failed to create profile"
   - Shown when server error occurs during upload
```

### Download Errors

```
❌ "Failed to download document"
   - Shown when download fails

❌ "Access denied"
   - Shown when user tries to access another user's document
```

## Success Messages

```
✅ "Profile created successfully!"
   - Shown after successful profile creation with documents

✅ "Document downloaded successfully"
   - Shown after successful document download
```

## Loading States

### During Upload
```
[Creating Profile...]
```
- Button shows loading text
- Button is disabled
- User cannot submit again

### During Download
- Browser shows download progress
- File appears in downloads folder

## Empty States

### No Documents Uploaded
- "Identity Documents" section is hidden
- Only shows if at least one document exists

### Optional Upload
- All document uploads are optional
- User can skip and create profile without documents
- "Skip for Now" button available

## User Experience Flow

```
1. User fills profile form
   ↓
2. User scrolls to documents section
   ↓
3. User clicks upload area
   ↓
4. User selects file from computer
   ↓
5. File appears with green background
   ↓
6. User can remove and re-upload if needed
   ↓
7. User clicks "Create Profile"
   ↓
8. Files upload with form data
   ↓
9. Success! Redirected to profile page
   ↓
10. User sees uploaded documents
    ↓
11. User can download documents anytime
```

## Tips for Users

💡 **Tip 1**: All document uploads are optional. You can create your profile without uploading documents and add them later.

💡 **Tip 2**: Make sure your files are clear and readable. Blurry or low-quality images may not be accepted for verification.

💡 **Tip 3**: You can upload documents in any format: JPG, PNG, or PDF. Choose the format that works best for you.

💡 **Tip 4**: Keep your file sizes under 5MB. If your file is too large, try compressing it or taking a new photo.

💡 **Tip 5**: You can download your uploaded documents anytime from your profile page.

---

This UI provides a clean, intuitive, and user-friendly experience for uploading and managing identity documents!
