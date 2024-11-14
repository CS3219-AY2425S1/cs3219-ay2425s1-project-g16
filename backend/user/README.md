# User Service

## Running with Docker (Standalone)

1. Run this command to build:
    ```sh
    docker build \
      -t user-express-local \
      --build-arg port=9001 \
      -f express.Dockerfile .
    ```
2. Run this command, from the root folder:
    ```sh
    make db-up
    ```

3. Run the necessary migrate and seed commands, if you haven't yet.

4. Run this command to expose the container:
    ```sh
    docker run -p 9001:9001 --env-file ./.env.docker user-express-local
    ```

## Running with Docker-Compose (Main config)

Edit the variables in the `.env.compose` file and run `make up` from the root folder.

Any startup instructions will be run from `entrypoint.sh` instead.
