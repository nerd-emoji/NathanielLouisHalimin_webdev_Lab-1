from django.contrib import admin
from .models import Mahasiswa

# Register your models here.

class MahasiswaAdmin(admin.ModelAdmin):
  list_display = ("nim", "firstname", "lastname", "jurusan",)

admin.site.register(Mahasiswa, MahasiswaAdmin)