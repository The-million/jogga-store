# Jogga Store — E-commerce livraison 24h au Congo

## Vision
Plateforme e-commerce où le client congolais commande des articles importés de Chine, déjà en stock au Congo, livrés en moins de 24h.

## Stack Technique
| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | NestJS, TypeScript, Prisma ORM |
| Base de données | PostgreSQL |
| Temps réel | WebSockets (Socket.IO / NestJS Gateway) |
| Notifications | WhatsApp Business API |
| Hébergement | Backend: Railway/Render, Frontend: Vercel |

## Architecture

```
jogga-store/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/        # JWT auth + rôles
│   │   │   ├── users/       # Comptes clients/admin/livreur
│   │   │   ├── products/    # CRUD produits + catégories
│   │   │   ├── cart/        # Panier persistant
│   │   │   ├── orders/      # Commandes + checkout
│   │   │   ├── delivery/    # Suivi livraison WebSocket
│   │   │   ├── invoices/    # Factures PDF + WhatsApp
│   │   │   └── whatsapp/    # Intégration WhatsApp API
│   │   ├── common/          # Guards, interceptors, pipes
│   │   └── config/          # Configuration centralisée
│   └── prisma/
│       └── schema.prisma    # Modèle de données
│
├── frontend/                 # Next.js
│   └── src/
│       └── app/
│           ├── (shop)/       # Catalogue, produit, panier
│           ├── (account)/    # Compte, historique
│           ├── (admin)/      # Back-office admin
│           └── (tracking)/   # Suivi livraison client
│
├── ARCHITECTURE.md           # Ce fichier
├── STACK.md                  # Détails versions et dépendances
├── CONVENTIONS.md            # Règles de code
├── AGENTS.md                 # Instructions pour IA
├── STATUS.md                 # État actuel du projet
└── docs/
    └── adr/                  # Architecture Decision Records
```

## Flux principaux

### Commande
```
Client → Panier → Checkout → Order (CONFIRMED)
  → Stock décrémenté
  → WhatsApp: confirmation
  → Admin: notification
```

### Suivi livraison
```
Admin → CONFIRMED → PREPARING → IN_TRANSIT (+ETA) → DELIVERED
  ↓                    ↓              ↓
Client ← WebSocket ← WebSocket ← WebSocket
```

### Paiement
```
Option 1: Cash → payé à la livraison (DELIVERED → paidAt = now)
Option 2: Mobile Money → paiement en ligne avant expédition
```
