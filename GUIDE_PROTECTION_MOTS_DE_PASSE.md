# 🔒 Guide : Activer la Protection contre les Mots de Passe Compromis

Ce guide vous explique comment activer la protection contre les mots de passe compromis dans Supabase.

## ⚠️ Warning Actuel

**"Leaked Password Protection Disabled"** - La protection contre les mots de passe compromis est actuellement désactivée.

## 🎯 Pourquoi Activer cette Protection ?

Cette fonctionnalité vérifie si les mots de passe des utilisateurs ont été compromis dans des fuites de données connues (comme Have I Been Pwned). C'est une mesure de sécurité importante pour protéger vos utilisateurs.

## 📝 Comment Activer la Protection

### ⚠️ IMPORTANT : Disponibilité selon le Plan

**Cette fonctionnalité n'est disponible que sur le Pro Plan et au-dessus.**

Si vous êtes sur le **plan gratuit (Free Plan)**, cette option ne sera pas visible dans votre interface. Vous devrez passer au plan Pro pour l'activer.

### Méthode 1 : Via le Dashboard Supabase (Recommandé)

**Emplacement exact :**

1. **Connectez-vous à votre projet Supabase**
   - Allez sur [supabase.com](https://supabase.com)
   - Sélectionnez votre projet

2. **Accédez aux paramètres Auth**
   - Dans le menu de gauche, cliquez sur **Authentication**
   - Cliquez sur l'onglet **Providers** (ou **Fournisseurs**)
   - Cliquez sur **Email** dans la liste des providers
   - OU allez directement à : `https://supabase.com/dashboard/project/[VOTRE_PROJECT_ID]/auth/providers?provider=Email`

3. **Trouvez l'option de protection**
   - Dans la page de configuration Email, cherchez la section **"Password Security"** ou **"Password Requirements"**
   - Vous devriez voir une option **"Enable leaked password protection"** ou **"Check for leaked passwords"**
   - Activez le toggle à côté de cette option
   - Sauvegardez les modifications

**Autres emplacements possibles :**
- **Authentication** → **Settings** → Section **"Password"** ou **"Security"**
- **Project Settings** → **Auth** → **Password Protection**

**Si vous ne trouvez toujours pas l'option :**
1. Vérifiez votre plan Supabase (doit être Pro ou supérieur)
2. L'option peut être dans **Authentication** → **Policies** → **Password Policies**
3. Essayez de chercher "leaked" ou "pwned" dans la barre de recherche du dashboard

### Méthode 2 : Via l'API Supabase (Avancé)

Si vous préférez utiliser l'API, vous pouvez activer cette fonctionnalité via les paramètres du projet :

```bash
# Via l'API Supabase (nécessite votre API key)
curl -X PATCH 'https://api.supabase.com/v1/projects/{project_id}/config/auth' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "enable_signup": true,
    "enable_leaked_password_protection": true
  }'
```

## ✅ Vérification

Après activation :

1. Allez dans **Issues** dans votre dashboard Supabase
2. Le warning **"Leaked Password Protection Disabled"** devrait disparaître
3. Les nouveaux utilisateurs qui s'inscrivent avec un mot de passe compromis recevront un avertissement

## 🔍 Comment ça Fonctionne

- Quand un utilisateur s'inscrit ou change son mot de passe, Supabase vérifie automatiquement si ce mot de passe a été compromis dans des fuites de données connues
- Si le mot de passe est compromis, l'utilisateur reçoit un avertissement et est invité à choisir un mot de passe plus sûr
- Cette vérification se fait de manière sécurisée via l'API Have I Been Pwned (sans envoyer le mot de passe complet)

## 📚 Ressources

- [Documentation Supabase - Password Protection](https://supabase.com/docs/guides/auth/password-protection)
- [Have I Been Pwned](https://haveibeenpwned.com/) - Base de données des mots de passe compromis

## ⚡ Notes Importantes

1. **Cette fonctionnalité ne peut pas être activée via SQL.** Elle doit être activée via le dashboard Supabase ou l'API de configuration du projet.

2. **Disponibilité selon le plan :** Cette fonctionnalité n'est disponible que sur le **Pro Plan et au-dessus**. Si vous êtes sur le plan gratuit, vous ne verrez pas cette option.

3. **Alternative si vous êtes sur le plan gratuit :** Vous pouvez ignorer ce warning si vous êtes sur le plan gratuit, ou considérer passer au plan Pro pour bénéficier de cette protection supplémentaire.

## 🔄 Vérifier votre Plan

Pour vérifier votre plan actuel :
1. Allez dans **Settings** → **Billing** (ou **Facturation**)
2. Vérifiez votre plan actuel
3. Si vous êtes sur Free Plan, vous devrez passer à Pro pour activer cette fonctionnalité
