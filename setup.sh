#!/bin/sh

# Create the react build file
(cd frontend;npm install;npm i;npm run build)

# Set up the migrations
python manage.py makemigrations
python manage.py makemigrations main

# Create the migrate to the db
python manage.py migrate --database=docker
python manage.py migrate main --database=docker
#Start the server
python manage.py runserver 0.0.0.0:8000