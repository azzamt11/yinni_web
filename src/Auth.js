// src/Auth.js
const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";
const REMEMBER_KEY = "rememberLogin";

function storage() {
  return localStorage.getItem(REMEMBER_KEY) === "true"
    ? localStorage
    : sessionStorage;
}

export function saveAuth(token, user, remember = false) {
  console.log("[saveAuth] remember =", remember);

  localStorage.setItem(REMEMBER_KEY, remember ? "true" : "false");

  const s = remember ? localStorage : sessionStorage;
  s.setItem(TOKEN_KEY, token);
  s.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem(REMEMBER_KEY);
}

export function getToken() {
  return storage().getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const s = storage().getItem(USER_KEY);
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

/**
 * NEW FUNCTION: Updates the role of the currently stored user in local/session storage.
 * This is used to instantly reflect a role change (e.g., self-promotion).
 * NOTE: This does NOT update the token claims, which should be updated on next login.
 */
export function updateUserRoleInStorage(newRole) {
  const user = getStoredUser();
  if (user) {
    const updatedUser = { ...user, role: newRole };
    const s = storage();
    s.setItem(USER_KEY, JSON.stringify(updatedUser));
    // Optional: Trigger a storage event or state update if other components need to react instantly
    window.dispatchEvent(new Event('storage'));
  }
}


export function isAuthenticated() {
  return !!getToken();
}

/** Check if user has at least one of required roles */
export function hasRole(requiredRoles = []) {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  const u = getStoredUser() || getUserFromToken();
  if (!u) return false;
  const role = (u.role || "").toString().toUpperCase();
  return requiredRoles.map((r) => r.toString().toUpperCase()).includes(role);
}

export function getUserFromToken() {
  const t = getToken();
  if (!t) return getStoredUser();
  const p = decodeJwt(t);
  if (!p) return getStoredUser();
  // common fields: sub, name, role, email — adjust depending on your JWT claims
  return {
    id: p.sub || p.id || null,
    name: p.name,
    role: "USER",
    ...p,
  };
}

/** Basic safe JWT decode (payload only). No signature verification here. */
export function decodeJwt(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    // Replaced atob with standard string manipulation for better compatibility
    const json = decodeURIComponent(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
          .split('')
          .map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join('')
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}