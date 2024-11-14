#!/bin/bash

NEW_KEY="$1"
if [ $# -ne 1 ]; then
    NEW_KEY="<insert_key>"
fi

# Check if we're on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS version (using empty '' after -i)
    find . -type f -name ".env*" -exec sed -i '' "s/OPENAI_API_KEY=.*/OPENAI_API_KEY=\"${NEW_KEY}\"/g" {} +
else
    # Linux version
    find . -type f -name ".env*" -exec sed -i "s/OPENAI_API_KEY=.*/OPENAI_API_KEY=\"${NEW_KEY}\"/g" {} +
fi