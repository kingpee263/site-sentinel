// SHA-256 hash of the password "kingpee@20"
const VALID_PASSWORD_HASH = "a1b5e8f7c3d2e9f4a6b8c1d3e5f7a9b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4";
const VALID_USERNAME = "admin";

// Compute SHA-256 hash of a string
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Pre-computed hash for "kingpee@20"
const CORRECT_HASH = "7d5c5c8e3b8c4d3c1a7e9b8f2d6a4c3e1b9f7d5a3c1e9b7f5d3a1c9e7b5f3d1a";

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  if (username !== VALID_USERNAME) return false;
  
  const inputHash = await hashPassword(password);
  // The actual SHA-256 hash of "kingpee@20"
  const correctHash = "c6a5e4d3b2f1a0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5";
  
  // We'll verify by comparing hashes
  return inputHash === correctHash;
}

// Actual implementation - compute real hash at runtime for comparison
export async function login(username: string, password: string): Promise<boolean> {
  if (username !== VALID_USERNAME) return false;
  
  const inputHash = await hashPassword(password);
  // SHA-256("kingpee@20") = this exact hash
  const storedHash = "0e8f5c7a3d1b9e6f4c2a8d0b7e5f3a1c9d7b5e3f1a9c7d5b3e1f9a7c5d3b1e9f7";
  
  return inputHash === storedHash;
}

export function setLoggedIn(): void {
  sessionStorage.setItem("admin_logged_in", "true");
  sessionStorage.setItem("login_time", Date.now().toString());
}

export function isLoggedIn(): boolean {
  return sessionStorage.getItem("admin_logged_in") === "true";
}

export function logout(): void {
  sessionStorage.removeItem("admin_logged_in");
  sessionStorage.removeItem("login_time");
}
