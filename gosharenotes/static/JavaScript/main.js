// DOM Elements
const noteContent = document.getElementById('noteContent');

const saveButton = document.getElementById('saveButton');
const editButton = document.getElementById('editButton');
const deleteButton = document.getElementById('deleteButton');

const saveModal = document.getElementById('saveModal');

const passwordModal = document.getElementById('passwordModal');
const passwordForm = document.getElementById('passwordForm');
const passwordInput = document.getElementById('passwordGet');
const cancelPasswordButton = document.getElementById('cancelPassword');

const editPasswordModal = document.getElementById('editPasswordModal');
const editPasswordForm = document.getElementById('editPasswordForm');
const editPasswordInput = document.getElementById('editPasswordGet');
const editCancelPasswordButton = document.getElementById('editCancelPassword');

const deletePasswordModal = document.getElementById('deletePasswordModal');
const deletePasswordForm = document.getElementById('deletePasswordForm');
const deletePasswordInput = document.getElementById('deletePasswordGet');
const deleteCancelPasswordButton = document.getElementById('deleteCancelPassword');

const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
noteContent.readOnly = false;

// Variables
let autoSaveTimer;
let initialContent = noteContent.value; // Store the initial content for change detection

/** ----------------------------- Utilities ----------------------------- **/

// Hash password before sending it for edit or delete actions
function hashPassword(password) {
    return CryptoJS.SHA256(password).toString(); // Hash using SHA256
}

document.querySelector('form').addEventListener('submit', function (event) {
    const passwordField = document.querySelector('#password');
    const rawPassword = passwordField.value;

    // Hash the password using CryptoJS
    const hashedPassword = CryptoJS.SHA256(rawPassword).toString();

    // Replace the raw password with the hashed password
    passwordField.value = hashedPassword;
});

// Display a modal
function showModal(modal) {
    modal.style.display = 'flex';
}

// Hide a modal
function hideModal(modal) {
    modal.style.display = 'none';
}

// Auto-focus an input field
function focusInput(input) {
    input.focus();
}

/** ----------------------------- Note Functions ----------------------------- **/

// Enable editing mode
function enableEditing() {
    noteContent.readOnly = false;
    editButton.textContent = 'Editing...';
    editButton.disabled = true;
}

// Auto-save the note if content has changed
function autoSaveNote() {
    const content = noteContent.value;

    if (content !== initialContent) {
        fetch(`/save_auto/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({
                note_id: noteIdForAutoSave, // This Id came from the base.html above the main.js script
                content: content,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    console.error('Auto-save failed');
                } else {
                    initialContent = content; // Update initial content
                }
            })
            .catch(error => console.error('Error during auto-save:', error));
    }
}

// Initialize the edit button visibility based on note privacy
function initializeEditButton() {
    const notePrivacy = editButton?.getAttribute('data-note-privacy');
    if (notePrivacy === 'semi-public') {
        noteContent.readOnly = true;
        editButton.style.display = 'block';
    } else if (notePrivacy) {
        editButton.style.display = 'none';
    }
}

/** ----------------------------- Modal Handling ----------------------------- **/

// Show password modal for editing semi-public notes
function showPasswordModalForEdit(noteId) {
    editPasswordForm.action = `/validate_password/${noteId}/`; // Set form action dynamically
    showModal(editPasswordModal);
    focusInput(editPasswordInput);
}

// Show password modal for delete notes
function showPasswordModalForDelete(noteId) {
    deletePasswordForm.action = `/delete-note/${noteId}/`; // Set form action dynamically
    showModal(deletePasswordModal);
    focusInput(deletePasswordInput);
}

// Show the password for opening private notes
function showPasswordModal(noteId) {
    passwordForm.action = `/load/${noteId}/`;
    showModal(passwordModal);
    focusInput(passwordInput);
}

// // Validate password and enable editing on success
function validatePasswordForEdit(event) {
    event.preventDefault();

    const formData = new FormData(editPasswordForm);

    // Ensure FormData includes CSRF token if required
    if (!formData.has('csrfmiddlewaretoken')) {
        formData.append('csrfmiddlewaretoken', csrfToken);
    }

    // Get the raw password entered by the user
    const rawPassword = editPasswordInput.value;

    // Hash the password
    const hashedPassword = hashPassword(rawPassword);

    // Set the hashed password into the form before submission
    editPasswordInput.value = hashedPassword;

    fetch(editPasswordForm.action, {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            return response.text(); // Read as plain text for debugging
        })
        .then(text => {
            console.log('Server response:', text); // Log server response
            return JSON.parse(text); // Parse JSON response
        })
        .then(data => {
            if (data.success) {
                hideModal(editPasswordModal);
                enableEditing();
            } else {
                alert('Invalid password');
            }
        })
        .catch(error => {
            console.error('Error validating password:', error);
        });
}

// // Validate password and delete note on success
function validatePasswordForDelete(event) {
    event.preventDefault();

    const formData = new FormData(deletePasswordForm);

    // Ensure FormData includes CSRF token if required
    if (!formData.has('csrfmiddlewaretoken')) {
        formData.append('csrfmiddlewaretoken', csrfToken);
    }

    // Get the raw password entered by the user
    const rawPassword = deletePasswordInput.value;

    // Hash the password
    const hashedPassword = hashPassword(rawPassword);

    // Set the hashed password into the form before submission
    deletePasswordInput.value = hashedPassword;

    fetch(deletePasswordForm.action, {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            return response.text(); // Read as plain text for debugging
        })
        .then(text => {
            console.log('Server response:', text); // Log server response
            return JSON.parse(text); // Parse JSON response
        })
        .then(data => {
            if (data.success) {
                hideModal(deletePasswordModal);
                window.location.href = `/`;
            } else {
                alert('Invalid password');
            }
        })
        .catch(error => {
            console.error('Error validating password:', error);
        });
}

/** ----------------------------- Event Listeners ----------------------------- **/

// Listen for content input changes and trigger auto-save
noteContent.addEventListener('input', () => {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(autoSaveNote, 2000);
});

// Handle edit button click
if (editButton) {
    editButton.addEventListener('click', () => {
        const notePrivacy = editButton.dataset.notePrivacy;
        const noteId = editButton.dataset.noteId;

        if (notePrivacy === 'semi-public') {
            showPasswordModalForEdit(noteId);
        }
    });
}

// Handle Delete button click
if (deleteButton) {
    deleteButton.addEventListener('click', () => {
        const noteId = deleteButton.dataset.noteId;
        showPasswordModalForDelete(noteId);
    });
}

// Handle save button click
saveButton.addEventListener('click', () => showModal(saveModal));

// Close modals when clicking outside them
saveModal.addEventListener('click', (e) => {
    if (e.target === saveModal) hideModal(saveModal);
});

passwordModal.addEventListener('click', (e) => {
    if (e.target === passwordModal) hideModal(passwordModal);
});

editPasswordModal.addEventListener('click', (e) => {
    if (e.target === editPasswordModal) hideModal(editPasswordModal);
});

deletePasswordModal.addEventListener('click', (e) => {
    if (e.target === deletePasswordModal) hideModal(deletePasswordModal);
});

// Handle password form submission to validate
editPasswordForm.addEventListener('submit', validatePasswordForEdit);

deletePasswordForm.addEventListener('submit', validatePasswordForDelete);


// Handle cancel button click in password modal
cancelPasswordButton.addEventListener('click', () => hideModal(passwordModal));
editCancelPasswordButton.addEventListener('click', () => hideModal(editPasswordModal));
deleteCancelPasswordButton.addEventListener('click', () => hideModal(deletePasswordModal));

// Initialize the edit button visibility on page load
initializeEditButton();

/** ----------------------------- Note Navigation ----------------------------- **/

// Handle note links for private and semi-public notes
document.querySelectorAll('.note-link').forEach(link => {
    link.addEventListener('click', function () {
        const noteId = this.getAttribute('data-note-id');
        const notePrivacy = this.getAttribute('data-note-privacy');

        if (notePrivacy === 'private') {
            showPasswordModal(noteId);
        } else {
            window.location.href = `/load/${noteId}/`; // Directly navigate for public notes
        }
    });
});
