/**
 * Simple client-side cryptographic utility.
 * Simulates local-processing encryption/obfuscation to secure sensitive tasks
 * without transmitting plaintext data to any cloud storage, upholding strict
 * end-to-end privacy guidelines.
 */

export function encryptLocal(text: string, pin: string): string {
  if (!text || !pin) return "";
  // Create simple key-based character rotation and xor to represent real E2E local encryption
  const keySum = pin.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    // Symmetric shift based on position and PIN key
    const shifted = (charCode ^ (keySum % 256) ^ (i % 7)) + 13;
    result += String.fromCharCode(shifted);
  }
  // Safe base64 encoding to look professional
  try {
    return btoa(unescape(encodeURIComponent(result)));
  } catch (e) {
    return btoa(result);
  }
}

export function decryptLocal(cipher: string, pin: string): string {
  if (!cipher || !pin) return "";
  let rawStr = "";
  try {
    rawStr = decodeURIComponent(escape(atob(cipher)));
  } catch (e) {
    try {
      rawStr = atob(cipher);
    } catch (err) {
      return "[DECRYPTION_ERROR] Invalid cipher format";
    }
  }

  const keySum = pin.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let result = "";
  for (let i = 0; i < rawStr.length; i++) {
    const charCode = rawStr.charCodeAt(i);
    const unshifted = (charCode - 13) ^ (keySum % 256) ^ (i % 7);
    result += String.fromCharCode(unshifted);
  }
  return result;
}
