#!/bin/bash

# 🚀 Script de Déploiement Rapide - Platform Thumbnail Pro
# Usage: ./deploy.sh "Message de commit"

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Déploiement en cours...${NC}\n"

# 1. Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur: package.json introuvable. Êtes-vous dans le bon répertoire ?${NC}"
    exit 1
fi

# 2. Message de commit (argument ou par défaut)
COMMIT_MESSAGE=${1:-"feat: mise à jour de la plateforme"}

echo -e "${YELLOW}📝 Message de commit: ${COMMIT_MESSAGE}${NC}\n"

# 3. Vérifier le build avant de pousser
echo -e "${YELLOW}🔨 Vérification du build...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build réussi !${NC}\n"
else
    echo -e "${RED}❌ Build échoué ! Corrigez les erreurs avant de déployer.${NC}"
    exit 1
fi

# 4. Vérifier les changements Git
echo -e "${YELLOW}📋 Vérification des changements...${NC}"
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Aucun changement détecté.${NC}"
    read -p "Voulez-vous quand même pousser ? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}❌ Déploiement annulé.${NC}"
        exit 0
    fi
fi

# 5. Ajouter tous les fichiers
echo -e "${YELLOW}📦 Ajout des fichiers...${NC}"
git add .

# 6. Créer le commit
echo -e "${YELLOW}💾 Création du commit...${NC}"
git commit -m "$COMMIT_MESSAGE" || {
    echo -e "${YELLOW}⚠️  Aucun changement à committer.${NC}"
}

# 7. Pousser sur GitHub
echo -e "${YELLOW}📤 Push sur GitHub...${NC}"
if git push origin main; then
    echo -e "${GREEN}✅ Push réussi !${NC}\n"
    echo -e "${GREEN}🎉 Déploiement déclenché sur Vercel !${NC}"
    echo -e "${YELLOW}⏳ Attendez 1-3 minutes puis vérifiez:${NC}"
    echo -e "   ${GREEN}https://platform-thumbnail-pro.vercel.app${NC}\n"
    echo -e "${YELLOW}📊 Suivez le déploiement sur:${NC}"
    echo -e "   ${GREEN}https://vercel.com/dashboard${NC}\n"
else
    echo -e "${RED}❌ Erreur lors du push. Vérifiez votre connexion Git.${NC}"
    exit 1
fi
