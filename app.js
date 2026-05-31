const API_KEY = "AIzaSyAd5bMmqELGGSTLifNscPTxPyeTaqcV04M";

const results = document.getElementById("results");
const player = document.getElementById("player");

window.onload = () => {
  loadTrending();
};

// =========================
// SEARCH
// =========================
async function searchVideos() {
  const query = document.getElementById("search").value;

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=12&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items) {
    results.innerHTML = "<p>Error en búsqueda 😢</p>";
    console.error(data);
    return;
  }

  showVideos(data.items);
}

// =========================
// TRENDING
// =========================
async function loadTrending() {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=12&regionCode=MX&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items) {
    results.innerHTML = "<p>Error cargando videos 😢</p>";
    console.error(data);
    return;
  }

  showVideos(data.items);
}

// =========================
// RENDER VIDEOS (FIXED)
// =========================
function showVideos(videos) {
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

// =========================
// HISTORY
// =========================
function saveHistory(id, title) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.unshift({ id, title });
  localStorage.setItem("history", JSON.stringify(history.slice(0, 30)));
}

function showHistory() {
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

// =========================
// PLAYER
// =========================
function playVideo(id, title) {
  saveHistory(id, title);

  player.innerHTML = `
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

function closePlayer(e) {
  if (e.target.classList.contains("modal")) {
    player.innerHTML = "";
  }
}
