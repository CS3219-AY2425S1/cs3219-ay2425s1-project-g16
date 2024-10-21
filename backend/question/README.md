# Template Service

This directory contains the code for the Template
Service.


# Questions Service

## Running with Docker (Standalone)

1. Run this command to build:
    ```sh
    docker build \
      -t question-express-local \
      --build-arg port=9002 \
      -f express.Dockerfile .
    ```
2. Run this command, from the root folder:
    ```sh
    make db-up
    ```

3. Run the necessary migrate and seed commands, if you haven't yet.

4. Run this command to expose the container:
    ```sh
    docker run -p 9002:9002 --env-file ./.env.docker question-express-local
    ```

## Running with Docker-Compose (Main config)

Edit the variables in the `.env.compose` file and run `make up` from the root folder.

Any startup instructions will be run from `entrypoint.sh` instead.





## Database

We use:

- PostgreSQL 16 for the database. To run it, we use:
  - Docker to run the database, as well as inject any user-defined
    configurations or SQL files into the Docker image.
  - Docker-Compose to run the database, as well as any other
    services this API microservice may depend on.
- [**Drizzle**](https://orm.drizzle.team/) for the ORM.

Follow the instructions below for the setup, as well as to learn how to work with the database.

### Setup

1. Install Docker Desktop on your device. Launch it.

2. To verify that it is launched and installed correctly, run the 
  following in your terminal:

    ```bash
    docker --version
    ```

    If the command does not error, and outputs a version, proceed to
    the next step.

3. Inspect the `docker-compose.yml` file. It
  should look like this:

    ```yml
    services:
      # ...
      postgres:
        # ...
        volumes:
        - "template-db-docker:/data/template-db"
        #  - ./init.sql:/docker-entrypoint-initdb.d/init.sql
        ports:
        - "5431:5432"
        restart: unless-stopped

    volumes:
      template-db-docker:
        external: true
    ```

    We observe that this Database relies on a 
    Docker Volume. Replace all instances of 
    `template-db-docker` with your desired 
    volume name.

4. Then, create the Docker Volume with
  the following command:

    ```bash
    # in this case, the command is
    # docker volume create template-db-docker
    docker volume create <volume-name>
    ```
5. Finally, create the Database Container:

    ```bash
    docker-compose up -d
    ```

6. To bring it down, run this command:

    ```bash
    docker-compose down
    ```

### Schema

We maintain the schema in the `src/lib/db/schema.ts` file.

Refer to the Drizzle documentation to learn how
to properly define schemas. Then, insert your
schemas into the file.

### Migration

After you have created/updated your schemas in
the file, persist them to the Database with
Migrations.

1. Configure your credentials (port,
    password, ...) in:

    - `drizzle.config.ts`
    - `drizzle.migrate.mts`.
    - `src/lib/db/index.ts`.

    In the future, we may wish to migrate these
    credentials to environment variables.

2. Run the `npm run db:generate` command to
generate your `.sql` Migration Files under the
`drizzle` folder.

3. Rename your
    `<migration_num>_<random_name>.sql` file
    to `<migration_num>_<meaningful_name>.sql`.

    For example:
    - Generated: `0000_dazzling_squirrel.sql`
    - Renamed: `0000_initial_schema.sql`.

    Then, rename the
    `meta/_journal.json` tag from
    `0000_dazzling_squirrel` to
    `0000_initial_schema` as well. Replace the
    migration number and name with the one you
    used.

4. Finally, run the migration with this:

    ```bash
    npm run db:migrate
    ```

### Connecting with the DB

1. Import the `db` instance from `lib/db`.
2. Use the Drizzle APIs and the tables defined in
    `src/lib/schema.ts` to interact with the
    tables.

    ```ts
    import { db, tableName } from '../lib/db';

    const route = async (req, res) => {
      await db.select().from(tableName); //...
    }
    ```
