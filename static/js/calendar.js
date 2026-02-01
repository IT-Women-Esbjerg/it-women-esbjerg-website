document.addEventListener('DOMContentLoaded', function () {
    // Check if FullCalendar is loaded
    if (typeof FullCalendar === 'undefined') {
        console.error('FullCalendar not loaded');
        return;
    }

    const eventsDataElement = document.getElementById('events-data');
    if (!eventsDataElement) {
        // No events data on this page, skip calendar initialization
        return;
    }

    const escapedEventsText = eventsDataElement.textContent;
    const eventsText = JSON.parse(escapedEventsText);
    const events = JSON.parse(eventsText);

    // Common calendar options
    const calendarOptions = {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev',
            center: 'title',
            right: 'next'
        },
        height: 'auto',
        events: events,
        eventColor: '#f13492',
        eventDisplay: 'block',
        dayMaxEvents: true,
        fixedWeekCount: false,
        showNonCurrentDates: true,
        firstDay: 1, // Monday,
        nowIndicator: true,
        dayCellClassNames: function (arg) {
            // Add class to days that have events
            const dayEvents = events.filter(event => {
                const eventDate = new Date(event.start);
                return eventDate.toDateString() === arg.date.toDateString();
            });
            return dayEvents.length > 0 ? ['fc-day-has-event'] : [];
        },
        dayCellDidMount: function(info) {
            // Add click handler to days with events
            const dayEvents = events.filter(event => {
                const eventDate = new Date(event.start);
                return eventDate.toDateString() === info.date.toDateString();
            });
            
            if (dayEvents.length > 0) {
                info.el.style.cursor = 'pointer';
                // Add title attribute for hover tooltip
                const titles = dayEvents.map(e => e.title).join(', ');
                info.el.title = titles;
                
                info.el.addEventListener('click', function() {
                    // Redirect to the first event on this day
                    if (dayEvents[0].url) {
                        window.location.href = dayEvents[0].url;
                    }
                });
            }
        },
        eventClick: function (info) {
            info.jsEvent.preventDefault();
            console.log('Event clicked:', info.event.title);
            // Redirect to event page
            if (info.event.url) {
                window.location.href = info.event.url;
            }
        }
    };

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const initialDate = `${year}-${month}-${day}`;

    // Initialize first calendar (this month)
    const calendarEl1 = document.getElementById('calendar1');
    if (calendarEl1) {
        const calendar1 = new FullCalendar.Calendar(calendarEl1, {
            ...calendarOptions,
            initialDate: initialDate
        });
        calendar1.render();
    }

    // Initialize second calendar (next month)
    const calendarEl2 = document.getElementById('calendar2');
    if (calendarEl2) {
        const calendar2 = new FullCalendar.Calendar(calendarEl2, {
            ...calendarOptions,
            initialDate: `${year}-${String(today.getMonth() + 2).padStart(2, '0')}-01`
        });
        calendar2.render();
    }
});
