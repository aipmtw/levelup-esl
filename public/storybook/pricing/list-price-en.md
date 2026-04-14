# End-user list price model

## The rule
**Every book has a publicly displayed list price.** Partners may (and will) sell at their own discounted price **off-platform** through their own channel — markluce.ai never transacts that money.

## Why a list price at all
1. **Value anchor.** Without a visible price, end users don't know what the book is worth. A list price sets an expectation.
2. **Defends partner margin.** If the partner offers a 30% discount via their LINE group, the parent perceives real savings — not "is this any good?".
3. **Makes the product feel finished.** Adult-looking products have prices. Preview / prototype pages without prices feel tentative.
4. **Consistent cross-partner positioning.** A platform-level price range prevents a race to the bottom that would undermine all partners.

## My recommendation — platform-suggested range, partner picks within it

### Platform sets a suggested price range per age tier (in TWD)
| Age tier | Suggested range (NT$) | Midpoint |
|---|---|---|
| 0–3 | 500–900 | 700 |
| 4–6 | 700–1200 | 950 |
| 7–9 | 900–1500 | 1200 |
| 10–12 | 1100–1800 | 1450 |

**Numbers are placeholders — Mark calibrates with Audrey + Arita before M1 launch.** Range is wide enough that Audrey (peer-community volume play) and Arita (1:1 custom teaching aid, higher perceived value) can both fit without either feeling mispriced.

### Partner picks a specific list price in the CMS
- Public page shows: `建議零售價 NT$1,200 / Suggested list price NT$1,200`.
- Partner can pick anywhere in the range. Default = midpoint.
- Partner can override the display label ("建議零售價", "原價", "牌價", "List") to match their brand voice.

### Partner discounts happen off-platform
- Partner's LINE group, in-person chat, email, etc. — partner quotes the discounted price directly to each end user.
- markluce.ai does not charge end users. markluce.ai does not run a coupon system. markluce.ai does not know the actual transacted price (unless the partner records it in their private workspace).
- Example framing on public page:
  > **建議零售價 NT$1,200**
  > 透過 Audrey 的家長社群訂購可享會員優惠 — [加入 LINE 群取得報價 →]

### Partner tracks actual prices in private workspace
- Private workspace has a **per-customer actual price** field.
- Partner enters what they actually charged (optional; partner's choice).
- Partner sees their own analytics: average actual price vs list, discount distribution, top-paying customers.
- Mark never sees this data (beyond global admin override for support/troubleshooting).

## Why not let each partner set their own list price freely?
Could do it. Downsides:
- Race to the bottom: a new partner underprices everyone to steal attention, the whole category feels cheap.
- Cross-partner confusion: parent sees NT$500 on partner A and NT$1,500 on partner B for what looks like the same product.

Suggested range is a compromise: partners have room to position (Audrey lower, Arita higher) but the category keeps a coherent shape.

## Why not hide the price entirely?
Could do it. Downsides:
- Parents assume it's free or a toy prototype.
- No anchor makes partner discounts invisible.
- Serious gifts / keepsakes need a price tag to feel serious.

## Edge case — channel conflict
If two partners serve overlapping audiences and parent sees different list prices, that's actually fine:
- First-touch partner attribution (via LINE Login `state={slug}`) locks the parent to the partner who brought them in.
- Each parent sees the price on their attribution partner's page. No cross-leak.
- If a parent deliberately visits both slugs, they'll see range-consistent pricing — the range exists specifically to avoid shock.

## Currency
- **Default:** TWD.
- **Partner override:** partners serving Japan later can set JPY. Partners serving HK / overseas diaspora can set HKD / USD.
- Currency is set on the partner's public page, not per book.

## Mark's perspective
- **Mark's fee is unchanged** — per-generation infra fee with tiers. Mark charges partners for generations regardless of what partners charge end users.
- List price is a **partner-facing commercial tool**, not Mark's revenue lever.
- Mark benefits indirectly: partners who can sustain healthy margins will generate more books, which drives Mark's per-generation revenue.
