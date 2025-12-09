// Funcionalidad para los botones del panel principal

document.addEventListener('DOMContentLoaded', function() {
    // Main page buttons
    const editarBtn = document.querySelector('.btn-editar');
    const cursosBtn = document.querySelector('.btn-cursos');
    const alumnosBtn = document.querySelector('.btn-alumnos');

    // Agregar eventos de click a los botones
    if (editarBtn) {
        editarBtn.addEventListener('click', function() {
            console.log('Ir a editar curso');
            // window.location.href = 'editar-curso.html';
        });
    }

    if (cursosBtn) {
        cursosBtn.addEventListener('click', function() {
            console.log('Ir a mis cursos');
            window.location.href = 'miscursos.html';
        });
    }

    if (alumnosBtn) {
        alumnosBtn.addEventListener('click', function() {
            console.log('Ir a alumnos');
            // window.location.href = 'alumnos.html';
        });
    }

    // Efecto de audio al hacer click (opcional)
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-5px)';
        });

        btn.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-8px)';
        });
    });

    // Course buttons functionality
    const courseButtons = document.querySelectorAll('.course-btn');
    courseButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const courseTitle = this.closest('.course-card').querySelector('.course-title').textContent;
            console.log('Abriendo curso: ' + courseTitle);
            // window.location.href = 'curso-detalle.html?curso=' + courseTitle;
        });
    });

    // Calendar functionality for students page
    initializeCalendar();
    initializeSessions();
});

// Calendar Generation
function initializeCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const monthYear = document.getElementById('monthYear');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');

    if (!calendarDays) return;

    let currentDate = new Date(2025, 11, 1); // December 2025

    const studentsData = [
        { name: 'Carlos González', course: 'Álgebra Básica', color: 'algebra', summary: ['Resolución de ecuaciones lineales', 'Sistemas de ecuaciones 2x2', 'Problemas de aplicación'], day: 1 },
        { name: 'María López', course: 'Geometría Plana', color: 'geometry', summary: ['Figuras geométricas básicas', 'Cálculo de áreas y perímetros', 'Propiedades de triángulos'], day: 3 },
        { name: 'Juan Martínez', course: 'Trigonometría', color: 'trigonometry', summary: ['Funciones trigonométricas', 'Identidades trigonométricas', 'Aplicaciones en ángulos'], day: 5 },
        { name: 'Ana Rodríguez', course: 'Funciones Matemáticas', color: 'functions', summary: ['Funciones lineales y cuadráticas', 'Gráficas de funciones', 'Vértice y raíces'], day: 8 },
        { name: 'Luis García', course: 'Probabilidad y Estadística', color: 'probability', summary: ['Probabilidad básica', 'Cálculo de probabilidades', 'Distribuciones estadísticas'], day: 10 },
        { name: 'Emma Wilson', course: 'Álgebra Básica', color: 'algebra', summary: ['Ecuaciones cuadráticas avanzadas', 'Factorización de polinomios', 'Teorema del binomio'], day: 12 },
        { name: 'Diego Fernández', course: 'Trigonometría', color: 'trigonometry', summary: ['Trigonometría en triángulos rectángulos', 'Ley de senos y cosenos', 'Resolución de triángulos'], day: 15 },
        { name: 'Laura Sánchez', course: 'Probabilidad y Estadística', color: 'probability', summary: ['Estadística descriptiva', 'Medidas de tendencia central', 'Desviación estándar'], day: 17 },
        { name: 'Pablo Gutiérrez', course: 'Funciones Matemáticas', color: 'functions', summary: ['Funciones exponenciales y logarítmicas', 'Ecuaciones exponenciales', 'Aplicaciones financieras'], day: 19 },
        { name: 'Sofía Torres', course: 'Geometría Plana', color: 'geometry', summary: ['Geometría del espacio', 'Volumen de sólidos', 'Superficie de cuerpos geométricos'], day: 22 }
    ];

    // Store student data for click handling
    window.studentsByDay = {};
    studentsData.forEach(student => {
        if (!window.studentsByDay[student.day]) {
            window.studentsByDay[student.day] = [];
        }
        window.studentsByDay[student.day].push(student);
    });

    function renderCalendar() {
        calendarDays.innerHTML = '';
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const prevLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        
        // Convert getDay() to week position (0 = Monday, 6 = Sunday)
        // getDay() returns 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        let firstDayOfWeek = firstDay.getDay();
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Convert to Monday=0
        
        let lastDayOfWeek = lastDay.getDay();
        lastDayOfWeek = lastDayOfWeek === 0 ? 6 : lastDayOfWeek - 1; // Convert to Monday=0
        
        const nextDays = (6 - lastDayOfWeek) % 7; // Days needed to complete the last week

        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        monthYear.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        // Previous month days
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const day = prevLastDay.getDate() - i;
            createDayElement(day, true, null, null);
        }

        // Current month days
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayStudents = window.studentsByDay[day];
            const courseColor = dayStudents ? dayStudents[0].color : null;
            createDayElement(day, false, courseColor, day);
        }

        // Next month days
        for (let day = 1; day <= nextDays; day++) {
            createDayElement(day, true, null, null);
        }
    }

    function createDayElement(day, isOtherMonth, courseColor, actualDay) {
        const dayElement = document.createElement('div');
        dayElement.className = `calendar-day ${isOtherMonth ? 'other-month' : ''} ${courseColor || ''}`;
        
        dayElement.innerHTML = `<div class="day-number">${day}</div>`;
        
        if (actualDay && window.studentsByDay && window.studentsByDay[actualDay]) {
            dayElement.style.cursor = 'pointer';
            dayElement.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Clicked day:', actualDay, 'Students:', window.studentsByDay[actualDay]);
                showDetailedSummary(actualDay);
            });
        }
        
        calendarDays.appendChild(dayElement);
    }

    prevMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
        updateSessions();
    });

    nextMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
        updateSessions();
    });

    renderCalendar();
}

// Show detailed summary for clicked day
function showDetailedSummary(day) {
    console.log('showDetailedSummary called for day:', day);
    
    // Try both element IDs - the bottom one takes priority
    let detailedSection = document.getElementById('detailedSummaryBottom');
    let detailedGrid = document.getElementById('detailedStudentsGridBottom');
    
    if (!detailedSection) {
        detailedSection = document.getElementById('detailedSummary');
        if (detailedSection) {
            detailedGrid = document.getElementById('detailedStudentsGrid');
        }
    }
    
    if (!detailedSection || !detailedGrid) {
        console.error('Detailed summary elements not found');
        console.log('Looking for detailedSummaryBottom:', document.getElementById('detailedSummaryBottom'));
        console.log('Looking for detailedSummary:', document.getElementById('detailedSummary'));
        return;
    }
    
    const students = (window.studentsByDay && window.studentsByDay[day]) || [];
    
    console.log('Students for day', day, ':', students);
    
    if (students.length === 0) {
        console.log('No students found for this day');
        detailedSection.style.display = 'none';
        return;
    }

    const times = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];
    
    detailedGrid.innerHTML = students.map((student, index) => {
        const colorMap = {
            'algebra': '#667eea',
            'geometry': '#0084ff',
            'trigonometry': '#ff6b6b',
            'functions': '#ffa500',
            'probability': '#38ef7d'
        };
        
        return `
            <div class="detailed-student-card">
                <div class="detailed-student-header">
                    <div class="detailed-student-color" style="background-color: ${colorMap[student.color]}"></div>
                    <div class="detailed-student-info">
                        <h4>👤 ${student.name}</h4>
                        <p class="detailed-student-course">${student.course}</p>
                    </div>
                </div>
                <div class="detailed-student-time">
                    <strong>Hora:</strong> ${times[index % times.length]}
                </div>
                <div class="detailed-summary-title" style="margin-top: 12px;">
                    <i class="fas fa-list"></i> Temas a cubrir:
                </div>
                <ul class="detailed-summary-list">
                    ${student.summary.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
    }).join('');
    
    detailedSection.style.display = 'block';
    console.log('Detailed section displayed:', detailedSection);
    setTimeout(() => {
        detailedSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Sessions List Generation
function initializeSessions() {
    updateSessions();
}

function updateSessions() {
    const sessionsList = document.getElementById('sessionsList');
    if (!sessionsList) return;

    const times = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];

    // Get all students from the calendar data
    sessionsList.innerHTML = '';
    let sessionIndex = 0;

    // Iterate through studentsByDay to show sessions for the actual scheduled days
    const sortedDays = Object.keys(window.studentsByDay)
        .map(day => parseInt(day))
        .sort((a, b) => a - b);

    sortedDays.forEach(day => {
        const studentList = window.studentsByDay[day];
        
        studentList.forEach((student, studentIndex) => {
            const time = times[sessionIndex % times.length];
            
            const sessionDate = new Date(2025, 11, day); // December 2025
            
            const isCompleted = sessionIndex > 6; // Last sessions marked as completed
            const sessionCard = document.createElement('div');
            sessionCard.className = `session-card ${student.color}`;
            
            const dateStr = sessionDate.toLocaleDateString('es-ES', { 
                month: 'short', 
                day: 'numeric',
                weekday: 'short'
            });

            const summaryHtml = `
                <div class="session-summary">
                    <div class="summary-title">
                        <i class="fas fa-list"></i> Temas a cubrir:
                    </div>
                    <ul class="summary-list">
                        ${student.summary.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;

            sessionCard.innerHTML = `
                <div class="session-header">
                    <span class="session-course">${student.course}</span>
                    <span class="session-time">${dateStr} ${time}h</span>
                </div>
                <div class="session-student">👤 ${student.name}</div>
                <div class="session-status ${isCompleted ? 'completed' : ''}">
                    <div class="status-indicator"></div>
                    <span class="status-text">${isCompleted ? 'Completada' : 'Pendiente'}</span>
                </div>
                ${summaryHtml}
                ${!isCompleted ? `<button class="start-session-btn" onclick="startSession('${student.course}', '${student.name}')"><i class="fas fa-play"></i> Iniciar Sesión</button>` : ''}
            `;

            sessionsList.appendChild(sessionCard);
            sessionIndex++;
        });
    });
}

function startSession(courseName, studentName) {
    console.log(`Sesión iniciada: ${courseName} - ${studentName}`);
    window.location.href = 'videollamada.html';
}



