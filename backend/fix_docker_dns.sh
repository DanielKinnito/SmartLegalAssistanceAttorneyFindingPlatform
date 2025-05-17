#!/bin/bash

# This script helps fix Docker DNS issues related to registry-1.docker.io

# Get the IPv4 addresses for registry-1.docker.io
echo "Getting IPv4 addresses for registry-1.docker.io..."
REGISTRY_IPS=$(nslookup registry-1.docker.io | grep -A 10 "Non-authoritative answer:" | grep "Address:" | grep -v "#" | awk '{print $2}' | grep -v ":")

if [ -z "$REGISTRY_IPS" ]; then
  echo "Failed to get IPv4 addresses. Using hardcoded fallback addresses."
  REGISTRY_IPS="44.205.64.79 34.205.13.154 3.216.34.172"
fi

# Create a backup of hosts file
echo "Creating backup of /etc/hosts file..."
sudo cp /etc/hosts /etc/hosts.bak

# Add entries to hosts file
echo "Adding registry-1.docker.io entries to hosts file..."
for IP in $REGISTRY_IPS; do
  # Check if entry already exists
  if ! grep -q "$IP.*registry-1.docker.io" /etc/hosts; then
    echo "$IP registry-1.docker.io" | sudo tee -a /etc/hosts
  fi
done

echo "Clearing Docker cache..."
docker system prune -f

echo "Docker DNS fix completed."
echo "Try building your image again with: docker build -t auth-service ./auth-service" 