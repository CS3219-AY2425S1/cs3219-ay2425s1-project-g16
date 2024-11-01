#!/bin/sh
ns=peerprep
ns_exist=$(kubectl get ns | grep $ns)
if [[ -z $ns_exist ]]; then 
  echo "Namespace $ns does not exist, creating"
  kubectl apply -f ./k8s/01-ns.yaml
else 
  echo "Namespace exists, creating secrets"
fi

pkgs=("backend/user" "backend/question" "backend/collaboration" "backend/matching" "frontend")

create_secret() {
  local secretName=$1
  envFolder=""
  re='backend/(.+)'
  if [[ $secretName =~ $re ]]; then 
    secretName="${BASH_REMATCH[1]}"
    envFolder="backend/"
  else 
    envFolder=""
  fi

  scrt_name="$secretName-secret"
  scrt_exist=$(kubectl -n "$ns" get secret | grep "$scrt_name")
  if [[ -z $scrt_exist ]]; then 
    echo "Creating $scrt_name"

    # Remove all double quotes and trailing spaces 
    sed -E 's/="(.+)"\s*/=\1/g' "$envFolder$secretName/.env.compose" | \
    kubectl -n $ns \
      create secret generic \
      "$scrt_name" \
      --from-env-file /dev/stdin
  else
    echo "Secret $scrt_name already exists"
  fi
}

for pkg in "${pkgs[@]}"; do
  create_secret $pkg
done

cd k8s 
kubectl apply -f .
