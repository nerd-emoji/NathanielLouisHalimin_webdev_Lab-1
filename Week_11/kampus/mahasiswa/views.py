from django.shortcuts import render, redirect, get_object_or_404
from .models import Mahasiswa
from .forms import MahasiswaForm

def daftar_mahasiswa(request):
    mahasiswa_list = Mahasiswa.objects.all().order_by('nim')
    return render(request, 'mahasiswa/list.html', {'mahasiswa_list': mahasiswa_list})

def tambah_mahasiswa(request):
    if request.method == 'POST':
        form = MahasiswaForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('mahasiswa:daftar')
    else:
        form = MahasiswaForm()
    return render(request, 'mahasiswa/create.html', {'form': form})

def edit_mahasiswa(request, pk):
    mahasiswa = get_object_or_404(Mahasiswa, pk=pk)
    if request.method == 'POST':
        form = MahasiswaForm(request.POST, request.FILES, instance=mahasiswa)
        if form.is_valid():
            form.save()
            return redirect('mahasiswa:daftar')
    else:
        form = MahasiswaForm(instance=mahasiswa)
    return render(request, 'mahasiswa/create.html', {'form': form, 'mahasiswa': mahasiswa})
