# Frontend

## Running with Docker (Standalone)

1. Run this command to build:
   ```sh
   docker build \
      --build-arg FRONTEND_PORT=3000 \
      -t frontend-app -f frontend.Dockerfile .
   ```
2. Run this command, from the root folder:

   ```sh
   make db-up
   ```

3. Run the necessary migrate and seed commands, if you haven't yet.

4. Run this command to expose the container:
   ```sh
   docker run -p 3000:3000 --env-file ./.env.docker frontend-app
   ```

## Running with Docker-Compose (Main config)

Edit the variables in the `.env.compose` file and run `make up` from the root folder.

Any startup instructions will be run from `entrypoint.sh` instead.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```
