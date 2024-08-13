from django.contrib import admin

from .models  import *

admin.site.register(User)
admin.site.register(Ingredient)
admin.site.register(Recipe)
admin.site.register(Required)
admin.site.register(Shared)