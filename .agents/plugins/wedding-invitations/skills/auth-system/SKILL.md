# Auth System Skill

## Purpose

The authentication system manages:
- user signup
- login
- sessions
- protected dashboard access

Authentication should feel:
- simple
- secure
- frictionless

---

# Core Stack

Use:
- Supabase Auth

Support:
- email/password
- Google login
- OTP later if needed

---

# Core Philosophy

Authentication should:
- minimize friction
- remain mobile-friendly
- feel fast
- avoid unnecessary complexity

Users should access the dashboard quickly.

---

# Security Rules

Never expose:
- service role keys
- secrets
- private tokens

Always validate:
- user ownership
- protected routes
- dashboard access

---

# Session Rules

Sessions should:
- persist securely
- refresh safely
- handle expiration gracefully

Avoid broken auth states.

---

# Protected Route Rules

Dashboard routes must remain protected.

Public invitation pages must remain publicly accessible.

Separate:
- authenticated dashboard
- public invitation experience

---

# UX Rules

Auth flows should:
- remain minimal
- support mobile devices
- provide clear feedback

Avoid:
- long onboarding flows
- unnecessary form complexity

---

# Error Handling

Always handle:
- invalid credentials
- expired sessions
- network failures
- unauthorized access

Provide clear messaging.

---

# Performance Rules

Auth flows must remain:
- lightweight
- responsive
- fast loading

Avoid auth-heavy client rendering.

---

# Final Principles

Always prioritize:
1. security
2. simplicity
3. smooth onboarding
4. mobile experience
5. reliability

Authentication should feel:
- invisible
- fast
- effortless