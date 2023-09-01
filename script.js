$(document).ready(function() {
    const noteTextarea = $('#noteTextarea');
  const undoButton = $('#undoButton');
  const redoButton = $('#redoButton');
  const downloadButton = $('#downloadButton');
  const copyButton = $('#copyButton');
  const pasteButton = $('#pasteButton');
  const clearButton = $('#clearButton');
  const openFileButton = $('#openFileButton');
  const fileInput = $('#fileInput');
  const lineCountSpan = $('#line-count');
  const columnCountSpan = $('#column-count');
  const charCountSpan = $('#char-count');
  const wordCountSpan = $('#word-count');
  const preferencesOverlay = $('#preferencesOverlay');
  const preferencesButton = $('#preferencesButton');
  const fontSizeInput = $('#fontSize');
  const modeToggleButton = $('#modeToggleButton');
  const fontWeightSelect = $('#fontWeight');
  const lineHeightSelect = $('#lineHeight');
  const fontFamilySelect = $('#fontFamily');
  const savePreferencesButton = $('#savePreferences');
  const cancelPreferencesButton = $('#cancelPreferences');
  const savedFontSize = localStorage.getItem('fontSize');
  const savedFontWeight = localStorage.getItem('fontWeight');
  const savedLineHeight = localStorage.getItem('lineHeight');
  const savedFontFamily = localStorage.getItem('fontFamily');
    let textHistory = [];
    let historyIndex = -1;
    let isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    // Load preferences from localStorage or set default values
  loadPreferences();
  
    if (savedFontSize) {
        noteTextarea.css('font-size', savedFontSize + 'px'); // Set font size with "px"
        fontSizeInput.val(savedFontSize);
      }
  
    if (savedFontWeight) {
      noteTextarea.css('font-weight', savedFontWeight);
      fontWeightSelect.val(savedFontWeight);
    }
  
    if (savedLineHeight) {
      noteTextarea.css('line-height', savedLineHeight);
      lineHeightSelect.val(savedLineHeight);
    }
  
    if (savedFontFamily) {
      noteTextarea.css('font-family', savedFontFamily);
      fontFamilySelect.val(savedFontFamily);
    }
  
     // Attach event listeners
  preferencesButton.on('click', togglePreferencesOverlay);
  cancelPreferencesButton.on('click', hidePreferencesOverlay);
  savePreferencesButton.on('click', savePreferences);
  function togglePreferencesOverlay() {
    preferencesOverlay.toggleClass('show');
  }
  function loadPreferences() {
    const savedFontSize = localStorage.getItem('fontSize');
    const savedFontWeight = localStorage.getItem('fontWeight');
    const savedLineHeight = localStorage.getItem('lineHeight');
    const savedFontFamily = localStorage.getItem('fontFamily');

    noteTextarea.css('font-size', savedFontSize ? savedFontSize + 'px' : '20px');
    fontSizeInput.val(savedFontSize || '20');

    noteTextarea.css('font-weight', savedFontWeight || 'normal');
    fontWeightSelect.val(savedFontWeight || 'normal');

    noteTextarea.css('line-height', savedLineHeight || '1');
    lineHeightSelect.val(savedLineHeight || '1');

    noteTextarea.css('font-family', savedFontFamily || 'Arial, sans-serif');
    fontFamilySelect.val(savedFontFamily || 'Arial, sans-serif');
  }

  function hidePreferencesOverlay() {
    preferencesOverlay.removeClass('show');
  }

  function savePreferences() {
    const selectedFontSize = fontSizeInput.val();
    const selectedFontWeight = fontWeightSelect.val();
    const selectedLineHeight = lineHeightSelect.val();
    const selectedFontFamily = fontFamilySelect.val();

    noteTextarea.css({
      'font-size': selectedFontSize + 'px',
      'font-weight': selectedFontWeight,
      'line-height': selectedLineHeight,
      'font-family': selectedFontFamily,
    });

    localStorage.setItem('fontSize', selectedFontSize);
    localStorage.setItem('fontWeight', selectedFontWeight);
    localStorage.setItem('lineHeight', selectedLineHeight);
    localStorage.setItem('fontFamily', selectedFontFamily);

    hidePreferencesOverlay();
  }
    function updateCounts() {
      const content = noteTextarea.val();
      const lines = content.split('\n').length;
      const columns = content.split('\n')[lines - 1].length + 1;
      const characters = content.length;
  
      // Count words while considering new lines
      const words = content
        .split(/\s+/)
        .filter(word => word.trim().length > 0)
        .length;
  
      lineCountSpan.text(`Lines: ${lines}`);
      columnCountSpan.text(`Columns: ${columns}`);
      charCountSpan.text(`Characters: ${characters}`);
      wordCountSpan.text(`Words: ${words}`);
    }
  
    // Save note as text file
    downloadButton.on('click', () => {
      const notesContent = noteTextarea.val();
      if (notesContent) {
        const blob = new Blob([notesContent], { type: 'text/plain' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'notes.txt';
        downloadLink.click();
        URL.revokeObjectURL(downloadLink.href);
      } else {
        alert('Cannot save an empty note.');
      }
    });
  
    // Clear note
    clearButton.on('click', () => {
      noteTextarea.val('');
      localStorage.removeItem('note');
      updateCounts();
    });
  
    // Copy note content to clipboard
    copyButton.on('click', async () => {
      const notesContent = noteTextarea.val();
  
      if (notesContent) {
        try {
          await navigator.clipboard.writeText(notesContent);
          alert('Copied to clipboard!');
        } catch (error) {
          console.error('Failed to copy:', error);
          alert('Failed to copy to clipboard.');
        }
      } else {
        alert('Cannot copy an empty note.');
      }
    });
  
    // Paste from Clipboard
    pasteButton.on('click', async function() {
      try {
        const text = await navigator.clipboard.readText();
        noteTextarea.val(noteTextarea.val() + text);
        updateCounts();
      } catch (error) {
        console.error('Failed to paste content:', error);
      }
    });
  
    // Undo and Redo
    undoButton.on('click', function() {
      if (historyIndex > 0) {
        historyIndex--;
        noteTextarea.val(textHistory[historyIndex]);
        updateCounts();
      }
    });
  
    redoButton.on('click', function() {
      if (historyIndex < textHistory.length - 1) {
        historyIndex++;
        noteTextarea.val(textHistory[historyIndex]);
        updateCounts();
      }
    });
  
    // Open File
    openFileButton.on('click', function() {
      fileInput.click(); // Trigger the hidden file input element
    });
  
    fileInput.on('change', function(event) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
          noteTextarea.val(event.target.result);
          updateCounts();
        };
        reader.readAsText(selectedFile);
      }
    });
  
    // Update counts when content changes
    noteTextarea.on('input', function() {
      updateCounts();
      if (noteTextarea.val() !== textHistory[historyIndex]) {
        textHistory = textHistory.slice(0, historyIndex + 1);
        textHistory.push(noteTextarea.val());
        historyIndex = textHistory.length - 1;
        localStorage.setItem('note', noteTextarea.val()); // Store in local storage
      }
    });
  
    modeToggleButton.on('click', function () {
        isDarkMode = !isDarkMode;
        $('body').toggleClass('dark-mode', isDarkMode);
        noteTextarea.toggleClass('dark-mode', isDarkMode);
    
        if (isDarkMode) {
          modeToggleButton.text('Toggle Dark Mode'); // Changed the text here
        } else {
          modeToggleButton.text('Toggle Light Mode'); // Changed the text here
        }
    
        // Save dark mode state to local storage
        localStorage.setItem('isDarkMode', isDarkMode);
      });
    
      // Set initial dark mode state
      $('body').toggleClass('dark-mode', isDarkMode);
      noteTextarea.toggleClass('dark-mode', isDarkMode);
    
      if (isDarkMode) {
        modeToggleButton.text('Toggle Dark Mode'); // Changed the text here
      } else {
        modeToggleButton.text('Toggle Light Mode'); // Changed the text here
      }
    
      // Load initial note content from local storage
      noteTextarea.val(localStorage.getItem('note') || '');
    
      // Update counts initially
      updateCounts();
    });
// Show About overlay when the "About" button is clicked
$('#openAboutButton').click(function () {
    $('#aboutOverlay').addClass('show');
  });
  
  // Close About overlay when the close button is clicked
  $('#closeAboutButton').click(function () {
    $('#aboutOverlay').removeClass('show');
  });
  
  // Close About overlay when clicking outside the container
  $(document).click(function (e) {
    if (!$(e.target).closest('.about-container').length && !$(e.target).is('#openAboutButton')) {
      $('#aboutOverlay').removeClass('show');
    }
  });
  document.querySelector(".navbar-toggler").addEventListener("click", function () {
    document.querySelector(".navbar-collapse").classList.toggle("show");
  });