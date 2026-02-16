# Configuration Stripe

## 1. Créer un Payment Link Stripe

1. Va sur [Stripe Dashboard](https://dashboard.stripe.com) → **Payment links** → **New**
2. Choisis ton produit (ou crée-en un : Products → Add product)
3. Configure le prix, puis **Create link**
4. Copie l'**URL du lien** (ex. `https://buy.stripe.com/xxx`)

## 2. Variables d'environnement

Dans `.env.local` et **Vercel** (Settings → Environment Variables) :

```
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/xxx   # Ton lien Stripe
STRIPE_SECRET_KEY=sk_live_...                                # Stripe → Developers → API keys
STRIPE_WEBHOOK_SECRET=whsec_...                              # Voir étape 3
```

## 3. Webhook Stripe (pour créer le compte après paiement)

1. Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
2. **URL** : `https://platform-thumbnail-pro.vercel.app/api/stripe/webhook`
3. **Événements** : `checkout.session.completed`
4. Copie le **Signing secret** (`whsec_...`) dans `STRIPE_WEBHOOK_SECRET`

## 4. Success URL dans ton Payment Link

Dans Stripe → Payment links → ton lien → **After payment** :
- Success URL : `https://platform-thumbnail-pro.vercel.app/login?payment=success`

## 5. Test en local

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Utilise le `whsec_...` affiché pour `STRIPE_WEBHOOK_SECRET` en local.

## Flux

1. Client paie via ton lien Stripe (bouton sur ta landing, etc.)
2. Paiement validé → webhook crée le compte Supabase
3. Redirection vers `/login?payment=success` (configurée dans Stripe → Payment link → After payment)
4. Client reçoit l'email « Mot de passe oublié », définit son mot de passe, se connecte
