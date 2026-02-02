# 🔒 Guide : Activer la Protection contre les Mots de Passe Compromis

Ce guide vous explique comment activer la protection contre les mots de passe compromis dans Supabase.

## ⚠️ Warning Actuel

**"Leaked Password Protection Disabled"** - La protection contre les mots de passe compromis est actuellement désactivée.

## 🎯 Pourquoi Activer cette Protection ?

Cette fonctionnalité vérifie si les mots de passe des utilisateurs ont été compromis dans des fuites de données connues (comme Have I Been Pwned). C'est une mesure de sécurité importante pour protéger vos utilisateurs.

## 📝 Comment Activer la Protection

### Méthode 1 : Via le Dashboard Supabase (Recommandé)

**Étape 1 : Accéder à Authentication**
1. Connectez-vous à votre projet Supabase sur [supabase.com](https://supabase.com)
2. Dans le menu de gauche, cliquez sur **Authentication** (icône de cadenas)

**Étape 2 : Ouvrir les Paramètres**
1. Une fois dans Authentication, cliquez sur l'onglet **Settings** (ou **Paramètres** en français)
2. Vous verrez plusieurs sections de configuration

**Étape 3 : Activer la Protection**
1. Faites défiler jusqu'à la section **"Password Protection"** ou **"Security"**
2. Cherchez l'option **"Enable leaked password protection"** ou **"Check for leaked passwords"**
3. Activez le toggle (bascule) à côté de cette option
4. Cliquez sur **Save** (ou **Sauvegarder**) en bas de la page

**Emplacement exact dans l'interface :**
- **Authentication** → **Settings** → Section **"Password Protection"** ou **"Security"**
- L'option peut aussi être dans la section **"Password Requirements"**

**Si vous ne trouvez pas l'option :**
- Vérifiez que vous êtes sur la bonne version de Supabase (certaines fonctionnalités peuvent varier selon la version)
- L'option peut être dans **Project Settings** → **Auth** → **Password Protection**

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

## ⚡ Note Importante

Cette fonctionnalité ne peut pas être activée via SQL. Elle doit être activée via le dashboard Supabase ou l'API de configuration du projet.
