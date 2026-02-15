# Création des comptes membres depuis le CSV

## Prérequis

1. **Variables d'environnement** dans `.env.local` :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (clé **service_role** dans Supabase → Settings → API)

2. **Supabase Auth** : Ajouter l'URL de redirection pour le mot de passe oublié  
   Supabase → Authentication → URL Configuration → Redirect URLs :  
   `https://votre-site.vercel.app/forgot-password` (et `http://localhost:3000/forgot-password` en dev)

## Utilisation

```bash
# Avec le chemin du fichier CSV
npm run create-members "C:\Users\Admin\Downloads\2848074e77cfcada5a28a729b8ef1c12dd9eb27.csv"

# Ou en plaçant le fichier à la racine du projet sous le nom membres.csv
npm run create-members membres.csv
```

## Format du CSV

Le script attend un CSV avec les colonnes : **Email**, **Prénom**, **Nom de famille**.

## Après la création

Les comptes sont créés avec un mot de passe temporaire. Les membres doivent :

1. Aller sur la page de **connexion**
2. Cliquer sur **« Mot de passe oublié ? »**
3. Entrer leur **email**
4. Cliquer sur le lien reçu par email
5. Définir leur **nouveau mot de passe**
