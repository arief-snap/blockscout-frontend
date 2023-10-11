#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "Usage: yarn dev:preset <preset_name>"
  exit 1
fi

preset_name="$1"
config_file="./configs/envs/.env.${preset_name}"
secrets_file="./configs/envs/.env.secrets"

if [ ! -f "$config_file" ]; then
    echo "Error: File '$config_file' not found."
    exit 1
fi

if [ ! -f "$secrets_file" ]; then
    echo "Error: File '$secrets_file' not found."
    exit 1
fi

# if NEXT_PUBLIC_APP_LISTEN_PORT is not defined - then it should equal to NEXT_PUBLIC_APP_PORT:
if [ -z "$NEXT_PUBLIC_APP_LISTEN_PORT" ]; then
  export NEXT_PUBLIC_APP_LISTEN_PORT=$NEXT_PUBLIC_APP_PORT
fi

# download assets for the running instance
dotenv \
  -e $config_file \
  -- bash -c './deploy/scripts/download_assets.sh ./public/assets'

# generate envs.js file and run the app
dotenv \
  -v NEXT_PUBLIC_GIT_COMMIT_SHA=$(git rev-parse --short HEAD) \
  -v NEXT_PUBLIC_GIT_TAG=$(git describe --tags --abbrev=0) \
  -e $config_file \
  -e $secrets_file \
  -- bash -c './deploy/scripts/make_envs_script.sh && next dev -- -p $NEXT_PUBLIC_APP_LISTEN_PORT' |
pino-pretty