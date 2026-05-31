const API_KEY = "TU_API_KEY_AQUI";

// =========================
// HISTORIAL
// =========================
function saveHistory(id, title) {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  history.unshift({ id, title });

  localStorage.setItem("history", JSON.stringify(history.slice(0, 30)));
}

// =========================
// NAVEGACIÓN ENTRE PÁGINAS
// =========================
function goPage(page) {
  window.location.href = page;
}

function goSearch() {
  const q = document.getElementById("search").value;
  localStorage.setItem("lastQuery", q);
  goPage("search.html");
}

function goHistory() {
  goPage("history.html");
}

function goHome() {
  goPage("index.html");
}

function goPlay(id, title) {
  localStorage.setItem("video", JSON.stringify({ id, title }));
  goPage("play.html");
}

// =========================
// RENDER DE VIDEOS
// =========================
function render(videos) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  videos.forEach(video => {
    const id = video.id.videoId || video.id;
    const title = video.snippet.title;
    const thumb = video.snippet.thumbnails.medium.url;

    container.innerHTML += `
      <div class="card" onclick="goPlay('${id}', \`${title}\`)">
        <img src="${thumb}">
        <p>${title}</p>
      </div>
    `;
  });
}

// =========================
// HOME (TRENDING)
// =========================
async function loadTrending() {
  const container = document.getElementById("results");

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=12&regionCode=MX&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items) {
    container.innerHTML = "<p>Error cargando videos 😢</p>";
    console.error(data);
    return;
  }

  render(data.items);
}

// =========================
// SEARCH PAGE
// =========================
async function loadSearch() {
  const q = localStorage.getItem("lastQuery");

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&type=video&maxResults=12&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  const container = document.getElementById("results");

  if (!data.items) {
    container.innerHTML = "<p>Error en búsqueda 😢</p>";
    console.error(data);
    return;
  }

  render(data.items);
}

// =========================
// VIDEO PAGE
// =========================
function loadVideo() {
  const video = JSON.parse(localStorage.getItem("video"));

  const player = document.getElementById("player");

  if (!video) {
    player.innerHTML = "<p>No video selected</p>";
    return;
  }

  saveHistory(video.id, video.title);

  player.innerHTML = `
    <h2>${video.title}</h2>

    <iframe width="100%" height="400"
      src="https://www.youtube.com/embed/${video.id}?autoplay=1"
      frameborder="0"
      allowfullscreen>
    </iframe>
  `;
}

// =========================
// HISTORY PAGE
// =========================
function loadHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];

  const container = document.getElementById("results");
  container.innerHTML = "";

  history.forEach(v => {
    container.innerHTML += `
      <div class="card" onclick="goPlay('${v.id}', \`${v.title}\`)">
        <p>${v.title}</p>
      </div>
    `;
  });
}
