@echo off
REM 🚀 Script de Déploiement Rapide - Platform Thumbnail Pro (Windows)
REM Usage: deploy.bat "Message de commit"

setlocal enabledelayedexpansion

echo 🚀 Déploiement en cours...
echo.

REM 1. Vérifier que nous sommes dans le bon répertoire
if not exist "package.json" (
    echo ❌ Erreur: package.json introuvable. Êtes-vous dans le bon répertoire ?
    exit /b 1
)

REM 2. Message de commit (argument ou par défaut)
set "COMMIT_MESSAGE=%~1"
if "!COMMIT_MESSAGE!"=="" set "COMMIT_MESSAGE=feat: mise à jour de la plateforme"

echo 📝 Message de commit: !COMMIT_MESSAGE!
echo.

REM 3. Vérifier le build avant de pousser
echo 🔨 Vérification du build...
call npm run build
if errorlevel 1 (
    echo ❌ Build échoué ! Corrigez les erreurs avant de déployer.
    exit /b 1
)
echo ✅ Build réussi !
echo.

REM 4. Ajouter tous les fichiers
echo 📦 Ajout des fichiers...
git add .

REM 5. Créer le commit
echo 💾 Création du commit...
git commit -m "!COMMIT_MESSAGE!"
if errorlevel 1 (
    echo ⚠️  Aucun changement à committer ou erreur lors du commit.
)

REM 6. Pousser sur GitHub
echo 📤 Push sur GitHub...
git push origin main
if errorlevel 1 (
    echo ❌ Erreur lors du push. Vérifiez votre connexion Git.
    exit /b 1
)

echo ✅ Push réussi !
echo.
echo 🎉 Déploiement déclenché sur Vercel !
echo ⏳ Attendez 1-3 minutes puis vérifiez:
echo    https://platform-thumbnail-pro.vercel.app
echo.
echo 📊 Suivez le déploiement sur:
echo    https://vercel.com/dashboard
echo.

endlocal
