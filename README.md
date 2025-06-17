"create:translations:json": "i18nexus pull -k quvfBy50Gbm7dE1n86LX6Q -p ./public/locales",
"create:translations:interface": "i18next-resources-for-ts interface -i ./public/locales/en-GB -o ./src/@types/i18next/resources.d.ts",
"update:locales": "pnpm create:translations:json && pnpm create:translations:interface",
"dev:mobile": "ngrok http 4201 --domain=internal-dogfish-enjoyed.ngrok-free.app",
"test:ui": "vitest --ui",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
