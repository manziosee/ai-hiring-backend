#!/bin/bash

echo "Deploying AI Hiring Frontend to Fly.io..."

echo ""
echo "Step 1: Checking Fly CLI installation"
if ! command -v flyctl &> /dev/null; then
    echo "Fly CLI not found. Please install it first:"
    echo "https://fly.io/docs/hands-on/install-flyctl/"
    exit 1
fi

echo ""
echo "Step 2: Logging into Fly.io"
flyctl auth login

echo ""
echo "Step 3: Creating/Launching the app"
flyctl launch --no-deploy

echo ""
echo "Step 4: Deploying the application"
flyctl deploy

echo ""
echo "Step 5: Opening the deployed app"
flyctl open

echo ""
echo "Deployment complete!"