# Use nginx as base image
FROM nginx:alpine

# Copy the HTML file and assets to nginx html directory
COPY mainpage.html /usr/share/nginx/html/index.html
COPY images/ /usr/share/nginx/html/images/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY files/* /usr/share/nginx/html/files/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
