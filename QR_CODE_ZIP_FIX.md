# QR Code ZIP File Extraction Fix

## Issue
The backend API returns QR codes as ZIP files containing PNG images, not direct image data. The `qrCode` field contains a ZIP archive that needs to be extracted to display the QR code image.

## Solution
Added JSZip library and created a utility function to:
1. Detect if the QR code data is a ZIP file (starts with "PK")
2. Extract the PNG image from the ZIP archive
3. Convert it to a data URL for direct display in `<img>` tags

## Implementation

### 1. Installed JSZip
```bash
npm install jszip
```

### 2. Created QR Code Utility (`src/shared/utils/qrCodeUtils.ts`)
- `extractQRCodeFromZip()`: Extracts PNG from ZIP file
- `processQRCodeData()`: Handles both ZIP files and direct image data

### 3. Updated My eSIM Page
- Automatically processes QR code data when received
- Handles ZIP extraction transparently
- Falls back gracefully if extraction fails

## How It Works

1. **API Response**: Backend returns `{ qrCode: "PK..." }` (ZIP file as string)
2. **Detection**: Code checks if data starts with "PK" (ZIP signature)
3. **Extraction**: JSZip extracts the PNG file from the ZIP
4. **Conversion**: PNG is converted to base64 data URL
5. **Display**: Image is displayed using `<img src={dataUrl} />`

## Testing

When you click "Get QR Code":
1. API call fetches QR code data
2. Code automatically detects it's a ZIP file
3. PNG is extracted and converted to data URL
4. QR code image displays automatically

## Error Handling

- If ZIP extraction fails, error message is shown
- If QR code is already a data URL, it's used directly
- If QR code is base64, it's converted to data URL
- Manual UUID input still works as fallback

---

**The QR code should now display automatically when you click "Get QR Code"!** ✅

