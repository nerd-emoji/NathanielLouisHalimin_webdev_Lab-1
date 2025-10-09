from django.contrib import admin
from .models import Profile, Nilai

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role')
    list_filter = ('role',)
    search_fields = ('user__username', 'user__first_name', 'user__last_name')

@admin.register(Nilai)
class NilaiAdmin(admin.ModelAdmin):
    list_display = ('profile', 'mata_kuliah', 'nilai')
    list_filter = ('mata_kuliah',)
    search_fields = ('profile__user__username', 'mata_kuliah')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('profile__user')