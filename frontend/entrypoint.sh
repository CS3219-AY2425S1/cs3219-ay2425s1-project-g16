#!/bin/sh

envsubst '${FRONTEND_PORT} ${VITE_USER_SERVICE} ${VITE_QUESTION_SERVICE} ${VITE_COLLAB_SERVICE} ${VITE_COLLAB_WS}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf

nginx -g 'daemon off;'