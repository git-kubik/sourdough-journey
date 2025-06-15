// Recipe Calendar Generator
class RecipeCalendar {
    constructor(containerId, recipeName, recipeSteps, recipeUrl) {
        this.container = document.getElementById(containerId);
        this.recipeName = recipeName;
        this.recipeSteps = recipeSteps;
        this.recipeUrl = recipeUrl || this.generateRecipeUrl(recipeName);
        this.selectedDate = new Date();
        this.selectedTime = '08:00';
        this.timeline = [];
        this.baseUrl = 'https://baker.kubik.au';
        this.init();
    }

    generateRecipeUrl(recipeName) {
        // Convert recipe name to URL-friendly format
        const urlPath = recipeName.toLowerCase()
            .replace(/'/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return `/recipes/${urlPath}`;
    }

    init() {
        this.render();
        this.calculateTimeline();
        this.updatePreview();
    }

    render() {
        this.container.innerHTML = `
            <div class="recipe-calendar">
                <div class="calendar-header">
                    <h3 class="calendar-title">
                        📅 Schedule Your ${this.recipeName}
                    </h3>
                </div>

                <div class="calendar-controls">
                    <div class="calendar-control-group">
                        <label for="recipe-date-${this.container.id}">Baking Date</label>
                        <input type="date" id="recipe-date-${this.container.id}" class="calendar-input" value="${this.formatDate(this.selectedDate)}">
                    </div>
                    <div class="calendar-control-group">
                        <label for="recipe-time-${this.container.id}">Start Time</label>
                        <input type="time" id="recipe-time-${this.container.id}" class="calendar-input" value="${this.selectedTime}">
                    </div>
                </div>

                <div class="schedule-preview">
                    <div class="schedule-header">
                        <span>Baking Timeline</span>
                        <span class="schedule-date" id="schedule-date-${this.container.id}"></span>
                    </div>
                    <div class="schedule-timeline" id="timeline-${this.container.id}">
                        <!-- Timeline will be populated here -->
                    </div>
                </div>

                <div class="download-section">
                    <button class="download-button" id="download-btn-${this.container.id}">
                        📥 Download Calendar (.ics)
                    </button>
                    <div class="download-info">
                        Downloads a calendar file that you can import into Google Calendar, Outlook, Apple Calendar, or any calendar app
                    </div>
                    <div class="timezone-display" id="timezone-${this.container.id}">
                        Using your local timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const dateInput = document.getElementById(`recipe-date-${this.container.id}`);
        const timeInput = document.getElementById(`recipe-time-${this.container.id}`);
        const downloadBtn = document.getElementById(`download-btn-${this.container.id}`);

        dateInput.addEventListener('change', (e) => {
            this.selectedDate = new Date(e.target.value);
            this.calculateTimeline();
            this.updatePreview();
        });

        timeInput.addEventListener('change', (e) => {
            this.selectedTime = e.target.value;
            this.calculateTimeline();
            this.updatePreview();
        });

        downloadBtn.addEventListener('click', () => {
            this.downloadICS();
        });
    }

    calculateTimeline() {
        this.timeline = [];
        const [hours, minutes] = this.selectedTime.split(':').map(Number);
        let currentDateTime = new Date(this.selectedDate);
        currentDateTime.setHours(hours, minutes, 0, 0);

        this.recipeSteps.forEach((step, index) => {
            const event = {
                time: new Date(currentDateTime),
                activity: step.activity,
                duration: step.duration || '',
                type: step.type || 'action', // 'action', 'phase', 'milestone'
                description: step.description || ''
            };

            this.timeline.push(event);

            // Calculate next step time
            if (step.durationMinutes && index < this.recipeSteps.length - 1) {
                currentDateTime = new Date(currentDateTime.getTime() + (step.durationMinutes * 60000));
            }
        });
    }

    updatePreview() {
        const scheduleDate = document.getElementById(`schedule-date-${this.container.id}`);
        const timelineContainer = document.getElementById(`timeline-${this.container.id}`);

        scheduleDate.textContent = this.formatDateLong(this.selectedDate);

        timelineContainer.innerHTML = this.timeline.map((event, index) => {
            const timeStr = this.formatTime(event.time);
            const typeClass = event.type === 'phase' ? 'timeline-phase' : '';
            
            return `
                <div class="timeline-item ${typeClass}">
                    <div class="timeline-time">${timeStr}</div>
                    <div class="timeline-activity">${event.activity}</div>
                    ${event.duration ? `<div class="timeline-duration">${event.duration}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    formatDateLong(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    formatICSDateTime(date) {
        // Format: YYYYMMDDTHHMMSSZ
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}${month}${day}T${hours}${minutes}${seconds}`;
    }

    generateICS() {
        const now = new Date();
        const uid = `sourdough-${this.recipeName.toLowerCase().replace(/\s+/g, '-')}-${now.getTime()}`;
        
        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//MaK\'s Sourdough Journey//Recipe Calendar//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH'
        ];

        this.timeline.forEach((event, index) => {
            const startTime = this.formatICSDateTime(event.time);
            const endTime = this.formatICSDateTime(new Date(event.time.getTime() + (15 * 60000))); // 15 minutes default duration
            
            const summary = `${this.recipeName}: ${event.activity}`;
            const stepUrl = `${this.baseUrl}${this.recipeUrl}#step-${index + 1}`;
            const description = `${event.description || `Step ${index + 1} in making ${this.recipeName}.`} ${event.duration ? `Duration: ${event.duration}` : ''}\\n\\nView recipe step: ${stepUrl}`;
            
            icsContent.push(
                'BEGIN:VEVENT',
                `UID:${uid}-${index}@sourdough-journey.local`,
                `DTSTART:${startTime}`,
                `DTEND:${endTime}`,
                `SUMMARY:${summary}`,
                `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
                `URL:${stepUrl}`,
                `LOCATION:Kitchen`,
                `CATEGORIES:Baking,Sourdough`,
                'STATUS:CONFIRMED',
                'TRANSP:OPAQUE',
                'END:VEVENT'
            );
        });

        icsContent.push('END:VCALENDAR');
        return icsContent.join('\r\n');
    }

    downloadICS() {
        const icsContent = this.generateICS();
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.recipeName.toLowerCase().replace(/\s+/g, '-')}-${this.formatDate(this.selectedDate)}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Recipe step definitions for different recipes
const RECIPE_SCHEDULES = {
    'classic-white-sourdough': [
        { activity: 'Check starter readiness', type: 'milestone', description: 'Ensure starter has doubled and passes float test' },
        { activity: 'Begin autolyse (flour + water)', duration: '30 minutes', durationMinutes: 30, description: 'Mix flour and water, let rest to develop gluten naturally' },
        { activity: 'Mix dough (add starter & salt)', duration: '10 minutes', durationMinutes: 10, description: 'Add active starter and salt, mix thoroughly' },
        { activity: 'Bulk fermentation begins', type: 'phase', description: 'Begin 4-5 hour bulk fermentation with periodic folding' },
        { activity: 'First coil fold', duration: '2 minutes', durationMinutes: 60, description: 'Perform coil fold technique, cover and rest' },
        { activity: 'Second coil fold', duration: '2 minutes', durationMinutes: 60, description: 'Second fold, notice increased dough strength' },
        { activity: 'Third coil fold', duration: '2 minutes', durationMinutes: 60, description: 'Third fold, dough should feel smoother and stronger' },
        { activity: 'Final coil fold', duration: '2 minutes', durationMinutes: 30, description: 'Last fold, dough should hold shape well' },
        { activity: 'Continue bulk fermentation', duration: '30 minutes', durationMinutes: 30, description: 'Hands-off period, let dough continue developing' },
        { activity: 'Pre-shape', duration: '5 minutes', durationMinutes: 30, description: 'Shape into loose round, bench rest' },
        { activity: 'Final shape', duration: '5 minutes', durationMinutes: 180, description: 'Shape into boule or batard, place in banneton' },
        { activity: 'Preheat oven with Dutch oven', duration: '45 minutes', durationMinutes: -45, description: 'Start preheating oven to 500°F (260°C)' },
        { activity: 'Score and bake', duration: '45 minutes', durationMinutes: 45, description: 'Score dough, bake covered 20 min, uncovered 25 min' },
        { activity: 'Cool completely', duration: '2+ hours', type: 'milestone', description: 'Cool on wire rack before cutting' }
    ],
    
    'beginners-rye-blend': [
        { activity: 'Check starter readiness', type: 'milestone', description: 'Very active starter needed for rye fermentation' },
        { activity: 'Begin autolyse', duration: '30 minutes', durationMinutes: 30, description: 'Mix flours and water, rye feels stickier' },
        { activity: 'Mix dough (wet hands!)', duration: '10 minutes', durationMinutes: 10, description: 'Add starter and salt, use wet hands throughout' },
        { activity: 'Bulk fermentation begins', type: 'phase', description: 'Faster fermentation due to rye enzymes' },
        { activity: 'First fold (wet hands)', duration: '2 minutes', durationMinutes: 45, description: 'Every 45 minutes for rye, wet hands essential' },
        { activity: 'Second fold', duration: '2 minutes', durationMinutes: 45, description: 'Notice different texture from pure wheat' },
        { activity: 'Third fold', duration: '2 minutes', durationMinutes: 30, description: 'Earthy aromas developing' },
        { activity: 'Check fermentation progress', duration: '5 minutes', durationMinutes: 30, description: 'May be ready earlier than wheat dough' },
        { activity: 'Pre-shape (wet hands)', duration: '5 minutes', durationMinutes: 30, description: 'Quick, gentle handling with wet hands' },
        { activity: 'Final shape (wet hands)', duration: '5 minutes', durationMinutes: 150, description: 'Shape with wet hands, into banneton' },
        { activity: 'Preheat oven', duration: '45 minutes', durationMinutes: -45, description: 'Preheat to 500°F (260°C)' },
        { activity: 'Score and bake', duration: '45 minutes', durationMinutes: 45, description: 'Score confidently, bake covered then uncovered' },
        { activity: 'Cool completely', duration: '3+ hours', type: 'milestone', description: 'Rye needs longer cooling time' }
    ],
    
    'sweet-einkorn-loaf': [
        { activity: 'Check starter (very active needed)', type: 'milestone', description: 'Einkorn needs vigorous fermentation help' },
        { activity: 'Extended autolyse', duration: '60 minutes', durationMinutes: 60, description: 'Einkorn needs more time to hydrate fully' },
        { activity: 'Gentle mixing', duration: '10 minutes', durationMinutes: 10, description: 'Add starter, honey, salt - minimal mixing' },
        { activity: 'Bulk fermentation begins', type: 'phase', description: 'Shorter timeline than modern wheat' },
        { activity: 'First gentle fold', duration: '2 minutes', durationMinutes: 60, description: 'Very gentle - einkorn proteins tear easily' },
        { activity: 'Second gentle fold', duration: '2 minutes', durationMinutes: 60, description: 'Don\'t overwork, treat like pastry dough' },
        { activity: 'Check readiness', duration: '5 minutes', durationMinutes: 30, description: '30-50% increase, sweet honeyed aroma' },
        { activity: 'Gentle shaping for pan', duration: '5 minutes', durationMinutes: 120, description: 'Shape gently, place in greased loaf pan' },
        { activity: 'Preheat oven to 375°F', duration: '30 minutes', durationMinutes: -30, description: 'Lower temperature for einkorn' },
        { activity: 'Bake in pan', duration: '40 minutes', durationMinutes: 40, description: 'Bake 35-40 minutes to 200-205°F internal' },
        { activity: 'Cool in pan then rack', duration: '3+ hours', type: 'milestone', description: 'Cool 10 min in pan, then on rack completely' }
    ],
    
    'brown-rice-sourdough': [
        { activity: 'Check GF starter', type: 'milestone', description: 'Very active gluten-free starter essential' },
        { activity: 'Combine dry ingredients', duration: '10 minutes', durationMinutes: 10, description: 'Sift and whisk all flours, starches, xanthan gum' },
        { activity: 'Mix wet ingredients', duration: '5 minutes', durationMinutes: 5, description: 'Combine water, starter, oil, honey' },
        { activity: 'Combine and mix thoroughly', duration: '5 minutes', durationMinutes: 10, description: 'Mix vigorously 2-3 minutes, thick batter consistency' },
        { activity: 'Bulk fermentation begins', type: 'phase', description: 'Extended fermentation for flavor development' },
        { activity: 'First gentle stir', duration: '2 minutes', durationMinutes: 180, description: 'Gentle stirring to redistribute, no folding' },
        { activity: 'Check fermentation progress', duration: '5 minutes', durationMinutes: 180, description: 'Very active bubbling, 50-75% size increase' },
        { activity: 'Pour into prepared pan', duration: '5 minutes', durationMinutes: 180, description: 'Pour into greased 9" loaf pan, smooth surface' },
        { activity: 'Preheat oven to 375°F', duration: '45 minutes', durationMinutes: -45, description: 'Lower temperature for gluten-free' },
        { activity: 'Bake with steam', duration: '60 minutes', durationMinutes: 60, description: 'Bake 50-60 minutes to 205-210°F internal' },
        { activity: 'Cool completely', duration: '4+ hours', type: 'milestone', description: 'Critical: Cool 15 min in pan, then completely on rack' }
    ]
};

// Initialize calendar for a specific recipe
function initRecipeCalendar(containerId, recipeKey, recipeName, recipeUrl) {
    if (RECIPE_SCHEDULES[recipeKey]) {
        new RecipeCalendar(containerId, recipeName, RECIPE_SCHEDULES[recipeKey], recipeUrl);
    } else {
        console.warn(`Recipe schedule not found for: ${recipeKey}`);
    }
}