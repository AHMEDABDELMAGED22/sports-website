const leagueId = '152'; // Premier League
const apiKey = '854227dfc2e2c8b4ecfe62d71445ec1fcc8d32bef9fd2a107b11e914630c04d3';

// DOM Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const pastMatchesContainer = document.getElementById('pastMatches');
const liveMatchesContainer = document.getElementById('liveMatches');
const upcomingMatchesContainer = document.getElementById('upcomingMatches');

// Date utilities
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateString) {
    const date = new Date(dateString);
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(timeString) {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Extract HH:MM
}

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;

        // Remove active class from all tabs and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// Fetch Past Matches (last 30 days)
async function fetchPastMatches() {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const url = `https://apiv2.allsportsapi.com/football/?met=Fixtures&APIkey=${apiKey}&leagueId=${leagueId}&from=${formatDate(thirtyDaysAgo)}&to=${formatDate(today)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.result && data.result.length > 0) {
            // Filter only finished matches and sort by date (most recent first)
            const finishedMatches = data.result
                .filter(match => match.event_status === 'Finished')
                .sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
                .slice(0, 20); // Limit to 20 matches

            displayMatches(finishedMatches, pastMatchesContainer, 'past');
        } else {
            showEmptyState(pastMatchesContainer, 'No past matches found', 'clock-rotate-left');
        }
    } catch (error) {
        console.error('Error fetching past matches:', error);
        showError(pastMatchesContainer, 'Failed to load past matches');
    }
}

// Fetch Live Matches
async function fetchLiveMatches() {
    const url = `https://apiv2.allsportsapi.com/football/?met=Livescore&APIkey=${apiKey}&leagueId=${leagueId}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.result && data.result.length > 0) {
            displayMatches(data.result, liveMatchesContainer, 'live');
        } else {
            showEmptyState(liveMatchesContainer, 'No live matches at the moment', 'circle-dot');
        }
    } catch (error) {
        console.error('Error fetching live matches:', error);
        showError(liveMatchesContainer, 'Failed to load live matches');
    }
}

// Fetch Upcoming Matches (next 30 days)
async function fetchUpcomingMatches() {
    const today = new Date();
    const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const url = `https://apiv2.allsportsapi.com/football/?met=Fixtures&APIkey=${apiKey}&leagueId=${leagueId}&from=${formatDate(today)}&to=${formatDate(thirtyDaysLater)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.result && data.result.length > 0) {
            // Filter only upcoming matches (not started yet) and sort by date
            const upcomingMatches = data.result
                .filter(match => match.event_status === '' || match.event_status.includes('Not Started'))
                .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
                .slice(0, 20); // Limit to 20 matches

            displayMatches(upcomingMatches, upcomingMatchesContainer, 'upcoming');
        } else {
            showEmptyState(upcomingMatchesContainer, 'No upcoming matches scheduled', 'calendar-days');
        }
    } catch (error) {
        console.error('Error fetching upcoming matches:', error);
        showError(upcomingMatchesContainer, 'Failed to load upcoming matches');
    }
}

// Display matches
function displayMatches(matches, container, type) {
    container.innerHTML = '';

    matches.forEach(match => {
        const matchCard = createMatchCard(match, type);
        container.appendChild(matchCard);
    });
}

// Create match card element
function createMatchCard(match, type) {
    const card = document.createElement('div');
    card.className = 'match-card';

    // Determine score display
    let homeScore = '-';
    let awayScore = '-';
    let statusText = '';
    let statusClass = '';

    if (type === 'past') {
        const result = match.event_ft_result ? match.event_ft_result.split(' - ') : ['0', '0'];
        homeScore = result[0] || '0';
        awayScore = result[1] || '0';
        statusText = 'Full Time';
        statusClass = 'status-finished';
    } else if (type === 'live') {
        const result = match.event_final_result ? match.event_final_result.split(' - ') : ['0', '0'];
        homeScore = result[0] || '0';
        awayScore = result[1] || '0';
        statusText = match.event_status || 'LIVE';
        statusClass = 'status-live';
    } else {
        homeScore = '';
        awayScore = '';
        statusText = match.event_time ? `${formatTime(match.event_time)}` : 'TBD';
        statusClass = 'status-upcoming';
    }

    card.innerHTML = `
        <div class="match-header">
            <div class="match-date">
                <i class="fa-solid fa-calendar"></i>
                ${formatDisplayDate(match.event_date)}
            </div>
            <div class="match-status ${statusClass}">
                ${statusText}
            </div>
        </div>
        
        <div class="match-body">
            <div class="team">
                <img src="${match.home_team_logo}" alt="${match.event_home_team}" class="team-logo" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23374151%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'">
                <div class="team-name">${match.event_home_team}</div>
            </div>
            
            <div class="match-score">
                ${type === 'upcoming'
            ? `<div class="vs-text">VS</div>
                       <div class="match-time">
                           <i class="fa-solid fa-clock"></i>
                           ${match.event_time ? formatTime(match.event_time) : 'TBD'}
                       </div>`
            : `<div class="score">
                           ${homeScore} <span class="score-separator">:</span> ${awayScore}
                       </div>`
        }
            </div>
            
            <div class="team">
                <img src="${match.away_team_logo}" alt="${match.event_away_team}" class="team-logo" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23374151%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'">
                <div class="team-name">${match.event_away_team}</div>
            </div>
        </div>
        
        ${type === 'past' && match.event_stadium ? `
        <div class="match-details">
            <div class="match-detail-item">
                <i class="fa-solid fa-location-dot"></i>
                ${match.event_stadium}
            </div>
        </div>
        ` : ''}
    `;

    return card;
}

// Show empty state
function showEmptyState(container, message, icon) {
    container.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-${icon}"></i>
            <h3>${message}</h3>
            <p>Check back later for updates</p>
        </div>
    `;
}

// Show error state
function showError(container, message) {
    container.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-exclamation-triangle"></i>
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;
}

// Initialize - Load all matches
async function init() {
    await Promise.all([
        fetchPastMatches(),
        fetchLiveMatches(),
        fetchUpcomingMatches()
    ]);
}

// Start the app
init();

// Auto-refresh live matches every 60 seconds
setInterval(fetchLiveMatches, 60000);
