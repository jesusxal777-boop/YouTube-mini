const CLIENT_ID =
  "743766102684-7nchqec23b345frgkkoj7cepmmpou3ad.apps.googleusercontent.com";

let tokenClient = null;
let accessToken = localStorage.getItem("access_token");

window.addEventListener("load", () => {
  initOAuth();
});

function initOAuth() {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,

    scope:
      "https://www.googleapis.com/auth/youtube.readonly openid profile email",

    callback: async (response) => {
      if (!response.access_token) return;

      accessToken = response.access_token;

      localStorage.setItem(
        "access_token",
        accessToken
      );

      await loadGoogleProfile();
    }
  });

  if (loginBtn) {
    loginBtn.onclick = login;
  }

  if (logoutBtn) {
    logoutBtn.onclick = logout;
  }

  if (accessToken) {
    loadGoogleProfile();
  }
}

function login() {
  tokenClient.requestAccessToken();
}

function logout() {
  localStorage.removeItem("access_token");

  const userName =
    document.getElementById("userName");

  const logoutBtn =
    document.getElementById("logoutBtn");

  if (userName) userName.textContent = "";

  if (logoutBtn)
    logoutBtn.style.display = "none";

  location.reload();
}

async function loadGoogleProfile() {
  try {
    const res = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const profile = await res.json();

    const userName =
      document.getElementById("userName");

    const logoutBtn =
      document.getElementById("logoutBtn");

    if (userName) {
      userName.textContent =
        "👤 " + profile.name;
    }

    if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
    }

    console.log("Usuario:", profile);
  } catch (err) {
    console.error(err);
  }
}
