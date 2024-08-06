#!/bin/sh

# Set up the migrations
python manage.py makemigrations
# Create the migrate to the db
python manage.py migrate
#Start the server
python manage.py runserver 0.0.0.0:8000