# StackTogether

> Your circle is your greatest investment.

A community investment club platform where friend groups pool money, vote on investment decisions, and build wealth together.

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with waitlist |
| `/login` | Sign in / sign up |
| `/onboarding` | 4-step onboarding flow |
| `/dashboard` | Main club dashboard |
| `/portfolio` | Full holdings + allocation |
| `/votes` | Active votes + proposal creation |
| `/members` | Club members + contribution status |
| `/contribution` | Personal payment history + Stripe |

## Tech Stack

- React + Vite
- React Router v6
- Lucide React icons
- Google Fonts (DM Sans + Fraunces)

## Getting Started

```bash
npm install
npm run dev
```

## Deploying to GitHub

```bash
# 1. Create a new repo on github.com named "stacktogether"
# 2. Run these commands:
git remote add origin https://github.com/YOUR_USERNAME/stacktogether.git
git branch -M main
git push -u origin main
```

## Next Steps

- [ ] Connect Supabase for auth + database
- [ ] Add Stripe for monthly contributions
- [ ] Integrate Yahoo Finance API for live stock prices
- [ ] Push notifications for vote deadlines
- [ ] Mobile responsive polish

## Design System

- Primary: `#1D9E75`
- Font display: Fraunces
- Font body: DM Sans
- All flat UI — no gradients or shadows
