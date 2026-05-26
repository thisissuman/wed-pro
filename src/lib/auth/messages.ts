/**
 * Human-friendly auth error messages (Supabase codes + common strings).
 */

export function mapAuthErrorMessage(message: string): string {
  const lower = message.toLowerCase();

  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid_credentials")
  ) {
    return "Email or password is incorrect. If you signed up with Google, use Continue with Google instead.";
  }

  if (
    lower.includes("user already registered") ||
    lower.includes("already been registered") ||
    lower.includes("email address is already") ||
    lower.includes("user_already_exists") ||
    lower.includes("email_exists")
  ) {
    return "This email is already registered. Sign in to continue, or reset your password if you forgot it.";
  }

  if (lower.includes("password") && lower.includes("least")) {
    return message;
  }

  if (lower.includes("email not confirmed")) {
    return "Please confirm your email using the link we sent, then sign in.";
  }

  if (lower.includes("signup is disabled")) {
    return "New signups are temporarily unavailable. Please try again later.";
  }

  return message;
}

export const AUTH_ALREADY_REGISTERED =
  "This email is already registered. Sign in to continue, or reset your password if you forgot it.";
