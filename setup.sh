#!/bin/sh

# Set up the migrations
python manage.py makemigrations

python manage.py makemigrations main

python manage.py migrate
# Create the migrate to the db
python manage.py migrate main
#Start the server
python manage.py runserver 0.0.0.0:8000