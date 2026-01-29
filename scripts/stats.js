const apiKey = '854227dfc2e2c8b4ecfe62d71445ec1fcc8d32bef9fd2a107b11e914630c04d3';
const leagueSelect = document.getElementById('leagueSelect');

// Function to fetch Standings
function fetchStandings(leagueId) {
    const API = `https://apiv2.allsportsapi.com/football/?met=Standings&leagueId=${leagueId}&APIkey=${apiKey}`;

    // Show loading state
    const tbody = document.querySelector("#standingsTable tbody");
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 20px;">Loading standings...</td></tr>`;

    fetch(API)
        .then(response => response.json())
        .then(users => {
            const standings = users.result.total;
            tbody.innerHTML = "";

            // Handle if no standings found
            if (!standings || standings.length === 0) {
                tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 20px;">No standings available for this league.</td></tr>`;
                return;
            }

            for (let i = 0; i < standings.length; i++) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="standing-elements">${standings[i].standing_place}</td>
                    <td class="standing-team">
                        <img src="${standings[i].team_logo || '../imgs/Selection.png'}" width="25" onerror="this.src='../imgs/Selection.png'">
                        ${standings[i].standing_team}
                    </td>
                    <td class="standing-elements">${standings[i].standing_P}</td>
                    <td class="standing-elements">${standings[i].standing_W}</td>
                    <td class="standing-elements">${standings[i].standing_D}</td>
                    <td class="standing-elements">${standings[i].standing_L}</td>
                    <td class="standing-elements">${standings[i].standing_F}</td>
                    <td class="standing-elements">${standings[i].standing_A}</td>
                    <td class="standing-elements">${standings[i].standing_GD}</td>
                    <td class="standing-elements" style="font-weight:bold; color:var(--accent-secondary);">${standings[i].standing_PTS}</td>
                `;
                tbody.appendChild(row);
            }
        })
        .catch(err => {
            console.error(err);
            tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 20px; color:red;">Error loading data.</td></tr>`;
        });
}

// Function to fetch Top Scorers
function fetchTopScorers(leagueId) {
    const top_scorersAPI = `https://apiv2.allsportsapi.com/football/?met=Topscorers&leagueId=${leagueId}&APIkey=${apiKey}`;

    const tcontainer = document.querySelector(".top-players");
    // Preserve header
    tcontainer.innerHTML = `<h3>TOP PLAYERS</h3><p style="text-align:center;">Loading...</p>`;

    fetch(top_scorersAPI)
        .then(response => response.json())
        .then(users => {
            const tstandings = users.result;
            tcontainer.innerHTML = `<h3>TOP PLAYERS</h3>`; // Reset and keep header

            if (!tstandings || tstandings.length === 0) {
                tcontainer.innerHTML += `<p style="text-align:center;">No data available.</p>`;
                return;
            }

            for (let i = 0; i < Math.min(5, tstandings.length); i++) {
                const row1 = document.createElement("div");
                row1.classList.add("top-players-row");
                row1.innerHTML = `
                    <span class="top-player">${tstandings[i].player_name}</span>
                    <span class="top-goal">${tstandings[i].goals} GOAL</span>
                `;
                tcontainer.appendChild(row1);
            }
        })
        .catch(err => {
            console.error(err);
            tcontainer.innerHTML = `<h3>TOP PLAYERS</h3><p style="text-align:center; color:red;">Error.</p>`;
        });
}

// Function to fetch Live Matches (using main.js logic but adapted)
function fetchLiveMatches() {
    // Defaulting to England (44) logic from main.js as 'Live Matches' usually covers major leagues
    // Or we could try to list matches for the selected league?
    // Let's stick to the selected league if possible, OR just global live matches.
    // The previous main.js used countryId=44. Let's try to find live matches for the SELECTED league first.
    // If we use leagueId for Livescore, it works.

    const currentLeagueId = leagueSelect.value;
    // Note: Live matches might be empty for a specific league if no games are on. 
    // Maybe better to fetch global or country based?
    // Let's stick to the user's apparent intent of "Sidebar Live Matches".

    // I will use countryId=44 (England) as a default fallback or maybe just general live scores?
    // The API documentation says we can use leagueId.

    // Let's try to fetch live matches for the SELECTED league.
    const liveMatchesAPI = `https://apiv2.allsportsapi.com/football/?met=Livescore&leagueId=${currentLeagueId}&APIkey=${apiKey}`;

    const lcontainer = document.querySelector(".live-matches");
    // Preserve header
    // lcontainer.innerHTML = `<h3>LIVE MATCHES</h3><p style="text-align:center;">Checking...</p>`;
    // Actually, don't clear it immediately to avoid flickering if we poll.

    fetch(liveMatchesAPI)
        .then(response => response.json())
        .then(users => {
            const lstandings = users.result;

            if (!lstandings || lstandings.length === 0) {
                lcontainer.innerHTML = `<h3>LIVE MATCHES</h3><p style="text-align:center; color:var(--text-secondary); padding:10px;">No live matches currently.</p>`;
                return;
            }

            lcontainer.innerHTML = `<h3>LIVE MATCHES</h3>`;

            for (let i = 0; i < Math.min(5, lstandings.length); i++) {
                const match = lstandings[i];
                const row2 = document.createElement("div");
                row2.classList.add("matches-row");

                const home = match.event_home_team;
                const away = match.event_away_team;
                const score = match.event_final_result;

                row2.innerHTML = `
                    <span class="live-match" style="font-size:0.9rem;">${home} vs ${away}</span>
                    <span class="LIVE" style="font-size:0.7rem;">${score}</span>
                `;
                lcontainer.appendChild(row2);
            }
        });
}

// Event Listener for League Selection
leagueSelect.addEventListener('change', (e) => {
    const leagueId = e.target.value;
    fetchStandings(leagueId);
    fetchTopScorers(leagueId);
    // fetchLiveMatches(); // Optional: maybe live matches for that league?
});

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    const initialLeagueId = leagueSelect.value;
    fetchStandings(initialLeagueId);
    fetchTopScorers(initialLeagueId);
    fetchLiveMatches();
});
