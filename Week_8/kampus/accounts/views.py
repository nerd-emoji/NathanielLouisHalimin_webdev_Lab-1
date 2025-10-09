from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from .forms import LoginForm

def login_view(request):
    if request.user.is_authenticated:
        # Check user role and redirect accordingly
        profile = getattr(request.user, 'profile', None)
        if profile and profile.role == 'DOSEN':
            return redirect('accounts:dosen-only')
        return redirect('accounts:dashboard')
    
    form = LoginForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        user = authenticate(
            request,
            username=form.cleaned_data['username'],
            password=form.cleaned_data['password']
        )
        if user:
            login(request, user)
            messages.success(request, 'Login successful!')
            
            # Check user role after login and redirect accordingly
            profile = getattr(user, 'profile', None)
            if profile and profile.role == 'DOSEN':
                return redirect('accounts:dosen-only')
            return redirect('accounts:dashboard')
        messages.error(request, 'Invalid username or password.')
    return render(request, 'login.html', {'form': form})

@login_required
def dashboard(request):
    # Redirect Dosen users to their specific dashboard
    profile = getattr(request.user, 'profile', None)
    if profile and profile.role == 'DOSEN':
        return redirect('accounts:dosen-only')
    
    role = getattr(profile, 'role', 'MAHASISWA') if profile else 'MAHASISWA'
    return render(request, 'dashboard.html', {'role': role})

def is_dosen(user):
    """Check if user has Dosen role"""
    profile = getattr(user, 'profile', None)
    return profile and profile.role == 'DOSEN'

@login_required
@user_passes_test(is_dosen)
def dosen_only_view(request):
    """Dashboard specifically for Dosen users"""
    from .models import Nilai, Profile
    
    # Get all students and their grades for Dosen to view
    all_students = Profile.objects.filter(role='MAHASISWA').select_related('user')
    all_grades = Nilai.objects.select_related('profile__user').all()
    all_teachers = Profile.objects.filter(role='DOSEN').select_related('user')
    
    context = {
        'role': request.user.profile.role,
        'students': all_students,
        'grades': all_grades,
        'teachers': all_teachers,
    }
    return render(request, 'dosen_dashboard.html', context)

def logout_view(request):
    logout(request)
    messages.success(request, 'Anda berhasil logout.')
    return redirect('accounts:login')
