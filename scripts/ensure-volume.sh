#!/bin/bash

check_or_create_docker_volume() {
  local volume_name=$1

  # Check if the volume exists
  if docker volume inspect "$volume_name" > /dev/null 2>&1; then
    echo "Docker volume '$volume_name' already exists."
  else
    # Create the volume if it doesn't exist
    echo "Docker volume '$volume_name' does not exist. Creating it..."
    docker volume create "$volume_name"
    echo "Docker volume '$volume_name' created."
  fi
}

# volume_names=("user-db" "question-db" "match-mq")
volume_names=("user-db" "question-db" "collab-db")

for volume in "${volume_names[@]}"; do
  check_or_create_docker_volume "$volume-docker"
done

