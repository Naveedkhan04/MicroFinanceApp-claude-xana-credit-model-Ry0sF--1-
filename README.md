# XANA Micro Credit

A mobile-first microfinance app for a hybrid lending platform operating in
Somaliland. **Lenders** are global crypto users who deposit USDT and earn yield;
**borrowers** are local mobile-money users who receive small USD loans into
their Zaad wallet and repay through mobile money.

This is not a pure DeFi product — it's a hybrid fintech with a centralized
credit/risk engine, internal pooled liquidity, crypto-funded lender side, and
mobile-money borrower side.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** with a custom dark-gold design system extracted from the
  UNITY GOLD reference screens (black canvas + champagne-gold accents, rounded
  2xl cards, pill-shaped inputs, gradient gold CTAs)
- **HeroUI** (next-gen NextUI) theme integration
- **Framer Motion** for screen/page transitions
- **react-router-dom** for navigation
- Mock services with artificial latency & failure simulation

## Design system

Design tokens live in `tailwind.config.ts` and `src/index.css`:

| Token             | Value                                 |
| ----------------- | ------------------------------------- |
| `bg.DEFAULT`      | `#0A0704` (deep brown-black)          |
| `surface`         | `#18120A`                             |
| `gold.DEFAULT`    | `#F5C354` (champagne)                 |
| `gold.bright`     | `#FFD777`                             |
| `gold.dim`        | `#B2873A` (antique)                   |
| `border.gold`     | `rgba(245,195,84,.25)`                |
| `font.sans`       | **Inter** + Noto Sans JP fallback     |
| Button gradient   | `#E9B955 → #C18A2B`                   |
| Card radius       | `rounded-2xl` (1.25rem)               |
| Nav radius        | `rounded-[28px]`                      |

Typography uses **Inter** for Latin and **Noto Sans JP** for Japanese, loaded
from Google Fonts. The `html[lang]` attribute is updated reactively so Japanese
layouts pick up the JP stack automatically.

## Product structure

### Lender app (`/lender`)

Bottom nav: **Home · Earn · Portfolio · History · Profile**

- `LenderHome` — overview, balance, stats, deposit/withdraw, auto-reinvest toggle
- `Deposit` — amount, pool selection (Stable / Balanced / High Yield), confirmation modal
- `Earn` — daily / monthly / lifetime earnings, APY trend, utilization, reserve coverage
- `Portfolio` — principal, allocation by type/duration/performance, at-risk
- `Withdraw` — amount, instant vs standard, fee, low-liquidity warning
- `History` — tabs for deposits, withdrawals, earnings, adjustments
- `Profile` — wallet, email, KYC, statements, notifications, security, language

### Borrower app (`/borrower`)

Bottom nav: **Home · Borrow · Repay · History · Profile**

- `Welcome` — brand + phone-number entry + language switcher
- `OTPLogin` — phone entry, 6-digit OTP, resend timer
- `Onboarding` — full name, ID, DOB, city, Zaad number
- `BorrowerHome` — credit limit, trust score, eligibility chip, active loan summary
- `BorrowAmount` → `SelectDuration` → `LoanReview` → `Processing` (4-step flow)
- `ActiveLoan` — borrowed, due, remaining, progress, breakdown
- `Repay` — full or partial, Zaad method, success receipt
- `TrustScore` — score, streak, next unlock, tips
- `History` — tabs for loans, repayments, fees, support
- `Profile` — personal info, KYC, Zaad, language, support, terms, logout

## Business logic reflected

- Lender deposits USDT into a pooled liquidity layer; funds are deployed
  internally into borrower loans; lender sees APY, utilization, reserve coverage.
- Borrower requests a small loan; a risk engine scores the borrower; if
  approved, funds disburse to the linked Zaad wallet; borrower repays via Zaad;
  successful repayment raises the trust score and unlocks larger limits.

### MVP risk rules (see `src/data/services.ts`)

- First loan: $5-$10
- Early max loan: $20 (raises to $30 at trust 80+)
- One active loan at a time
- Short duration only (7 / 14 / 21 / 30 days)
- Trust score: +3 on successful repayment, decrease on late payment
- Fraud / blocked states return `decline` / `review` / `blocked`

## States covered

- First-time lender (balance == 0) → prompt to deposit
- Active lender with earnings → full dashboard
- Low-liquidity withdrawal warning
- Borrower with no loan → CTA to borrow
- Borrower eligible for first loan
- Borrower with active loan + progress bar
- Repayment success (full + partial variants)
- Disbursement failure (simulated ~8% of the time)
- Invalid amount states (disabled CTA + explanatory helper)
- Low trust / ineligible / review / blocked eligibility chips
- Manual review required screen

## Localization

Translation dictionaries: `src/i18n/en.ts` and `src/i18n/ja.ts` (fully typed via
`KeyPath<Dict>`). The `I18nProvider` exposes `{ lang, setLang, t }`, persists
the user's choice in `localStorage`, and updates `<html lang>`. The
`LanguageSwitcher` component is visible on Welcome, Mode Select, and both
Profile screens.

Japanese strings are fintech-appropriate and tested to not break the pill
inputs and card layouts (longer strings wrap naturally in flex rows).

## Data models

Defined in `src/types/index.ts`:

`User` · `LenderProfile` · `BorrowerProfile` · `Pool` · `PoolPosition` ·
`LenderOverview` · `Loan` · `Repayment` · `RiskScore` · `Transaction` ·
`Notification` · `BorrowDraft`

Mock state lives in `src/data/mockData.ts` and is mutated through the service
layer in `src/data/services.ts` so UI interactions feel real within a session.

## Running

```sh
npm install
npm run dev
```

Open http://localhost:5173 — you'll land on the **Mode Select** screen.
Choose Lender to enter instantly, or Borrower to go through the OTP flow (use
any 6-digit code to pass verification).

## Build

```sh
npm run build
npm run preview
```

## Folder layout

```
src/
├── components/
│   ├── layout/        PhoneFrame, TopBar, StatusBar, BottomNav, nav variants
│   └── ui/            Card, PrimaryButton, AmountInput, Chip, Tabs, StatusChip,
│                      Sparkline, AllocationBars, ProgressBar, BalanceCard,
│                      StatCard, TokenIcon, LanguageSwitcher, ToastViewport,
│                      Skeleton, EmptyState
├── context/           AppContext (mode / auth / toasts)
├── data/              mockData, services (auth, lenderApi, borrowerApi)
├── i18n/              en, ja, I18nProvider + hooks + formatters
├── screens/
│   ├── lender/        Home, Deposit, Earn, Portfolio, Withdraw, History, Profile
│   ├── borrower/      Welcome, OTP, Onboarding, Home, BorrowAmount,
│                      SelectDuration, LoanReview, Processing, ActiveLoan,
│                      Repay, TrustScore, History, Profile, BorrowFlow context
│   └── ModeSelect
├── types/             Domain types
├── utils/             clsx
├── App.tsx            Router + providers + guards + page transitions
└── main.tsx           Entry
```
