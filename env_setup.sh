#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "===================================================="
echo " Installing dependencies for OpenCart Playwright    "
echo "===================================================="

# Install runtime dependencies
npm install dotenv
npm install @faker-js/faker
npm install luxon
npm install ajv csv-parse xlsx
npm install @axe-core/playwright
npm install allure-playwright
npm install mysql2

# Install dev dependencies
npm install -D @types/node

# Install Playwright browser binaries
echo "===================================================="
echo " Installing Playwright browsers                     "
echo "===================================================="
npx playwright install

echo "===================================================="
echo " Environment setup completed successfully!          "
echo "===================================================="

