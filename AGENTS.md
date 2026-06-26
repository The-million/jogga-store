# AGENTS.md — Instructions pour IA travaillant sur Jogga Store

## Contexte
Jogga Store est une plateforme e-commerce B2C. Les articles sont importés de Chine et stockés physiquement au Congo (RDC/Congo-Brazzaville). La promesse : livraison express en moins de 24h. Ce n'est PAS du dropshipping.

## Stack
- **Backend** : NestJS (TypeScript) dans `backend/`
- **Frontend** : Next.js 14 App Router (TypeScript) dans `frontend/`
- **ORM** : Prisma avec PostgreSQL
- **Temps réel** : WebSockets via NestJS Gateway (Socket.IO)
- **Style** : Tailwind CSS

## Règles absolues

1. **TDD** : tests avant code. Utiliser Jest (backend) et Testing Library (frontend)
2. **Typage strict** : jamais de `any`. Toujours des interfaces/types TypeScript
3. **Conventional commits** : `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
4. **Modules NestJS** : respecter la structure Controller → Service → Repository
5. **DTOs validés** : utiliser `class-validator` sur tous les DTOs
6. **Stock** : ne jamais permettre une commande si `product.stockQuantity <= 0`
7. **WebSocket** : toute mise à jour de `DeliveryStatus` doit être broadcastée au client

## Base de données

Schéma dans `backend/prisma/schema.prisma`. Tables principales :
- `User` (rôles: CUSTOMER, ADMIN, DELIVERY)
- `Product` + `Category`
- `Cart` + `CartItem` (panier persistant 1:1 par user)
- `Order` + `OrderItem` (commande figée)
- `DeliveryStatus` (historique de suivi avec ETA)
- `Invoice`

## WebSocket — Delivery Gateway

Le `DeliveryGateway` (NestJS WebSocket Gateway) doit :
- Permettre à l'admin/livreur d'émettre `delivery:update` avec le nouveau statut
- Broadcast automatique au client concerné via room `order:{orderId}`
- Le client frontend écoute `delivery:statusChanged` et met à jour l'UI en direct

## WhatsApp API

Intégration via Meta WhatsApp Business API (Cloud API). Flows :
- À la commande : envoyer récapitulatif + facture PDF
- Au changement de statut : notifier le client
- Coût : environ 0.005-0.08 USD par message (selon région)

## Commandes utiles

```bash
# Backend
cd backend && npm run start:dev
cd backend && npm run test
cd backend && npx prisma migrate dev
cd backend && npx prisma studio

# Frontend
cd frontend && npm run dev
cd frontend && npm run build
```

## À faire (MVP)

- [x] Initialisation du projet
- [x] Schéma Prisma
- [ ] Module Auth (JWT + rôles)
- [ ] Module Products (CRUD + stock)
- [ ] Module Cart (panier persistant)
- [ ] Module Orders (checkout + décrément stock)
- [ ] Module Delivery (WebSocket + suivi statuts)
- [ ] Module WhatsApp (notifications + factures)
- [ ] Frontend catalogue + panier
- [ ] Frontend compte + historique
- [ ] Frontend suivi livraison
- [ ] Back-office admin
- [ ] Tests e2e
