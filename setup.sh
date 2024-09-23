#!/bin/sh

# Create the react build file
(cd frontend;npm ci;npm run build)

# Set up the migrations
python manage.py makemigrations
python manage.py makemigrations main

# Create the migrate to the db
python manage.py migrate
python manage.py migrate main
#Start the server
python -u manage.py runserver 0.0.0.0:8000