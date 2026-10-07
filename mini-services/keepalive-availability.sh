#!/usr/bin/env bash
# keepalive-availability.sh — keeps the cattery availability WebSocket service alive.
# Runs in foreground; restarts the bun process if it exits.
# Usage: nohup ./keepalive-availability.sh > availability-keepalive.log 2>&1 &

set -u

SERVICE_DIR="/home/z/my-project/mini-services/availability-service"
LOG_FILE="/home/z/my-project/availability-service.log"
RESTART_DELAY=3

echo "[keepalive] starting supervisor for availability-service (port 3003)"

while true; do
  echo "[keepalive] $(date '+%Y-%m-%d %H:%M:%S') launching service..."
  cd "$SERVICE_DIR"
  bun run dev > "$LOG_FILE" 2>&1
  EXIT_CODE=$?
  echo "[keepalive] $(date '+%Y-%m-%d %H:%M:%S') service exited with code $EXIT_CODE, restarting in ${RESTART_DELAY}s..."
  sleep "$RESTART_DELAY"
done
