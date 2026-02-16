# Configuration Stripe

## 1. Créer un produit Stripe

1. Va sur [Stripe Dashboard](https://dashboard.stripe.com) → **Products** → **Add product**
2. Nom : "Formation Thumbnail Pro"
3. Prix : définit le montant (ex. 97 €)
4. Copie l’**ID du prix** (`price_xxx`)

## 2. Variables d’environnement

Dans `.env.local` :

```
STRIPE_SECRET_KEY=sk_live_...          # Stripe → Developers → API keys
STRIPE_WEBHOOK_SECRET=whsec_...       # Voir étape 4
STRIPE_PRICE_ID=price_...             # ID du prix créé
```

## 3. Webhook Stripe

1. Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
2. **URL** : `https://platform-thumbnail-pro.vercel.app/api/stripe/webhook` (ou ton domaine)
3. **Événements** : `checkout.session.completed`
4. Copie le **Signing secret** (`whsec_...`) dans `STRIPE_WEBHOOK_SECRET`

## 4. Test en local

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Utilise le `whsec_...` affiché dans la sortie pour `STRIPE_WEBHOOK_SECRET` en local.

## Flux

1. Client va sur `/acheter` → saisit email + nom
2. Redirection vers Stripe Checkout
3. Paiement validé → webhook crée le compte Supabase (email + nom)
4. Redirection vers `/login?payment=success`
5. Message : « Utilisez Mot de passe oublié pour définir votre mot de passe »
6. Client reçoit l’email de reset, définit son mot de passe, se connecte
