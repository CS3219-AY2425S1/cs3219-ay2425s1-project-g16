#!/bin/bash

# Migrate Services
migrate_services=("question" "user")
for service in "${migrate_services[@]}"; do
  cd "backend/$service"
  npm run db:migrate
  cd ../..
done

# Seed Services
seeded_services=("question" "user")
for service in "${seeded_services[@]}"; do
  cd "backend/$service"
  npm run db:seed
  cd ../..
done
