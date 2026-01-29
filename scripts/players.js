const leagueId = '152';
const countryId = '44'; // England
const apiKey = '854227dfc2e2c8b4ecfe62d71445ec1fcc8d32bef9fd2a107b11e914630c04d3';
const apiUrl = `https://apiv2.allsportsapi.com/football/?met=Teams&leagueId=${leagueId}&APIkey=${apiKey}`;
const liveurl = `https://apiv2.allsportsapi.com/football/?met=Livescore&countryId=${countryId}&APIkey=${apiKey}`;

// Get DOM elements
const playersGrid = document.getElementById('playersGrid');
const searchInput = document.getElementById('searchInput');
const positionFilter = document.getElementById('positionFilter');
const teamFilter = document.getElementById('teamFilter');
const sortSelect = document.getElementById('sortSelect');
const matchList = document.querySelector('.match-list');

// Store all players globally
let allPlayers = [];
let filteredPlayers = [];
let isLoading = true;

// Default placeholder image (1x1 transparent pixel with player icon)
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23374151"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23fff" font-size="40"%3E?%3C/text%3E%3C/svg%3E';

// Show loading skeleton
function showLoadingSkeleton() {
    const skeletons = Array(12).fill(null).map(() => `
        <div class="player-card skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-text" style="width: 60%; height: 20px; margin: 10px auto; background: #374151; border-radius: 4px;"></div>
            <div class="skeleton-text" style="width: 40%; height: 15px; margin: 10px auto; background: #374151; border-radius: 4px;"></div>
            <div class="skeleton-text" style="width: 80%; height: 45px; margin: 15px auto; background: #374151; border-radius: 4px;"></div>
            <div class="skeleton-text" style="width: 100%; height: 40px; margin: 10px auto; background: #374151; border-radius: 4px;"></div>
        </div>
    `).join('');
    playersGrid.innerHTML = skeletons;
}

// Fetch and display players
function getPlayers() {
    showLoadingSkeleton();

    fetch(apiUrl)
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then((data) => {
            if (!data || !data.result) {
                throw new Error("Invalid API response format");
            }

            const teams = data.result;
            allPlayers = [];

            if (Array.isArray(teams)) {
                teams.forEach(team => {
                    if (team.players && Array.isArray(team.players)) {
                        team.players.forEach(p => {
                            allPlayers.push({
                                name: p.player_name || 'Unknown',
                                position: p.player_type || 'Unknown',
                                goals: parseInt(p.player_goals) || 0,
                                assists: parseInt(p.player_assists) || 0,
                                apps: parseInt(p.player_match_played) || 0,
                                image: p.player_image,
                                team: team.team_name || 'Unknown',
                                teamLogo: team.team_logo || '',
                                yellowCards: parseInt(p.player_yellow_cards) || 0,
                                redCards: parseInt(p.player_red_cards) || 0,
                                nationality: p.player_country || 'Unknown',
                                number: p.player_number || '-',
                                age: p.player_age || '-',
                                isInjured: p.player_injured === 'Yes'
                            });
                        });
                    }
                });
            }

            // Populate filters and display
            populatePositionFilter();
            populateTeamFilter();

            filteredPlayers = [...allPlayers];
            isLoading = false;
            displayPlayers(filteredPlayers);
        })
        .catch((error) => {
            console.error("Error fetching players:", error);
            if (playersGrid) {
                playersGrid.innerHTML = `<p style="text-align: center; color: #ff6b6b; grid-column: 1 / -1; padding: 40px;">
                    <i class="fa-solid fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 15px;"></i><br>
                    Error loading players.<br>
                    <span style="font-size: 0.8em; color: #aaa;">${error.message}</span>
                </p>`;
            }
            isLoading = false;
        });
}

// Helper function to populate generic dropdowns
function populateDropdown(selectElement, items, defaultText) {
    if (!selectElement) return;

    // Sort items alphabetically
    items.sort();

    selectElement.innerHTML = `<option value="">${defaultText}</option>` +
        items.map(item => `<option value="${item}">${item}</option>`).join('');
}

function populatePositionFilter() {
    const positions = [...new Set(allPlayers.map(p => p.position).filter(p => p !== 'Unknown'))];
    populateDropdown(positionFilter, positions, 'All Positions');
}

function populateTeamFilter() {
    const teams = [...new Set(allPlayers.map(p => p.team).filter(t => t !== 'Unknown'))];
    populateDropdown(teamFilter, teams, 'Filter by Team');
}

// Display players with optimized image loading
function displayPlayers(players) {
    if (players.length === 0) {
        playersGrid.innerHTML = `<p style="text-align: center; color: #9ca3af; grid-column: 1 / -1; padding: 40px;">
            <i class="fa-solid fa-user-slash" style="font-size: 48px; margin-bottom: 15px;"></i><br>
            No players found matching your criteria.<br>
            <small style="color: #6b7280;">Try adjusting your filters</small>
        </p>`;
        return;
    }

    playersGrid.innerHTML = players.map(p => {
        // Use placeholder if image is missing or invalid
        const playerImage = (p.image && p.image.trim() !== '') ? p.image : PLACEHOLDER_IMAGE;
        const positionClass = p.position?.toLowerCase().replace(/\s+/g, '-') || 'unknown';
        const injuryBadge = p.isInjured ? '<span class="injury-badge" title="Injured"><i class="fa-solid fa-user-injured"></i></span>' : '';

        return `
        <div class="player-card">
            <div class="player-header-info">
                <span class="player-number">#${p.number}</span>
                <span class="player-age">${p.age} yrs</span>
            </div>
            <img class="player-img" 
                 src="${playerImage}" 
                 alt="${p.name}"
                 loading="lazy"
                 onerror="this.onerror=null; this.src='${PLACEHOLDER_IMAGE}';">
            <h3>${p.name} ${injuryBadge}</h3>
            <span class="position ${positionClass}">${p.position || 'Unknown'}</span>
            <div class="team-info">
                <img class="team-logo" 
                     src="${p.teamLogo}" 
                     alt="${p.team}" 
                     loading="lazy"
                     onerror="this.style.display='none'" />
                <span class="team-name">${p.team}</span>
            </div>
            
            <div class="player-details-grid">
                 <div class="stat-box">
                    <span class="label">Matches</span>
                    <span class="value">${p.apps}</span>
                 </div>
                 <div class="stat-box">
                    <span class="label">Goals</span>
                    <span class="value">${p.goals}</span>
                 </div>
                 <div class="stat-box">
                    <span class="label">Assists</span>
                    <span class="value">${p.assists}</span>
                 </div>
            </div>

            <div class="cards-container">
                ${p.yellowCards > 0 ? `<span class="card-pill yellow" title="Yellow Cards"><i class="fa-solid fa-square"></i> ${p.yellowCards}</span>` : ''}
                ${p.redCards > 0 ? `<span class="card-pill red" title="Red Cards"><i class="fa-solid fa-square"></i> ${p.redCards}</span>` : ''}
            </div>
        </div>
    `}).join('');

    // Lazy load images after rendering
    lazyLoadImages();
}

// Lazy load images to prevent layout shift
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Filter and sort players
function filterAndSortPlayers() {
    if (isLoading) return; // Don't filter while loading

    let result = [...allPlayers];

    // Search by name
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        result = result.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    // Filter by position (exact match)
    const selectedPosition = positionFilter.value;
    if (selectedPosition) {
        result = result.filter(p => p.position === selectedPosition);
    }

    // Filter by team
    const selectedTeam = teamFilter.value;
    if (selectedTeam) {
        result = result.filter(p => p.team === selectedTeam);
    }

    // Sort
    const sortBy = sortSelect.value;
    if (sortBy) {
        result.sort((a, b) => b[sortBy] - a[sortBy]);
    }

    filteredPlayers = result;
    displayPlayers(filteredPlayers);
}

// Add event listeners for filters
searchInput.addEventListener('input', filterAndSortPlayers);
positionFilter.addEventListener('change', filterAndSortPlayers);
teamFilter.addEventListener('change', filterAndSortPlayers);
sortSelect.addEventListener('change', filterAndSortPlayers);

// Fetch and display live matches
function getLiveMatches() {
    if (!matchList) return;

    fetch(liveurl)
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then((data) => {
            if (!data.result || data.result.length === 0) {
                matchList.innerHTML = `<p style="text-align: center; color: #6b7280; padding: 10px; font-size: 13px;">No live matches</p>`;
                return;
            }

            const matches = data.result.slice(0, 10); // Limit to 10 matches
            matchList.innerHTML = matches.map(match => {
                const homeTeam = match.event_home_team || 'Home';
                const awayTeam = match.event_away_team || 'Away';
                const homeScore = match.event_final_result?.split(' - ')[0] || '';
                const awayScore = match.event_final_result?.split(' - ')[1] || '';
                const status = match.event_status || '';
                const time = match.event_time || '';

                let statusDisplay = '';
                if (status.includes('Finished')) {
                    statusDisplay = `FT (${homeScore}-${awayScore})`;
                } else if (status.includes('Half Time')) {
                    statusDisplay = `HT (${homeScore}-${awayScore})`;
                } else if (time) {
                    statusDisplay = `${time}'`;
                } else {
                    statusDisplay = 'LIVE';
                }

                return `
                    <div class="match-item">
                        <i class="fa-solid fa-futbol"></i>
                        <span>${homeTeam} vs ${awayTeam} - ${statusDisplay}</span>
                    </div>
                `;
            }).join('');
        })
        .catch((error) => {
            console.error("Error fetching live matches:", error);
            if (matchList) {
                matchList.innerHTML = `<p style="text-align: center; color: #6b7280; padding: 10px; font-size: 13px;">Unable to load</p>`;
            }
        });
}

// Initialize
getPlayers();
getLiveMatches();

// Refresh live matches every 60 seconds
setInterval(getLiveMatches, 60000);
