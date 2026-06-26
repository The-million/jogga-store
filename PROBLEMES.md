# PROBLEMES.md — État du projet Jogga Store

Dernière mise à jour : 2026-06-27

---

## 🔴 CRITIQUE (bloquant)

| # | Problème | Fichier(s) concerné(s) | Statut |
|---|---|---|---|
| 1 | **Base de données vide** — aucun seed, l'accueil est vide au premier lancement | `prisma/seed.ts` | ✅ Résolu (seed créé) |
| 2 | **`comparePrice` absent du schéma Prisma** — la réduction affichée côté frontend ne fonctionne pas | `prisma/schema.prisma` | ✅ Résolu |
| 3 | **`imageUrl` non mappé** — le schéma stocke `imageUrls[]` (JSON), le frontend attend `imageUrl` (string) — aucune image ne s'affiche | `products.service.ts` | ✅ Résolu (transform dans service) |
| 4 | **`FRONTEND_URL` absent du `.env` backend** — CORS bloque en production | `backend/.env` | ✅ Résolu |
| 5 | **Supabase non configuré** — voir section dédiée ci-dessous | `prisma/schema.prisma` + `.env` | ✅ Prêt (attente credentials) |

---

## 🟠 IMPORTANT (fonctionnalités visibles mais cassées)

| # | Problème | Fichier(s) concerné(s) | Statut |
|---|---|---|---|
| 6 | **Page `/search` hardcodée** — 8 faux produits en dur, aucun appel API | `app/search/page.tsx` | ✅ Résolu |
| 7 | **Pages `/category/[slug]` hardcodées** — données inventées par catégorie | `app/category/[slug]/page.tsx` | ✅ Résolu |
| 8 | **`FlashSale` hardcodé** — faux produits + timer qui repart à 5:23:45 au reload | `components/FlashSale.tsx` | ⏳ À faire |
| 9 | **`CategoryNav` ne filtre pas les vraies catégories** — liens statiques vers des pages hardcodées | `components/CategoryNav.tsx` | ⏳ À faire |
| 10 | **Aucun panel Admin** — impossible d'ajouter des produits, gérer les commandes | `app/admin/` | ✅ Résolu (admin créé) |
| 11 | **Delivery tracking WebSocket** — le gateway Socket.IO existe backend mais le frontend ne s'y connecte jamais | `app/orders/[id]/page.tsx` | ⏳ À faire |
| 12 | **Wishlist non connectée** — l'onglet "Liste d'envies" affiche toujours vide | `app/account/page.tsx` | ⏳ À faire |

---

## 🟡 FONCTIONNALITÉS MANQUANTES

| # | Problème | Statut |
|---|---|---|
| 13 | **Page détail commande** `/orders/:id` avec suivi en temps réel | ⏳ À faire |
| 14 | **Édition du profil** (nom, téléphone, adresse) | ⏳ À faire |
| 15 | **Mot de passe oublié / reset** | ⏳ À faire |
| 16 | **Notifications WhatsApp** — module backend existe, tokens vides dans `.env` | ⏳ À faire (nécessite compte Meta) |
| 17 | **Pagination** — `GET /products` retourne tout sans limite | ⏳ À faire |
| 18 | **Avis et notes** — "4.8" hardcodé sur toutes les cartes | ⏳ À faire |
| 19 | **Confirmation email** après commande | ⏳ À faire |
| 20 | **Page 404 personnalisée** | ⏳ À faire |

---

## 🔵 SÉCURITÉ

| # | Problème | Risque | Statut |
|---|---|---|---|
| 21 | **Cookie JWT lisible par JS** (pas `httpOnly`) | XSS peut voler le token | ⏳ À faire (nécessite refonte auth) |
| 22 | **`JWT_SECRET` faible** — "dev-secret-change-in-production" dans `.env` | Tokens forgeable en prod | ⚠️ Changer avant mise en prod |
| 23 | **HTTPS non enforced** | Man-in-the-middle | ⏳ Géré par l'hébergeur (Vercel/Railway) |

---

## ☁️ CONFIGURATION SUPABASE

### Étape 1 — Créer le projet
1. Aller sur [supabase.com](https://supabase.com) → "New project"
2. Choisir une région proche (EU West pour le Congo)
3. Définir un mot de passe fort pour la DB

### Étape 2 — Récupérer les URLs
Dans Supabase → **Project Settings → Database → Connection string** :
- **Transaction pooler** (port 6543) → c'est la `DATABASE_URL`
- **Direct connection** (port 5432) → c'est la `DIRECT_URL`

### Étape 3 — Mettre à jour `backend/.env`
```env
# Remplacer [PROJECT-REF] et [PASSWORD] par vos valeurs
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

### Étape 4 — Appliquer le schéma + seed
```bash
cd backend
npx prisma migrate deploy    # applique les migrations
npx prisma db seed           # insère les données initiales (Unsplash)
```

### Images — Supabase Storage (quand prêt)
1. Dans Supabase → Storage → "New bucket" → `product-images` (public)
2. Dans le panel admin Jogga → chaque image a un champ URL
3. Uploader une image dans Supabase Storage → copier l'URL publique → coller dans le champ

---

## ✅ CE QUI FONCTIONNE BOUT EN BOUT

- Inscription / Connexion / Déconnexion (JWT + cookie)
- Protection des routes (middleware Next.js)
- Catalogue produits depuis la vraie DB
- Page produit avec stock réel
- Panier complet (add / update qty / remove)
- Checkout → vraie commande en base (transaction Prisma)
- Mes commandes avec statuts réels
- Badge panier en temps réel
- **Panel Admin complet** : produits, catégories, commandes
- Sécurité backend : CORS restreint, Helmet, rate limiting, ownership check
