#!/bin/bash

npm i

cd frontend
npm i
cd ..

for package in backend/*; do
  cd "$package"
  npm i 
  cd ../..
done

