// Video Call Page Functionality

let canvas, ctx;
let isDrawing = false;
let currentTool = 'pen';
let drawingColor = '#ffffff';
let drawingSize = 3;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize whiteboard canvas
    canvas = document.getElementById('whiteboard');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Canvas drawing events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
    
    // Control buttons
    document.querySelectorAll('.participant-controls .control-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            updateButtonIcon(this);
        });
    });
    
    // End session button
    const endBtn = document.querySelector('.end-btn');
    if (endBtn) {
        endBtn.addEventListener('click', function() {
            if (confirm('¿Deseas terminar la sesión?')) {
                window.location.href = 'alumnos.html';
            }
        });
    }
});

function resizeCanvas() {
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Redraw background
    ctx.fillStyle = 'rgba(26, 31, 74, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function startDrawing(e) {
    if (e.button !== 0) return; // Only left mouse button
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (currentTool === 'pen') {
        ctx.strokeStyle = drawingColor;
        ctx.lineWidth = drawingSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineTo(x, y);
        ctx.stroke();
    } else if (currentTool === 'eraser') {
        ctx.clearRect(x - drawingSize, y - drawingSize, drawingSize * 2, drawingSize * 2);
    }
}

function stopDrawing() {
    if (isDrawing) {
        ctx.closePath();
        isDrawing = false;
    }
}

function handleTouch(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    if (e.type === 'touchstart') {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else if (e.type === 'touchmove') {
        e.preventDefault();
        if (currentTool === 'pen') {
            ctx.strokeStyle = drawingColor;
            ctx.lineWidth = drawingSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineTo(x, y);
            ctx.stroke();
        } else if (currentTool === 'eraser') {
            ctx.clearRect(x - drawingSize, y - drawingSize, drawingSize * 2, drawingSize * 2);
        }
    }
}

function setDrawingTool(tool) {
    currentTool = tool;
    
    // Update button states
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.closest('.tool-btn').classList.add('active');
    
    console.log('Drawing tool changed to:', tool);
}

function clearWhiteboard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log('Whiteboard cleared');
}

function updateButtonIcon(btn) {
    // Add logic to update button appearance based on state
    const icon = btn.querySelector('i');
    if (btn.classList.contains('mic-btn')) {
        icon.className = btn.classList.contains('active') 
            ? 'fas fa-microphone' 
            : 'fas fa-microphone-slash';
    } else if (btn.classList.contains('camera-btn')) {
        icon.className = btn.classList.contains('active') 
            ? 'fas fa-video' 
            : 'fas fa-video-slash';
    }
}
