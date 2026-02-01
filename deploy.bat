@echo off
echo ========================================
echo   DEPLOIEMENT VERS VERCEL
echo ========================================
echo.

echo [1/3] Ajout des fichiers modifies...
git add .
if %errorlevel% neq 0 (
    echo ERREUR: Impossible d'ajouter les fichiers
    pause
    exit /b 1
)
echo OK - Fichiers ajoutes
echo.

echo [2/3] Creation du commit...
git commit -m "feat: ajout Instagram/Discord sur cards + badges avec fond colore"
if %errorlevel% neq 0 (
    echo ATTENTION: Aucun changement a commiter ou erreur
    echo Continuons quand meme...
)
echo OK - Commit cree
echo.

echo [3/3] Envoi vers GitHub (deploiement automatique Vercel)...
git push origin main
if %errorlevel% neq 0 (
    echo ERREUR: Impossible de pousser vers GitHub
    pause
    exit /b 1
)
echo OK - Deploiement en cours sur Vercel
echo.

echo ========================================
echo   DEPLOIEMENT LANCE AVEC SUCCES !
echo ========================================
echo.
echo Le site sera disponible dans 1-3 minutes sur:
echo https://platform-thumbnail-pro.vercel.app
echo.
echo Vous pouvez suivre le deploiement sur:
echo https://vercel.com/dashboard
echo.
pause
