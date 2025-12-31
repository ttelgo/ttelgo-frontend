/**
 * QR Code Utilities
 * Handles extraction of QR code images from ZIP files
 */

import JSZip from 'jszip'

/**
 * Extract PNG image from ZIP file (base64 or binary string)
 * Returns data URL for direct image display
 */
export async function extractQRCodeFromZip(zipData: string): Promise<string> {
  try {
    console.log('Extracting QR code from ZIP, data length:', zipData.length)
    console.log('First 20 characters:', zipData.substring(0, 20))
    
    // Check if it's a ZIP file (starts with "PK" - char codes 80, 75)
    // The data might come as a string with binary characters or escape sequences
    const firstChar = zipData.charCodeAt(0)
    const secondChar = zipData.charCodeAt(1)
    const isZip = zipData.startsWith('PK') || (firstChar === 80 && secondChar === 75) // 'P'=80, 'K'=75
    
    if (!isZip) {
      console.log('Data does not start with PK, checking other formats...')
      // If not a ZIP, assume it's already a data URL or base64 image
      if (zipData.startsWith('data:image')) {
        return zipData
      }
      if (zipData.startsWith('data:application')) {
        // Try to extract from base64 encoded ZIP
        const binaryString = atob(zipData.split(',')[1])
        return await extractQRCodeFromZip(binaryString)
      }
      // If it looks like base64 image, convert to data URL
      if (zipData.match(/^[A-Za-z0-9+/=\s]+$/)) {
        const cleanBase64 = zipData.replace(/\s/g, '')
        return `data:image/png;base64,${cleanBase64}`
      }
      // If it contains escape sequences that might represent ZIP, try to decode
      if (zipData.includes('\\u') || zipData.includes('\\x')) {
        console.log('Found escape sequences, attempting to decode...')
        // Try to unescape the string
        try {
          // Use JSON.parse to handle Unicode escape sequences
          const unescaped = JSON.parse(`"${zipData.replace(/"/g, '\\"')}"`)
          if (unescaped.startsWith('PK')) {
            return await extractQRCodeFromZip(unescaped)
          }
        } catch (e) {
          console.warn('Failed to unescape:', e)
        }
      }
      throw new Error('Data does not appear to be a ZIP file')
    }

    console.log('Confirmed ZIP file, converting to bytes...')
    // Convert string to Uint8Array for JSZip
    // Handle binary string format (each char represents a byte)
    // Note: JavaScript strings are UTF-16, so we need to handle this carefully
    const bytes = new Uint8Array(zipData.length)
    for (let i = 0; i < zipData.length; i++) {
      const charCode = zipData.charCodeAt(i)
      // Ensure valid byte range (0-255)
      // For binary data in strings, charCodeAt should give us the byte value
      bytes[i] = charCode & 0xFF
    }

    console.log('Loading ZIP file with JSZip...')
    // Load ZIP file
    const zip = await JSZip.loadAsync(bytes)
    
    console.log('ZIP loaded, files:', Object.keys(zip.files))
    
    // Find PNG file in ZIP (usually ends with .png)
    const pngFile = Object.keys(zip.files).find(file => 
      file.toLowerCase().endsWith('.png')
    )

    if (!pngFile) {
      console.error('No PNG file found in ZIP. Available files:', Object.keys(zip.files))
      throw new Error('No PNG file found in ZIP archive')
    }

    console.log('Found PNG file:', pngFile, 'extracting...')
    // Extract PNG as base64
    const pngBase64 = await zip.file(pngFile)!.async('base64')
    
    console.log('PNG extracted successfully, length:', pngBase64.length)
    // Return as data URL
    return `data:image/png;base64,${pngBase64}`
  } catch (error) {
    console.error('Error extracting QR code from ZIP:', error)
    throw new Error(`Failed to extract QR code image from ZIP file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Process QR code data - handles both ZIP files and direct image data
 * The API returns QR code as a JSON string (may contain escape sequences for binary data)
 */
export async function processQRCodeData(qrData: string): Promise<string> {
  console.log('Processing QR code data, length:', qrData.length, 'first 50 chars:', qrData.substring(0, 50))
  
  // If it's already a data URL, return as is
  if (qrData.startsWith('data:image')) {
    console.log('Already a data URL, returning as-is')
    return qrData
  }

  // Check if it's a ZIP file (binary string starting with "PK")
  // After JSON.parse, escape sequences become actual characters
  const firstChar = qrData.charCodeAt(0)
  const secondChar = qrData.charCodeAt(1)
  const isZip = qrData.startsWith('PK') || (firstChar === 80 && secondChar === 75) // 'P'=80, 'K'=75
  
  if (isZip) {
    console.log('Detected ZIP file (binary string), extracting PNG...')
    try {
      return await extractQRCodeFromZip(qrData)
    } catch (error) {
      console.error('Failed to extract from ZIP:', error)
      throw error
    }
  }

  // If it's base64 encoded, decode and check format
  // Base64 strings typically match this pattern (may include whitespace/newlines)
  const base64Pattern = /^[A-Za-z0-9+/=\s\n\r]+$/
  if (base64Pattern.test(qrData)) {
    try {
      console.log('Detected base64 pattern, decoding...')
      // Remove all whitespace, newlines
      const cleanBase64 = qrData.replace(/[\s\n\r]/g, '')
      
      // Decode base64 to binary string
      const binaryString = atob(cleanBase64)
      
      // Check if decoded data is a ZIP file (starts with "PK")
      if (binaryString.startsWith('PK') || 
          (binaryString.charCodeAt(0) === 80 && binaryString.charCodeAt(1) === 75)) {
        console.log('Detected base64-encoded ZIP file, extracting PNG...')
        return await extractQRCodeFromZip(binaryString)
      }
      
      // If not a ZIP, assume it's a PNG image in base64
      console.log('Detected base64 PNG image')
      return `data:image/png;base64,${cleanBase64}`
    } catch (e) {
      console.warn('Error processing base64 data:', e)
      // If decoding fails, try treating as direct base64 PNG
      const cleanBase64 = qrData.replace(/[\s\n\r]/g, '')
      return `data:image/png;base64,${cleanBase64}`
    }
  }

  // If it contains escape sequences (like \u0003, \x03), the JSON parser should have handled them
  // But if we still see them as literal strings, try to process
  if (qrData.includes('\\u') || qrData.includes('\\x')) {
    console.log('Found escape sequences, attempting to process...')
    try {
      // Try JSON.parse to handle Unicode escape sequences
      // Wrap in quotes to make it a valid JSON string
      const processed = JSON.parse(`"${qrData.replace(/"/g, '\\"')}"`)
      if (processed.startsWith('PK')) {
        return await extractQRCodeFromZip(processed)
      }
    } catch (e) {
      console.warn('Failed to process escape sequences:', e)
    }
  }

  // Last attempt: check if it looks like it might be ZIP data but in an unusual format
  // Sometimes binary data in JSON strings can have control characters
  if (qrData.length > 100 && (firstChar === 80 || firstChar === 112) && (secondChar === 75 || secondChar === 107)) {
    console.log('Data might be ZIP (case-insensitive check), attempting extraction...')
    try {
      return await extractQRCodeFromZip(qrData)
    } catch (e) {
      console.warn('Extraction failed:', e)
    }
  }

  // Return as is (might be a URL or other format)
  console.warn('QR code data format not recognized, returning as-is. First chars:', qrData.substring(0, 20))
  return qrData
}


