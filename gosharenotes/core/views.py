import json
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now
from django.contrib import messages
from .models import Note

def index(request):
    default_note = get_or_create_default_note()
    notes = Note.objects.exclude(title="Default Note")
    return render(request, 'core/index.html', {'note': default_note, 'notes': notes})

def get_or_create_default_note():
    """Retrieve or reset the default note."""
    default_note, created = Note.objects.get_or_create(
        title="Default Note",
        defaults={
            'content': 'This is the default note visible to everyone.',
            'privacy': Note.PUBLIC
        }
    )
    if not created and not default_note.is_recent():
        default_note.content = 'This is the default note visible to everyone.'
        default_note.created_at = now()
        default_note.save()
    return default_note

def save_note(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        content = request.POST.get('content')
        privacy = request.POST.get('privacy')
        hashed_password = request.POST.get('password')

        if Note.objects.filter(title=title).exists():
            messages.error(request, "A note with this title already exists.")
            return redirect('index')

        note = Note.objects.create(
            title=title,
            content=content,
            privacy=privacy,
            password=hashed_password
        )
        messages.success(request, "Note saved successfully!")
        return redirect('index')

def load_note(request, note_id):
    note = get_object_or_404(Note, id=note_id)
    notes = Note.objects.exclude(title="Default Note")
    
    if note.privacy == Note.PRIVATE or (note.privacy == Note.SEMI_PUBLIC and 'password' in request.POST):
        password = request.POST.get('password')
        
        # Check if the password is correct
        if not password or password != note.password:
            messages.error(request, "Invalid password!")
            return redirect('index')  # Redirect to the index page or error page

    # Render the note content if the password matches
    return render(request, 'core/note.html', {'note': note, 'notes':notes})

@csrf_exempt
def auto_save(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        note_id = data.get('note_id')
        content = data.get('content')

        # Ensure you only save if content is actually different from the original
        try:
            note = Note.objects.get(id=note_id)
            if note.content != content:
                note.content = content
                note.save()  # Save if content has changed
                return JsonResponse({'message': 'Auto-save successful'}, status=200)
            else:
                return JsonResponse({'message': 'No changes to save'}, status=200)
        except Note.DoesNotExist:
            return JsonResponse({'message': 'Note not found'}, status=404)

    return JsonResponse({'message': 'Invalid request method'}, status=405)

def validate_password(request, note_id):
    if request.method == 'POST':
        note = get_object_or_404(Note, id=note_id)
        hashed_password = request.POST.get('password')

        if note.password == hashed_password:
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid password'}, status=400)
    return JsonResponse({'success': False, 'error': 'Invalid request method'})

def delete_note(request, note_id):
    if request.method == 'POST':
        note = get_object_or_404(Note, id=note_id)
        hashed_password = request.POST.get('password')

        if  note.password == hashed_password:
            note.delete()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error': 'Invalid password'}, status=400)
    return JsonResponse({'success': False, 'error': 'Invalid request method'})