#!/bin/bash

service nginx restart

uvicorn \
    --host 0.0.0.0 \
    --port 8000 \
    --workers 1 \
    --proxy-headers \
    --timeout-keep-alive 300 \
    map.asgi:application