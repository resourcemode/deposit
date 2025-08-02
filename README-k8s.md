# Kubernetes Deployment Guide

This guide explains how to deploy the Time Deposit application to a Kubernetes cluster.

## Files Created

1. **k8s-deployment.yaml** - Main deployment configuration with Service and Ingress
2. **k8s-configmap.yaml** - ConfigMap and Secret templates for environment variables

## Prerequisites

- Kubernetes cluster (local or cloud)
- kubectl configured to access your cluster
- Docker image built and available in a registry

## Deployment Steps

### 1. Build and Push Docker Image

```bash
# Build the Docker image
docker build -t time-deposit-app:latest .

# Tag for your registry (replace with your registry URL)
docker tag time-deposit-app:latest your-registry/time-deposit-app:latest

# Push to registry
docker push your-registry/time-deposit-app:latest
```

### 2. Update Image Reference

Edit `k8s-deployment.yaml` and update the image reference:
```yaml
image: your-registry/time-deposit-app:latest
```

### 3. Configure Environment Variables

Edit `k8s-configmap.yaml` to add your specific configuration:
- Add non-sensitive config to ConfigMap
- Add sensitive data (passwords, API keys) to Secret

### 4. Deploy to Kubernetes

```bash
# Apply ConfigMap and Secrets first
kubectl apply -f k8s-configmap.yaml

# Deploy the application
kubectl apply -f k8s-deployment.yaml
```

### 5. Verify Deployment

```bash
# Check pod status
kubectl get pods -l app=time-deposit-app

# Check service
kubectl get service time-deposit-service

# Check ingress
kubectl get ingress time-deposit-ingress

# View logs
kubectl logs -l app=time-deposit-app
```

## Configuration Notes

### Health Checks
The deployment includes liveness and readiness probes that check `/health` endpoint. Make sure your NestJS app has a health check endpoint, or update the probe paths accordingly.

### Resource Limits
- Memory: 256Mi request, 512Mi limit
- CPU: 250m request, 500m limit
- Adjust based on your application's needs

### Scaling
- Default replicas: 3
- Scale with: `kubectl scale deployment time-deposit-app --replicas=5`

### Ingress
- Configured for `time-deposit.local` hostname
- Update the host in `k8s-deployment.yaml` for your domain
- Requires an Ingress Controller (like nginx-ingress)

## Troubleshooting

```bash
# Describe pod for events and status
kubectl describe pod <pod-name>

# Get detailed logs
kubectl logs <pod-name> -f

# Execute into pod for debugging
kubectl exec -it <pod-name> -- /bin/sh
```

## Environment Variables Reference

Update the deployment to reference your ConfigMap and Secrets:

```yaml
env:
- name: NODE_ENV
  valueFrom:
    configMapKeyRef:
      name: time-deposit-config
      key: NODE_ENV
- name: DATABASE_URL
  valueFrom:
    secretKeyRef:
      name: time-deposit-secrets
      key: database-url
```
