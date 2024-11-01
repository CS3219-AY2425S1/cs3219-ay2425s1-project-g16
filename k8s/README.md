# Kubernetes Instructions

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Load Testing](#load-testing)
- [Exposing the Ingress Controller](#exposing-the-ingress-controller)
- [Running the Minikube Service without Ingress](#running-the-minikube-service-without-ingress)
- [GKE Instructions](#gke-instructions)

## Prerequisites

- [**Minikube**](https://minikube.sigs.k8s.io/docs/)

  To run a local Kubernetes cluster, we recommend using Minikube on your local machine.

## Getting Started

1. Ensure that the Metrics Server add-on is enabled. Else, the autoscaling and ingress will not work.

2. For Minikube:

    ```sh
    # For Horizontal Pod Autoscaling
    minikube addons enable metrics-server

    # For Nginx Ingress Controller
    # Install
    minikube addons enable ingress
    # Verify
    kubectl get pods -n ingress-nginx
    ```

3. For Kubernetes:

    ```sh
    # Metric Server
    kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

    # Ingress Controller
    # Install
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.44.0/deploy/static/provider/cloud/deploy.yaml
    # Deploy with load balancer (GKE, AKS, EKS)
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.44.0/deploy/static/provider/cloud/deploy.yaml
    # Validate
    kubectl get pods --all-namespaces -l app.kubernetes.io/name=ingress-nginx
    kubectl get services ingress-nginx-controller --namespace=ingress-nginx
    ```

4. Run the command from the project root:

    ```sh
    make k8s-up
    ```

## Load Testing

1. Run the load test script:

    ```sh
    ./scripts/k8s-test-load.sh
    ```

    In its current configuration, it will run a load testing container to ping the user-service.
    Add more services and their respective ports as desired.

    Also, this will ping the service's `/health` endpoint, if configured. Else, it will not work.

2. Run the command:

    ```sh
    kubectl -n peerprep get all
    ```

    You should be able to see the Horizontal Pod AutoScaler scaling up the services in respond to 
    resource demand.

3. Run <kbd>Ctrl</kbd>+<kbd>C</kbd> to interrupt and
    terminate the load tester.

## Exposing the Ingress Controller

1. If you haven't already, run the command from the project root:

    ```sh
    make k8s-up
    ```

2. Run the command to set up the ingress controller:

    ```sh
    kubectl apply -f ./k8s/local
    ```

    It should take a couple of minutes. Once done, you should run this command:

    ```sh
    kubectl -n peerprep get ingress

    # You should see a similar output:
    # NAME              CLASS   HOSTS                 ADDRESS        PORTS   AGE
    # peerprep-ingress  nginx   peerprep-g16.net      172.17.0.15    80      38s
    ```

3. Run the command to expose the ingress controller:

    ```sh
    minikube tunnel
    ```

4. Edit your `/etc/hosts` file and add the following at the bottom:

    ```txt
    127.0.0.1 peerprep-g16.net
    ```

5. If there is already an entry that points to `localhost`, comment it out temporarily.

    ```txt
    127.0.0.1 localhost # <- Comment this out, it should look like this ↙️
    
    # 127.0.0.1 localhost
    127.0.0.1 peerprep-g16.net
    ```

6. Visit `http://peerprep-g16.net` in your browser.

7. When done, reset your `/etc/hosts` file to its original state.

8. Run <kbd>Ctrl</kbd>+<kbd>C</kbd> on the **Minikube Tunnel** to stop it.

## Running the Minikube Service without Ingress

1. Run the command to set up the cluster:

    ```sh
    make k8s-up
    ```

2. Expose the service:

    ```sh
    minikube -n peerprep service frontend
    ```

    A browser window should launch, directing you to the application's frontend.

## GKE Instructions
<!-- https://cert-manager.io/docs/tutorials/getting-started-with-cert-manager-on-google-kubernetes-engine-using-lets-encrypt-for-ingress-ssl/ -->

### Setup

1. Authenticate or ensure you are added as a user to the Google Cloud Project:

    - Project ID: `cs3219-g16`
    - Project Zone: `asia-southeast1-c`

2. Install the `gcloud` C by following the instructions at this link:

    - [Installation Instructions](https://cloud.google.com/sdk/docs/install)

3. Setup the CLI with the following commands:

    ```sh
    gcloud auth login

    gcloud config set project cs3219-g16

    gcloud config set compute/zone asia-southeast1-c

    gcloud components install gke-gcloud-auth-plugin

    export USE_GKE_GCLOUD_AUTH_PLUGIN=True
    ```

4. Create the cluster with the following commands:

    ```sh
    gcloud container clusters create \
      cs3219-g16 \
      --preemptible \
      --machine-type e2-small \
      --enable-autoscaling \
      --num-nodes 1 \
      --min-nodes 1 \
      --max-nodes 25 \
      --region=asia-southeast1-c
    ```

5. Once the cluster has been created, run the commands below to configure `kubectl` and connect to the cluster:

    ```sh
    gcloud container clusters get-credentials cs3219-g16

    # You should see some output here
    kubectl get nodes -o wide
    ```

6. Run the script (ensure you are in a Bash shell like on Mac or Linux):

    ```sh
    make k8s-up
    ```

    - Wait until the deployments all reach status running:

        ```sh
        kubectl -n peerprep rollout status deployment frontend
        ```

7. If you haven't already, visit the GCloud console -> 'Cloud Domains' and verify that a domain name has been created.

    - We currently have one as `peerprep-g16.net`.
        - This can be created under 'Cloud Domains' -> 'Register Domain' in the GCloud console.
    - We also associate a GCloud Global Web IP `web-ip` to this DNS record as an 'A' record.
        - To set an IP DNS 'A' record, follow these steps:
            1. Create an IP:

                ```sh
                gcloud compute addresses create web-ip --global
                ```

            2. Verify that it exists:

                ```sh
                gcloud compute addresses list
                ```

            3. Grab the IP address:

                ```sh
                gcloud compute addresses describe web-ip --format='value(address)' --global
                ```

            4. Associate it via the console:
                - Cloud DNS -> 'Zone Name': peerprep-g16.net -> 'Add standard'
                - Paste the IP address
                - 'Create'

8. Install the `cert-manager` plugin:

    ```sh
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.16.1/cert-manager.yaml
    ```

9. Create the ingress and secrets in the prod environment:

    ```sh
    kubectl apply -f ./k8s/gcloud
    ```

    - After 15 minutes, you should be able to access the UI over HTTPS at this link:
        - `https://peerprep-g16.net`

10. Cleanup:

    - Delete the cluster:

        ```sh
        gcloud container clusters delete cs3219-g16
        ```

    - When done with the project, delete the web records:

        ```sh
        gcloud dns record-sets delete peerprep-g16 --type A

        gcloud compute addresses delete web-ip --global
        ```

### CD (Continuous Delivery via Github Actions)

1. Setup the following in Github Actions by:

    - heading to the 'Settings' -> 'Secrets and variables' -> 'Actions' -> 'New repository secret'
    - Adding the following keys:

        ```txt
        GKE_SA_KEY: <redacted (get from the cloud console IAM -> 'Service Accounts' page)>
        GKE_PROJECT: cs3219-g16
        GKE_CLUSTER: cs3219-g16 
        GKE_ZONE: asia-southeast1-c
        ```

        - If the `GKE_SA_KEY` is needed, contact us.

2. Merge a PR to `main`. The following will happend:

    1. An action will run under the 'actions' tab in Github.

    2. This will build and push the service images and verify that the cluster is redeployed with the latest images:

    ```sh
    kubectl -n peerprep get deployment
    ```
