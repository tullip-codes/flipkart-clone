"""
Email service — Resend API integration.

Design decisions:
- Uses httpx for HTTP calls (already available in FastAPI environments)
- Single send_email() function — reusable for any future email type
- send_order_confirmation() is the domain-specific wrapper
- Errors are logged but never raised — email failure must never break
  order placement. Order is already committed before email is attempted.

DEV NOTE:
  Resend free tier only allows sending to your own verified email address
  unless a custom domain is verified at resend.com/domains.

  EMAIL_DEV_OVERRIDE in .env redirects emails to your verified Resend address
  when the actual user email is different — safe for assignment demo.

  For production:
  1. Verify domain at resend.com/domains
  2. Update EMAIL_FROM to use that domain
  3. Remove EMAIL_DEV_OVERRIDE from .env
"""

import os
import logging
import httpx

from app.models.order import Order
from app.services.email_templates import build_order_confirmation_email

logger = logging.getLogger(__name__)

RESEND_API_KEY     = os.getenv("RESEND_API_KEY", "")
EMAIL_FROM         = os.getenv("EMAIL_FROM", "onboarding@resend.dev")
EMAIL_FROM_NAME    = os.getenv("EMAIL_FROM_NAME", "Flipkart Clone")
EMAIL_DEV_OVERRIDE = os.getenv("EMAIL_DEV_OVERRIDE", "")
RESEND_API_URL     = "https://api.resend.com/emails"


async def send_email(to: str, subject: str, html: str) -> bool:
    """
    Core email sender using Resend API.

    Returns True on success, False on any failure.
    Never raises — callers must not need to handle email errors.
    """
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not set — skipping email to %s", to)
        return False

    payload = {
        "from":    f"{EMAIL_FROM_NAME} <{EMAIL_FROM}>",
        "to":      [to],
        "subject": subject,
        "html":    html,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                RESEND_API_URL,
                json=payload,
                headers={
                    "Authorization": f"Bearer {RESEND_API_KEY}",
                    "Content-Type":  "application/json",
                },
            )

        if response.status_code in (200, 201):
            logger.info("Email sent successfully to %s", to)
            return True
        else:
            logger.error(
                "Resend API error %s: %s",
                response.status_code,
                response.text,
            )
            return False

    except httpx.TimeoutException:
        logger.error("Email send timed out for %s", to)
        return False
    except Exception as exc:
        logger.error("Unexpected email error for %s: %s", to, exc)
        return False


async def send_order_confirmation(
    order: Order,
    user_email: str,
    user_full_name: str,
) -> bool:
    """
    Sends order confirmation email to the user.

    DEV behaviour:
    - If EMAIL_DEV_OVERRIDE is set AND the user's email differs from it,
      redirect to the verified address (Resend free tier restriction).
    - If user's email matches EMAIL_DEV_OVERRIDE, send directly — no redirect.
    - If EMAIL_DEV_OVERRIDE is not set, always use the actual user email
      (production mode — requires verified domain).

    This means: register/login with your Resend-verified email during development
    and the email arrives correctly at that address every time.
    """
    subject, html = build_order_confirmation_email(order, user_full_name)

    # Determine recipient
    if EMAIL_DEV_OVERRIDE and EMAIL_DEV_OVERRIDE != user_email:
        # User email is not the verified Resend address — redirect
        logger.info(
            "DEV OVERRIDE: user email '%s' not verified with Resend "
            "— redirecting confirmation email to '%s'",
            user_email,
            EMAIL_DEV_OVERRIDE,
        )
        recipient = EMAIL_DEV_OVERRIDE
    else:
        # Either no override set (production) or user IS the verified address
        recipient = user_email

    return await send_email(to=recipient, subject=subject, html=html)