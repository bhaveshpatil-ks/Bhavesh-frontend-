# 🛡️ Security, Privacy Compliance & JWT Architecture

This document details the security model, zero-data exploitation pledge, and authentication protocols implemented in **Bhavesh Patil's Portfolio**.

---

## 1. Zero-Data Selling & Privacy Commitment

- **Zero Commercial Monetization**: No user data, contact details, emails, or interactions are ever sold, rented, or traded to third-party ad networks or data brokers.
- **Client-Side Cookie Control**: Interactive cookie consent management adhering to GDPR & CCPA principles (`localStorage` key: `bhavesh_cookie_consent`).
- **Data Deletion on Demand**: Users can wipe their cached agreement and local state anytime through the footer cookie controls.

---

## 2. Authentication & JWT Security

- **Dual-Layer Authentication**:
  1. **Firebase Authentication**: Handles OAuth2 Google Identity Provider & Email/Password credential hashing.
  2. **Active Backend JWT Verification**: User ID tokens are signed with HMAC-SHA256 (`JWT_SECRET`) on the backend and validated on sensitive endpoints.
- **Post-Login Security Gate**:
  - `TermsConsentModal` verifies policy acknowledgment for newly authenticated users before session authorization.

---

## 3. Threat Mitigation & Rate Limiting

- **DDoS & Form Spam Shield**: Strict rate limiting on guest contact submissions (`/api/contact`) and support tickets (`/api/support/ticket`).
- **Cross-Origin Resource Sharing (CORS)**: Configured for whitelisted production domains and local development environments.
- **XSS & Injection Protection**: HTML sanitization on all user-supplied input streams.
