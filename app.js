const API_KEY = "AIzaSyAd5bMmqELGGSTLifNscPTxPyeTaqcV04M";

// =======================
// ELEMENTOS (seguros)
// =======================
const results = document.getElementById("results");
const player = document.getElementById("player");

// =======================
// NAVIGATION (OBLIGATORIO)
// =======================
function goSearch() {
  window.location.href = "search.html";
}

function goHistory() {
  window.location.href = "history.html";
}

function goHome() {
  window.location.href = "index.html";
}

// =======================
// HISTORY
// =======================
function saveHistory(id, title) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.unshift({ id, title });
  localStorage.setItem("history", JSON.stringify(history.slice(0, 30)));
}

// =======================
// RENDER VIDEOS
// =======================
function renderVideos(videos) {
  if (!results) return;

  results.innerHTML = "";

  videos.forEach(video => {
    const id = video.id.videoId || video.id;
    const title = video.snippet.title;
    const thumb = video.snippet.thumbnails.medium.url;

    results.innerHTML += `
      <div class="card" onclick="playVideo('${id}', \`${title}\`)">
        <img src="${thumb}">
        <p>${title}</p>
      </div>
    `;
  });
}

// =======================
// TRENDING (HOME)
// =======================
async function loadTrending() {
  if (!results) return;

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=12&regionCode=MX&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items) {
    results.innerHTML = "<p>Error cargando videos 😢</p>";
    console.error(data);
    return;
  }

  renderVideos(data.items);
}

// =======================
// SEARCH PAGE
// =======================
async function loadSearch() {
  if (!results) return;

  const q = localStorage.getItem("lastQuery") || "";

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&type=video&maxResults=12&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items) {
    results.innerHTML = "<p>Error en búsqueda 😢</p>";
    console.error(data);
    return;
  }

  renderVideos(data.items);
}

// =======================
// VIDEO PLAYER (FIX CRÍTICO)
// =======================
function playVideo(id, title) {
  saveHistory(id, title);

  // si estás en index/search/history sin player → redirige a play.html
  const playerDiv = document.getElementById("player");

  if (!playerDiv) {
    localStorage.setItem("video", JSON.stringify({ id, title }));
    window.location.href = "play.html";
    return;
  }

  playerDiv.innerHTML = `
    <div class="modal" onclick="closePlayer(event)">
      <div class="modal-content">
        <iframe
          width="100%"
          height="400"
          src="https://www.youtube.com/embed/${id}?autoplay=1"
          frameborder="0"
          allowfullscreen>
        </iframe>
      </div>
    </div>
  `;
}

// =======================
// CLOSE PLAYER
// =======================
function closePlayer(e) {
  const playerDiv = document.getElementById("player");

  if (e.target.classList.contains("modal")) {
    if (playerDiv) playerDiv.innerHTML = "";
  }
}

// =======================
// HISTORY PAGE
// =======================
function loadHistory() {
  if (!results) return;

  const history = JSON.parse(localStorage.getItem("history")) || [];

  results.innerHTML = "<h2>Historial</h2>";

  history.forEach(v => {
    results.innerHTML += `
      <div class="card" onclick="playVideo('${v.id}', \`${v.title}\`)">
        <p>${v.title}</p>
      </div>
    `;
  });
}

// =======================
// PLAY PAGE
// =======================
function loadVideoPage() {
  const video = JSON.parse(localStorage.getItem("video"));
  const playerDiv = document.getElementById("player");

  if (!video || !playerDiv) return;

  playerDiv.innerHTML = `
    <h2>${video.title}</h2>
    <iframe width="100%" height="400"
      src="https://www.youtube.com/embed/${video.id}?autoplay=1"
      frameborder="0"
      allowfullscreen>
    </iframe>
  `;
}
