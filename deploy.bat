@echo off
echo ========================================
echo   DEPLOIEMENT VERS VERCEL
echo ========================================
echo.

echo [1/3] Ajout des fichiers...
git add .
if %errorlevel% neq 0 (
    echo ERREUR: git add
    pause
    exit /b 1
)
echo OK
echo.

echo [2/3] Commit...
git diff --staged --quiet
if %errorlevel% equ 0 (
    echo Rien a commiter.
) else (
    git commit -m "deploy: mise a jour plateforme"
    if %errorlevel% neq 0 (
        echo ERREUR: git commit
        pause
        exit /b 1
    )
    echo OK
)
echo.

echo [3/3] Push vers GitHub ^(Vercel deploye automatiquement^)...
git push origin main
if %errorlevel% neq 0 (
    echo ERREUR: git push. Connecte-toi a GitHub ^(token ou GitHub Desktop^).
    pause
    exit /b 1
)
echo OK - Vercel va deployer.
echo.
echo https://platform-thumbnail-pro.vercel.app
pause
