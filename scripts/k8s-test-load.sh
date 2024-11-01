#!/bin/sh

ns=peerprep

load_test_service() {
  service_name=$1
  port=$2
  if [[ -z $service_name || -z $port ]]; then
    echo "Improper args: load_test_service <SERVICE_NAME> <POD>"
    exit 1
  fi

  pod_name="$service_name-service-load-test"

  kubectl run -i \
    --tty $pod_name \
    --rm \
    -n $ns \
    --image=busybox \
    --labels="peerprep.network.$service_name-api=true" \
    --restart=Never \
    -- /bin/sh -c "while true; do wget -q -O- http://$service_name-service:$port/health > /dev/null 2>&1; done"
}

load_test_service user 9001
