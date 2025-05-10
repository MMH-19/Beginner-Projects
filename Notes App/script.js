document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const addNoteBtn = document.getElementById('add-note-btn');
    const notesContainer = document.getElementById('notes-container');
    const noteTemplate = document.getElementById('note-template');
    
    // Notes array
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    
    // Event listeners
    addNoteBtn.addEventListener('click', createNewNote);
    
    // Initial render
    renderNotes();
    
    // Functions
    function createNewNote() {
        const note = {
            id: Date.now(),
            content: '',
            createdAt: new Date().toISOString(),
            isEditing: true
        };
        
        notes.unshift(note);
        saveNotes();
        renderNotes();
    }
    
    function saveNotes() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }
    
    function renderNotes() {
        notesContainer.innerHTML = '';
        
        if (notes.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'No notes yet. Click "Add Note" to create one!';
            emptyMessage.style.gridColumn = '1 / -1';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            notesContainer.appendChild(emptyMessage);
            return;
        }
        
        notes.forEach(note => {
            const noteElement = createNoteElement(note);
            notesContainer.appendChild(noteElement);
        });
    }
    
    function createNoteElement(note) {
        const noteClone = noteTemplate.content.cloneNode(true);
        const noteElement = noteClone.querySelector('.note');
        noteElement.dataset.id = note.id;
        
        // Set note date
        const dateElement = noteElement.querySelector('.note-date');
        dateElement.textContent = formatDate(note.createdAt);
        
        // Set note content
        const contentElement = noteElement.querySelector('.note-content');
        if (note.content) {
            contentElement.innerHTML = marked.parse(note.content);
        } else {
            contentElement.innerHTML = '<em>Empty note</em>';
        }
        
        // Set textarea value
        const textareaElement = noteElement.querySelector('.note-textarea');
        textareaElement.value = note.content;
        
        // Add event listeners
        const editBtn = noteElement.querySelector('.edit-btn');
        const deleteBtn = noteElement.querySelector('.delete-btn');
        const saveBtn = noteElement.querySelector('.save-btn');
        const cancelBtn = noteElement.querySelector('.cancel-btn');
        
        editBtn.addEventListener('click', () => editNote(note.id));
        deleteBtn.addEventListener('click', () => deleteNote(note.id));
        saveBtn.addEventListener('click', () => saveNote(note.id));
        cancelBtn.addEventListener('click', () => cancelEdit(note.id));
        
        // Show edit area if note is in editing mode
        if (note.isEditing) {
            contentElement.classList.add('hidden');
            noteElement.querySelector('.note-edit-area').classList.remove('hidden');
            textareaElement.focus();
        }
        
        return noteElement;
    }
    
    function editNote(id) {
        const noteIndex = notes.findIndex(note => note.id === id);
        if (noteIndex !== -1) {
            notes[noteIndex].isEditing = true;
            renderNotes();
        }
    }
    
    function saveNote(id) {
        const noteIndex = notes.findIndex(note => note.id === id);
        if (noteIndex !== -1) {
            const noteElement = document.querySelector(`.note[data-id="${id}"]`);
            const textareaElement = noteElement.querySelector('.note-textarea');
            
            notes[noteIndex].content = textareaElement.value;
            notes[noteIndex].isEditing = false;
            
            saveNotes();
            renderNotes();
        }
    }
    
    function cancelEdit(id) {
        const noteIndex = notes.findIndex(note => note.id === id);
        if (noteIndex !== -1) {
            notes[noteIndex].isEditing = false;
            renderNotes();
        }
    }
    
    function deleteNote(id) {
        if (confirm('Are you sure you want to delete this note?')) {
            notes = notes.filter(note => note.id !== id);
            saveNotes();
            renderNotes();
        }
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}); 