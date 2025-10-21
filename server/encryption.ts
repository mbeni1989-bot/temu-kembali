import CryptoJS from "crypto-js";

/**
 * Encryption utility for sensitive data
 * Uses AES-256 encryption
 */

// Get encryption key from environment or use default (MUST set in production)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "temu-kembali-default-key-change-in-production";

/**
 * Encrypt sensitive data
 */
export function encrypt(data: string): string {
  if (!data) return "";
  
  try {
    const encrypted = CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error("[Encryption] Failed to encrypt data:", error);
    return data; // Return original if encryption fails
  }
}

/**
 * Decrypt sensitive data
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) return "";
  
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("[Encryption] Failed to decrypt data:", error);
    return encryptedData; // Return original if decryption fails
  }
}

/**
 * Hash data (one-way, for passwords or sensitive IDs)
 */
export function hash(data: string): string {
  if (!data) return "";
  
  try {
    return CryptoJS.SHA256(data).toString();
  } catch (error) {
    console.error("[Encryption] Failed to hash data:", error);
    return data;
  }
}

/**
 * Mask sensitive data for display (e.g., phone number)
 * Example: 081234567890 -> 0812****7890
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 8) return phone;
  
  const start = phone.substring(0, 4);
  const end = phone.substring(phone.length - 4);
  const masked = start + "****" + end;
  
  return masked;
}

/**
 * Mask email for display
 * Example: user@example.com -> u***@example.com
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  
  const [username, domain] = email.split("@");
  const maskedUsername = username[0] + "***";
  
  return maskedUsername + "@" + domain;
}

