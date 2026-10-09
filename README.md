<<<<<<< HEAD
# Criminal Record Digital Verification System (CRDVS)

A secure, enterprise-grade web application for managing and verifying criminal records for Gweru Magistrates' Court.

## ðŸš€ Features

- **Identity Verification**: Search and verify individuals by National ID, name, or date of birth
- **Criminal Records Management**: Create, view, update criminal records with full audit trails
- **Risk Assessment**: Automatic risk level calculation and repeat offender detection
- **Verification Reports**: Generate tamper-evident verification reports with SHA-256 hashing
- **Duplicate Detection**: AI-powered fuzzy matching to identify potential duplicate records
- **Role-Based Access**: Granular permissions for administrators, police, court, and prison officers
- **Audit Logging**: Complete immutable audit trail of all system activities
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## ðŸ› ï¸ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (recommended)

## ðŸ“‹ Prerequisites

- Node.js 20+ 
- npm or yarn
- Supabase account (or local Supabase instance)

## ðŸƒ Quick Start

### 1. Clone and Install

```bash
cd crdvs
npm install
```

### 2. Configure Environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Database

Run the migrations in order:

```bash
# Using Supabase CLI
supabase db push

# Or manually run in Supabase SQL editor:
# 1. supabase/migrations/001_initial_schema.sql
# 2. supabase/migrations/002_seed_data.sql (optional test data)
# 3. supabase/migrations/003_auth_trigger.sql
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Login

Default test credentials (if seed data loaded):
- Email: `admin@magistrates.gov.zw`
- Password: `Admin@2026`

## ðŸ“ Project Structure

```
crdvs/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ app/                    # Next.js App Router pages
â”‚   â”‚   â”œâ”€â”€ login/              # Authentication
â”‚   â”‚   â”œâ”€â”€ dashboard/          # Main application
â”‚   â”‚   â”‚   â”œâ”€â”€ records/        # Criminal records
â”‚   â”‚   â”‚   â”œâ”€â”€ verify/         # Identity verification
â”‚   â”‚   â”‚   â”œâ”€â”€ reports/        # Verification reports
â”‚   â”‚   â”‚   â””â”€â”€ ...
â”‚   â”‚   â””â”€â”€ api/                # API routes
â”‚   â”œâ”€â”€ components/             # React components
â”‚   â”‚   â”œâ”€â”€ auth/               # Authentication components
â”‚   â”‚   â”œâ”€â”€ layout/             # Layout components
â”‚   â”‚   â”œâ”€â”€ dashboard/          # Dashboard components
â”‚   â”‚   â”œâ”€â”€ records/            # Records components
â”‚   â”‚   â””â”€â”€ verification/       # Verification components
â”‚   â”œâ”€â”€ lib/                    # Utility libraries
â”‚   â”‚   â”œâ”€â”€ supabase/           # Supabase clients
â”‚   â”‚   â”œâ”€â”€ auth/               # Auth helpers
â”‚   â”‚   â””â”€â”€ utils/              # Utility functions
â”‚   â”œâ”€â”€ types/                  # TypeScript types
â”‚   â”œâ”€â”€ actions/                # Server actions
â”‚   â””â”€â”€ middleware.ts           # Route protection
â”œâ”€â”€ supabase/
â”‚   â””â”€â”€ migrations/             # Database migrations
â””â”€â”€ public/                     # Static assets
```

## ðŸ” Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Session-based Auth**: Secure authentication with Supabase
- **Audit Logging**: Immutable logs of all sensitive operations
- **Password Requirements**: Strong password enforcement
- **Role-based Permissions**: Granular access control per user role
- **Tamper-evident Reports**: SHA-256 hashes for verification reports

## ðŸ‘¥ User Roles

| Role | Permissions |
|------|-------------|
| **Administrator** | Full system access, user management, audit logs |
| **Police Officer** | Create/update records, verify identities, generate reports |
| **Court Officer** | View records, manage convictions, verify identities |
| **Prison Officer** | View records, verify identities, read-only access |

## ðŸ“Š Key Workflows

### Identity Verification
1. Navigate to "Verify Identity"
2. Enter National ID, name, or date of birth
3. System searches for exact and fuzzy matches
4. View results with risk levels and conviction counts
5. Generate official verification report if needed

### Criminal Record Management
1. Navigate to "Criminal Records"
2. Search/filter existing records
3. Create new record with personal details
4. Add convictions and case details
5. System auto-calculates risk level and repeat offender status

## ðŸš¢ Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ðŸ“š Documentation

- [PHASE_3_COMPLETE.md](./PHASE_3_COMPLETE.md) - Detailed Phase 3 implementation guide
- [AGENTS.md](./AGENTS.md) - AI agent development notes
- [Database Schema](./supabase/migrations/) - SQL migrations and schema

## ðŸ§ª Testing

```bash
# Run development server for manual testing
npm run dev

# Build production bundle
npm run build

# Run production server locally
npm start
```

## ðŸ“ License

This is a government system for authorized use only. All activities are monitored and logged.

## ðŸ¤ Support

For system access or technical support, contact your system administrator.

---

**Gweru Magistrates' Court**  
Criminal Record Digital Verification System v1.0.0

