# Configuration du reset password (mot de passe oublié)

## Problème : 404 DEPLOYMENT_NOT_FOUND

Si le lien dans l'email de réinitialisation renvoie une erreur Vercel "DEPLOYMENT_NOT_FOUND", c'est que l'URL de redirection pointe vers un déploiement qui n'existe plus.

---

## Solution : 3 étapes

### 1. Vercel – Variable d'environnement

**Vercel** → ton projet → **Settings** → **Environment Variables**

Ajoute :
- **Name :** `NEXT_PUBLIC_SITE_URL`
- **Value :** `https://platform-thumbnail-pro.vercel.app`
- **Environments :** Production (et Preview si tu veux)

Puis **redéploie** le projet (Deployments → Redeploy sur le dernier).

---

### 2. Supabase – URL Configuration

**Supabase** → ton projet → **Authentication** → **URL Configuration**

| Paramètre | Valeur |
|-----------|--------|
| **Site URL** | `https://platform-thumbnail-pro.vercel.app` |
| **Redirect URLs** | `https://platform-thumbnail-pro.vercel.app/**` |
| | `https://platform-thumbnail-pro.vercel.app/forgot-password` |
| | `http://localhost:3000/**` |

Clique sur **Save**.

---

### 3. Supabase – Email template (optionnel)

**Supabase** → **Authentication** → **Email Templates** → **Reset Password**

Vérifie que le lien utilise `{{ .ConfirmationURL }}` (c'est le cas par défaut).  
Si tu as modifié le template, assure-toi de ne pas utiliser une URL codée en dur.

---

## Test

1. Va sur https://platform-thumbnail-pro.vercel.app/forgot-password
2. Entre ton email
3. Clique sur le lien reçu
4. Tu dois arriver sur la page de définition du mot de passe
