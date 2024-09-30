[![Docker Image CI](https://github.com/bluewolf44/PantryPal/actions/workflows/docker-image.yml/badge.svg)](https://github.com/bluewolf44/PantryPal/actions/workflows/docker-image.yml)
[![Django CI](https://github.com/bluewolf44/PantryPal/actions/workflows/django.yml/badge.svg)](https://github.com/bluewolf44/PantryPal/actions/workflows/django.yml)
[![Mirror to GitBucket](https://github.com/bluewolf44/PantryPal/actions/workflows/push-to-gitbucket.yml/badge.svg)](https://github.com/bluewolf44/PantryPal/actions/workflows/push-to-gitbucket.yml)

## Student Logs
ACTIVITY LOG: https://otagouni-my.sharepoint.com/:x:/r/personal/andol082_student_otago_ac_nz/Documents/Activity%20Log%20-%20TEAM%20B%20-%20INFO301.xlsx?d=w82c33493a7134d7394c9d4425b96ea23&csf=1&web=1&e=Bvd0Vi

TEAM NOTES:  https://otagouni-my.sharepoint.com/:w:/r/personal/andol082_student_otago_ac_nz/Documents/INFO301%20TEAM%20B%20NOTES.docx?d=w5af6a9103f944d8d84234485b0df293b&csf=1&web=1&e=uw6dnH
# How to run:
## Docker
To run use **docker-compose -p pantrypal up** with docker desktop running
## Not Docker
### Install and add to path:
- python
- nodejs
- postgresql

----
### Database using Postgresql:
```
- psql -U postgres 
- passwords is "**postgres**"
- CREATE DATABASE postgres
- exit
```
----
### Backend using Django:
```
- cd PantryPal
- pip install -r requirements.txt
- python manage.py makemigrations main
- python manage.py migrate
- python manage.py runserver
```
----
### FrontEnd using React.js:
```
- cd TeamBINFO301/Frontend
- npm install
- npm run build
- npm run dev
```
----

**Note:** Only the last line will be need to be done on repeat
