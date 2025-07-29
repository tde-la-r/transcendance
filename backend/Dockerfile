FROM php:8.2-cli

WORKDIR /app

RUN apt-get update && \
    apt-get install -y libpq-dev && \
    docker-php-ext-install pdo pdo_pgsql

COPY . .

# RUN docker-php-ext-install pdo_pgsql

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "."]
