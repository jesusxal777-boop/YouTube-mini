const API_KEY = "TU_API_KEY_AQUI";

async function searchVideos() {
  const query = document.getElementById("search").value;

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=10&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  const container = document.getElementById("results");
  container.innerHTML = "";

  data.items.forEach(item => {
    const videoId = item.id.videoId;
    const title = item.snippet.title;
    const thumb = item.snippet.thumbnails.medium.url;

    container.innerHTML += `
      <div class="video">
        <img src="${thumb}" width="100%">
        <p>${title}</p>
        <iframe width="100%" height="200"
          src="https://www.youtube.com/embed/${videoId}">
        </iframe>
      </div>
    `;
  });
}
