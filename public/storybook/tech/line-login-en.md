# LINE Login

## Setup
- **LINE Login v2.1** (OIDC).
- Shared channel under the **markluce** provider.
- Single LINE channel handles all partner slugs — attribution comes from the `state` param, not from separate channels.

## Partner attribution
- When a user clicks "sign in" on `app.markluce.ai/{slug}`, the redirect URL includes `state={slug}` (or a signed token containing `{slug}`).
- On callback, extract the slug and persist it on the user record as **first-touch partner**.
- First-touch is sticky — it does not get overwritten if the user later visits another partner page.
- All subsequent generations and billable events tag this partner for analytics + billing.

## Scopes
- `profile` — display name + avatar.
- `openid` — stable user ID.
- `email` optional (LINE Login only returns email if pre-verified).

## Sessions
- Standard server-side session after OIDC callback.
- Token refresh handled per LINE spec.

## Partner / admin roles
- End user = default.
- Partner = unlocks `/admin` for their own slug only (set manually by Mark at onboarding).
- Admin (Mark) = global.
