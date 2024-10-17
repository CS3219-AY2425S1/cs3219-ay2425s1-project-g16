#!/bin/sh

npm run db:seed:prod

rm -rf src tsconfig.json

npm uninstall tsx

npm run start
