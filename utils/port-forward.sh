#!/bin/bash

# Array of Kubernetes pods/services names, local ports, remote ports, and namespaces
pods_services=(
    "acid-strapi-0 5432 5432 main"
)

# Kill existing kubectl port-forward instances
pkill -f "kubectl port-forward"

# Loop through the array and call kubectl port-forward for each pod/service
for entry in "${pods_services[@]}"; do
    # Split the entry into its components
    read -r name local_port remote_port namespace <<< "$entry"
    kubectl port-forward -n "$namespace" "$name" "$local_port:$remote_port" &
done

echo "Port forwarding setup complete."