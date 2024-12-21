from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    path('', views.index, name='index'),
    path('save/', views.save_note, name='save_note'),
    path('load/<int:note_id>/', views.load_note, name='load_note'),
    path('validate_password/<int:note_id>/', views.validate_password, name='validate_password'),
    path('delete-note/<int:note_id>/', views.delete_note, name='delete_note'),
    path('save_auto/', views.auto_save, name='save_auto'),
    path('admin/', admin.site.urls),
]
