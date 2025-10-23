from django.db import models

# Create your models here.
class Mahasiswa(models.Model):
    nim = models.CharField("NIM", max_length=20, unique=True)
    nama = models.CharField("Nama", max_length=100)
    jurusan = models.CharField("Jurusan", max_length=100, blank=True)
    angkatan = models.PositiveIntegerField("Angkatan", blank=True, null=True)
    foto = models.ImageField("Foto", upload_to='fotos/', blank=True, null=True)
    def __str__(self):
        return f"{self.nim} - {self.nama}"

    class Meta:
        verbose_name = "Mahasiswa"
        verbose_name_plural = "Mahasiswa"
