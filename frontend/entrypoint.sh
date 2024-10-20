#!/bin/sh

envsubst '${FRONTEND_PORT} ${VITE_USER_SERVICE} ${VITE_QUESTION_SERVICE} ${VITE_MATCHING_SERVICE}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf

nginx -g 'daemon off;'