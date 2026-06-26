# Fonctionnalités à implémenter — Jogga Store

Ce fichier liste tout ce qui est affiché comme "Bientôt disponible" ou en placeholder
dans l'application, pour ne pas oublier lors des prochaines sessions.

---

## 🟡 En attente d'infos / configuration

| Quoi | Où dans l'app | Ce qu'il faut |
|------|--------------|---------------|
| **Numéro WhatsApp** | Header menu, Service Client (page Compte) | Remplacer `+242 06 123 4567` par le vrai numéro |
| **Configuration Supabase** | `backend/.env` | URL pooler, DIRECT_URL, secret JWT — voir commentaires dans `backend/prisma.config.ts` |
| **Email de support** | Page Compte → Service Client | Ajouter un vrai email |
| **Taux de change USD/CDF** | `frontend/src/lib/CurrencyContext.tsx` ligne 26 | Actuellement figé à 2800 FC/$, à rendre dynamique ou à mettre à jour |

---

## 🔵 Fonctionnalités UI présentes mais non connectées

### Page Compte (`/account`)
- [ ] **Jogga Club** (Rejoindre, Cadeaux, Points) — interface prête, logique métier à créer
- [ ] **Coupons** — interface prête (affiche -30% et -5$), backend à créer
- [ ] **Points de fidélité** — icône présente, système à concevoir
- [ ] **Portefeuille** — icône présente, système à créer
- [ ] **Cartes Cadeaux** — icône présente, système à créer
- [ ] **Jogga Échange** — bouton présent, logique retour/échange à créer
- [ ] **Abonnements** — bouton présent, système à concevoir
- [ ] **Rappels produits** — bouton présent, notifications push à implémenter
- [ ] **Politique de retour** — texte statique à créer (page `/politique-retour`)
- [ ] **Liste d'envies / Wishlist** — onglet présent, actuellement vide (backend + frontend à connecter)

### Page Produit (`/[slug]`)
- [ ] **Bouton Favoris (♡)** — icône présente en haut à droite, non fonctionnel
- [ ] **Avis / Notes** — affiche 4.8 ⭐ en dur dans ProductGrid, système réel à créer

### Page Commandes (`/orders`)
- [ ] **Avis post-livraison** — statut DELIVERED → permettre de laisser un avis
- [ ] **Suivi en temps réel** — gateway WebSocket existe côté backend (`/delivery/...`), frontend non connecté
- [ ] **Détail commande** `/orders/:id` — page à créer avec timeline des statuts

---

## 🔴 Fonctionnalités manquantes (backend + frontend)

- [ ] **Modification du profil** — changer nom, téléphone, adresse (endpoint PATCH `/users/me` à créer)
- [ ] **Changement de mot de passe** — endpoint PATCH `/auth/change-password` à créer
- [ ] **Réinitialisation mot de passe** — flow "Mot de passe oublié" complet (email/SMS + token)
- [ ] **Notifications WhatsApp** — module backend existe (`/src/whatsapp/`), tokens/credentials vides
- [ ] **Email de confirmation** — après commande passée, envoyer un récap par email
- [ ] **Pagination** — `/products` retourne tous les 50 produits d'un coup, ajouter `?page=&limit=`
- [ ] **Système d'avis / reviews** — modèle Prisma à ajouter, API + UI à créer
- [ ] **Sous-catégories en base** — actuellement les sous-catégories sont des filtres frontend par mots-clés (voir `category/[slug]/page.tsx`), à migrer vers de vraies entrées Category avec parentId
- [ ] **Page 404 personnalisée** — affiche la page Next.js par défaut
- [ ] **Cookies JWT httpOnly** — sécurité : actuellement le token est dans un cookie standard, migrer vers httpOnly
- [ ] **Enfants / Âge** — catégorie Enfants mentionnée dans CategoryNav mais pas de produits correspondants en base

---

## ⚙️ Informations techniques à configurer en production

```
# backend/.env
DATABASE_URL=          ← URL pooler Supabase (port 6543)
DIRECT_URL=            ← URL directe Supabase (port 5432) pour les migrations
JWT_SECRET=            ← Clé secrète à changer (actuellement "change-me")
FRONTEND_URL=          ← URL de production du frontend

# frontend/.env.local
NEXT_PUBLIC_API_URL=   ← URL de l'API backend en production
```

---

## ⚙️ Configuration Cloudinary (obligatoire pour les uploads d'images)

```
# backend/.env — remplir après création du compte gratuit sur cloudinary.com
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

Endpoints disponibles une fois configuré :
- `POST /uploads/product-image` (Admin) → retourne URL Cloudinary
- `POST /uploads/avatar` (Connecté) → retourne URL avatar Cloudinary

---

## ✅ Fonctionnel

- [x] Auth (login, register, JWT)
- [x] Admin panel (produits, catégories, commandes)
- [x] Panier persistant (ajouter, modifier, supprimer)
- [x] Checkout avec simulation de commande
- [x] 50 produits avec images Unsplash, 6 catégories
- [x] Pages catégories avec sous-filtres
- [x] Historique "Vus récemment" (localStorage, 25 items)
- [x] Sélecteur de devise CDF / USD
- [x] Statuts commandes temps réel (admin → livreur)
- [x] Recherche produits
- [x] Timeline commandes avec suivi étape par étape
- [x] Modifier profil (nom, email, téléphone) — `PATCH /users/me`
- [x] Changer mot de passe — `PATCH /users/me/password`
- [x] Adresses de livraison (CRUD complet) — `GET/POST/PATCH/DELETE /addresses`
- [x] Avis produits (Reviews) — `GET/POST /products/:slug/reviews`
- [x] Liste de souhaits (Wishlist) depuis API — `GET/POST/DELETE /wishlist`
- [x] Bouton ♡ fonctionnel sur page produit (toggle wishlist)
- [x] Upload images Cloudinary — `POST /uploads/product-image` (prêt, à configurer)
