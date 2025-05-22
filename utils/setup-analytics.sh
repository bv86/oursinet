#!/usr/bin/env zsh

# Script to set up Google Analytics for the Oursi.net website

# Color formatting
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 Setting up Google Analytics for Oursi.net${NC}\n"

# Check if .env file exists
ENV_FILE="./next/.env"
ENV_EXAMPLE_FILE="./next/.env.example"

if [[ ! -f "$ENV_FILE" && -f "$ENV_EXAMPLE_FILE" ]]; then
  echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
  cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"
elif [[ ! -f "$ENV_FILE" && ! -f "$ENV_EXAMPLE_FILE" ]]; then
  echo -e "${YELLOW}Creating new .env file...${NC}"
  touch "$ENV_FILE"
fi

# Prompt for GA Measurement ID
echo -e "${BLUE}Enter your Google Analytics 4 Measurement ID (format: G-XXXXXXXXXX):${NC}"
read GA_ID

# Check if GA ID follows the expected format
if [[ ! "$GA_ID" =~ ^G-[A-Z0-9]{10}$ ]]; then
  echo -e "${YELLOW}Warning: The ID format doesn't match the expected G-XXXXXXXXXX pattern. Using anyway.${NC}"
fi

# Check if GA_MEASUREMENT_ID already exists in .env
if grep -q "GA_MEASUREMENT_ID" "$ENV_FILE"; then
  # Replace existing value
  sed -i "s/GA_MEASUREMENT_ID=.*/NGA_MEASUREMENT_ID=$GA_ID/" "$ENV_FILE"
else
  # Add new value
  echo "GA_MEASUREMENT_ID=$GA_ID" >> "$ENV_FILE"
fi

echo -e "\n${GREEN}✅ Google Analytics Measurement ID has been set to: $GA_ID${NC}"
echo -e "${BLUE}The ID is stored in: $ENV_FILE${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Restart your Next.js development server (if running)"
echo -e "2. View analytics in your Google Analytics dashboard"
echo -e "3. See docs/analytics.md for more information on tracking features"
