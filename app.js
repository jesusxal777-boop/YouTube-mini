const API_KEY = "AIzaSyAd5bMmqELGGSTLifNscPTxPyeTaqcV04M";

const results = document.getElementById("results");
const player = document.getElementById("player");
window.onload = () => {
  loadTrending();
};

// 🔎 Buscar videos
async function searchVideos() {
  const query = document.getElementById("search").value;

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=12&key=${API_KEY}`;

  const data = await fetch(url).then(res => res.json());

  showVideos(data.items);
}

// 🔥 Tendencias (home feed)
async function loadTrending() {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=12&regionCode=MX&key=${API_KEY}`;

  const data = await fetch(url).then(res => res.json());
  const data = await fetch(url).then(res => res.json());

if (!data.items) {
  results.innerHTML = "<p>Error cargando videos 😢</p>";
  console.error(data);
  return;
}

showVideos(data.items);

  showVideos(data.items);
}

function showHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];

  results.innerHTML = "<h2>Historial</h2>";

  history.forEach(v => {
    results.innerHTML += `
      <div class="card" onclick="playVideo('${v.id}')">
        <p>${v.title}</p>
      </div>
    `;
  });
}

// 📺 Mostrar videos en grid
function showVideos(videos) {
  results.innerHTML = "";

  videos.forEach(video => {
    const id = video.id.videoId || video.id;
    const data = await fetch(url).then(res => res.json());

if (!data.items) {
  results.innerHTML = "<p>Error cargando videos 😢</p>";
  console.error(data);
  return;
}

showVideos(data.items);
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
    document.getElementById("player").innerHTML = "";
  }
}
