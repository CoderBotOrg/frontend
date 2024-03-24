FROM nginx:1.25.4-alpine3.18-slim

ADD dist /usr/share/nginx/html
ADD cb_docs /usr/share/nginx/html/docs
ADD docker/nginx.conf /etc/nginx/nginx.conf
ADD docker/default.conf /etc/nginx/conf.d/default.conf