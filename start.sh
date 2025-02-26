#!/bin/bash
set -e

# Iniciar los procesos en segundo plano con salida a logs
node index.js >> index.log 2>&1 &
INDEX_PID=$!

node server.js >> server.log 2>&1 &
SERVER_PID=$!

# Esperar a que terminen
wait $INDEX_PID
wait $SERVER_PID
