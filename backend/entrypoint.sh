#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# python3 manage.py flush --no-input
python3 manage.py makemigrations authentication --noinput
python3 manage.py migrate --noinput

# "Do everything in this .sh script, then in the same shell run the command the user passes in on the command line"
exec "$@"