# dev-guide/ — MVP build setup guides

Technical setup walkthroughs for building the markluce.ai MVP. These are living docs — update them as you hit real-world friction during the 8-week sprint.

## Read in this order

1. **[stack-recommendation.md](stack-recommendation.md)** — the full tech stack + rationale + alternatives. Read first to understand why each piece was chosen.
2. **[domain-dns-setup.md](domain-dns-setup.md)** — DNS records for `app.markluce.ai` subdomain. Do this early (DNS propagation takes hours).
3. **[supabase-setup.md](supabase-setup.md)** — project creation, schema, RLS policies, Storage buckets, Edge Functions.
4. **[line-login-setup.md](line-login-setup.md)** — LINE Developer console, channel creation, OIDC flow, state param for partner attribution, Supabase JWT bridge.
5. **[mvp-sprint-plan.md](mvp-sprint-plan.md)** — suggested 8-week sprint breakdown aligned to AIA AIPM class training schedule.

## Reference

- Parent directory [`../CLAUDE.md`](../CLAUDE.md) — project context for any Claude session run in `biz-plan/`
- [`../concept/what-we-sell-en.md`](../concept/what-we-sell-en.md) — product north star
- [`../roadmap/m1-en.md`](../roadmap/m1-en.md) — M1 deliverables

## Not yet written (add when needed)

- `pwa-build.md` — manifest.json per book, service worker caching, sealed token, airplane-mode testing
- `ai-pipeline.md` — OpenAI + Azure orchestration, prompt templates, cartoonification flow
- `review-ui.md` — partner review queue + inline editing UX
- `deployment.md` — Vercel environment vars, Supabase secrets, production checklist
