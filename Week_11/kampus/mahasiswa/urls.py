from django.urls import path
from . import views

app_name = 'mahasiswa'

urlpatterns = [
    path('', views.daftar_mahasiswa, name='daftar'),
    path('tambah/', views.tambah_mahasiswa, name='tambah'),
    path('<int:pk>/edit/', views.edit_mahasiswa, name='edit'), 
]