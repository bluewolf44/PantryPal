[![Docker Image CI](https://github.com/bluewolf44/PantryPal/actions/workflows/docker-image.yml/badge.svg)](https://github.com/bluewolf44/PantryPal/actions/workflows/docker-image.yml)
[![Django CI](https://github.com/bluewolf44/PantryPal/actions/workflows/django.yml/badge.svg)](https://github.com/bluewolf44/PantryPal/actions/workflows/django.yml)
[![Mirror to GitBucket](https://github.com/bluewolf44/PantryPal/actions/workflows/push-to-gitbucket.yml/badge.svg)](https://github.com/bluewolf44/PantryPal/actions/workflows/push-to-gitbucket.yml)

# How to run:
## Using Docker

- **Docker Desktop:** Ensure Docker Desktop is installed and running.
- **Git:** Clone the repository from the source.

---

### Running PantryPal

1. From terminal Clone the PantryPal repository and navigate to the root directory.

   ```
   git clone https://isgb.otago.ac.nz/info301/git/phiha428/TeamBINFO301.git
   ```
2. Then enter this in root directory while docker desktop is running:

   ```
   docker-compose -p pantrypal up
   ```

## Running locally
### Install and add to path:
- [python 3.10](https://www.python.org/)
- [nodejs](https://nodejs.org/en)
- [postgresql](https://www.postgresql.org/)

----
Do the following in order:

### Database using Postgresql:
Login into postgres shell
```
psql -U postgres 
```
passwords is "**postgres**"

Creating database called **postgres**
```
CREATE DATABASE postgres
exit
```
----
### FrontEnd using React.js:

Installing the node files,
```
cd TeamBINFO301/Frontend
npm install
```

In the same directory use one or the other.

This makes build files that Django uses to render
```
npm run build
```
Or use to locally run on port 5173  [(http://localhost:5173)](http://localhost:5173)
```
npm run dev
```
----

### Backend using Django:

Installing the python library and creating migrations into the database [(More info)](https://docs.djangoproject.com/en/5.1/topics/migrations/)

This will run on port 8000 [(http://localhost:8000)](http://localhost:8000)

```
cd PantryPal
pip install -r requirements.txt
python manage.py makemigrations main
python manage.py migrate
python manage.py runserver
```
----
**Note:** Only the last line will be need to be done on repeat with out any-changes

----
# Information
## The stack
- Frontend: [JavaScript](https://262.ecma-international.org/#sec-intro),[React](https://react.dev/)
- Backend: [Python](https://www.python.org/), [Django](https://www.djangoproject.com/)
- Database: [postgresql](https://www.postgresql.org/)

## Folders
### **./frontend/**:
The **./frontend/** folder is were the javascript and node_build files are stored for the frontend.
The **./frontend/dist** folder will be created on ```npm run build```. Django will use this folder to render the frontend using it's network entry and exit.
Lastly **./frontend/src** folder has all the javascript source code inside it and will describe how the application wil work 

### **./main/**:
The **./main/** directory will have all the business logic for the backend of PantryPal. 
Where **urls.py** will route the path into the writen code inside **views.py** which read the files inside **./frontend/dist** to render the frontend.
Lasty **./main/tests/** houses all the unit test for our backend which can be run using [Pytest](https://docs.pytest.org/en/stable/).
**models.py** is where the [django models](https://docs.djangoproject.com/en/5.1/topics/db/models/) are describe. This create the table inside the database when ```python manage.py makemigrations main``` and ```python manage.py migrate```

### **./pantryPal/**:
The starting point of [django](https://www.djangoproject.com/). This is where the setting and config files for django is stored.

### **./Storage/**:
The directory where the pictures are writen and read.
**./Storage/IngredientImages** is the place where the images of the Ingredient model in **main/models.py** is saved.
**./Storage/RecipeImages** is the place where the images of the Recipe model in **main/models.py** is saved.
**./Storage/UserImages** is the place where the profile picture of the profile model in **main/models.py** is saved.
**./Storage/RecipeDetails** is the set images for the recipe display inside **frontend/src/createrecipe.jsx**

## Continuous Integration
PantryPal has two action it does using github actions. One being running pytest and confirming that all pass.
The other being the system test of docker starting up with no issues.

Another action PantryPal uses is the mirror to a [GitBucket repository](https://isgb.otago.ac.nz/info301/phiha428/TeamBINFO301) to keep both updated. This have be forked from [GitHub-to-GitBucket-Action](https://github.com/JamesRobionyRogers/GitHub-to-GitBucket-Action/tree/main).
