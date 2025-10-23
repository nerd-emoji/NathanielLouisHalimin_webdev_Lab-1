from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    ROLE_CHOICES = (
        ('MAHASISWA', 'Mahasiswa'),
        ('DOSEN', 'Dosen'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='MAHASISWA')
    image = models.ImageField(upload_to='image/', blank=True, null=True, default=None)
    
    def __str__(self):
        return f"{self.user.username} - ({self.get_role_display()})"

class Nilai(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='nilai')
    mata_kuliah = models.CharField(max_length=100)
    nilai = models.FloatField()

    def __str__(self):
        return f"{self.profile.user.username} - {self.mata_kuliah}: {self.nilai}"
# Create your models here.