# Matching Service

## Running with Docker (Standalone)

1. Run this command to build:
    ```sh
    docker build \
      -t match-express-local \
      --build-arg port=9004 \
      -f express.Dockerfile .
    ```
2. Run this command, from the root folder:
    ```sh
    make db-up
    ```

3. Run the necessary migrate and seed commands, if you haven't yet.

4. Run this command to expose the container:
    ```sh
    docker run -p 9004:9004 --env-file ./.env.docker match-express-local
    ```
5. To stop the process, use the Docker UI or CLI with `docker rm -f <container_id>` (The child process loop has issues terminating)

## Running with Docker-Compose (Main config)

Edit the variables in the `.env.compose` file and run `make up` from the root folder.

Any startup instructions will be run from `entrypoint.sh` instead.
