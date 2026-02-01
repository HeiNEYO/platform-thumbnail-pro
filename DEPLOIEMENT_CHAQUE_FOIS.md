# Déploiement à chaque modification (éviter la page noire)

**L'écran noir vient souvent du fait que le site en ligne n'a pas été redéployé après tes changements.** Le navigateur affiche alors une **ancienne version** du site (celle qui posait problème).

---

## À chaque fois que tu modifies le code

### 1. Pousser le code sur GitHub

Dans ton projet (terminal ou VS Code) :

```bash
git add .
git commit -m "ton message"
git push origin main
```

(Remplace `main` par le nom de ta branche si besoin.)

Si **Vercel est connecté** à ton repo GitHub, un **nouveau déploiement se lance automatiquement** après le push.  
Attends la fin du déploiement : **Vercel** → **Deployments** → statut **« Ready »**.

### 2. Si tu n'as pas poussé sur Git (ou si le déploiement auto n'a pas eu lieu)

- Va sur **Vercel** → ton projet → **Deployments**.
- Clique sur les **…** (trois points) du **dernier déploiement** → **Redeploy**.
- Choisis « Use existing Build Cache » ou « Redeploy » selon ton besoin.

### 3. Forcer le rafraîchissement côté navigateur

Après un redeploy, le navigateur peut encore afficher l’ancienne version (cache).  
Fais **Ctrl+Shift+R** (ou **Cmd+Shift+R** sur Mac) sur l’URL de ton site pour **vider le cache** et charger la nouvelle version.

---

## En résumé

**Modif code → push GitHub → Vercel redéploie → rafraîchir la page (Ctrl+Shift+R).**

Sans redeploy, tu continues à voir l’ancienne version (et donc potentiellement la page noire).
