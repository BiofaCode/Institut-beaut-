# Institut Belle & Sereine — Site Web avec Réservation en Ligne

Site web complet pour un institut de beauté suisse, incluant une vitrine publique élégante, un système de réservation multi-étapes, et un dashboard admin complet.

## Stack Technique

- **Framework** : Next.js 16 (App Router, TypeScript)
- **Base de données** : PostgreSQL + Prisma ORM 7
- **Auth** : NextAuth.js v4 (credentials)
- **Emails** : Resend + React Email
- **Paiements** : Stripe (acompte)
- **UI** : Tailwind CSS + composants custom
- **Déploiement** : Vercel

## Fonctionnalités

### Site Public
- Page d'accueil avec hero, services phares, témoignages
- Catalogue complet des services avec prix CHF
- Galerie photos
- Page À propos avec l'équipe
- Page contact avec formulaire
- Pages légales (CGV, Politique de confidentialité nLPD)

### Système de Réservation
- Wizard multi-étapes : Service → Date & Heure → Informations → Confirmation
- Calcul dynamique des créneaux disponibles
- Confirmation par email (Resend)
- Rappels automatiques 24h avant le RDV

### Dashboard Admin (`/admin`)
- **Dashboard** : Stats du jour, planning, accès rapide
- **Réservations** : Liste complète, détails, changement de statut
- **Services** : CRUD complet
- **Catégories** : Gestion des catégories de services
- **Horaires** : Horaires hebdomadaires + jours de fermeture exceptionnels
- **Clients** : Base de données clientes avec historique
- **Équipe** : Gestion des praticiennes
- **Galerie** : Upload et gestion des photos
- **Statistiques** : CA, top services, taux de no-show
- **Paramètres** : Configuration générale, couleurs, réservations

## Installation

### 1. Prérequis
- Node.js 18+
- PostgreSQL

### 2. Installation des dépendances
```bash
npm install
```

### 3. Variables d'environnement
```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

### 4. Base de données
```bash
npm run db:push     # Créer les tables
npm run db:seed     # Données de démo
```

### 5. Démarrer le serveur de développement
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## Identifiants de démo

- **Email admin** : `admin@institutbeaute.ch`
- **Mot de passe** : `admin123!`
- **URL admin** : `/admin`

## Déploiement Vercel

1. Connecter le dépôt GitHub à Vercel
2. Configurer toutes les variables d'environnement dans Vercel
3. Activer la base PostgreSQL (Vercel Postgres ou Neon.tech)
4. Déployer

Le cron job `/api/cron/reminders` s'exécute chaque matin à 08:00 CET.

## Structure du Projet

```
src/
├── app/
│   ├── (public)/          # Site public
│   ├── (admin)/admin/     # Dashboard admin
│   ├── api/               # API Routes
│   └── connexion/         # Page de connexion
├── components/
│   ├── public/            # Header, Footer, BookingWizard
│   ├── admin/             # Sidebar
│   └── ui/                # Composants UI
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── prisma.ts          # Client Prisma
│   ├── availability.ts    # Logique créneaux
│   ├── stripe.ts          # Stripe
│   ├── resend.ts          # Emails
│   ├── utils.ts           # Utilitaires
│   └── validations.ts     # Schémas Zod
└── prisma/
    ├── schema.prisma      # Schéma DB
    ├── config.ts          # Config Prisma 7
    └── seed.ts            # Données de démo
```

## Spécificités Suisses

- Devise CHF (`CHF 85.00`)
- Timezone `Europe/Zurich`
- Format dates `dd.MM.yyyy` et `HH:mm`
- Mention TWINT accepté sur place
- Page LPD (nLPD 2023) conforme
- Langue française (Suisse romande)
