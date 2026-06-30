// 1. Import the API key from the secure .env environment
const API_KEY = import.meta.env.VITE_NASA_API_KEY;

// 2. Display a loading message immediately so the page is never blank
document.querySelector("#app").innerHTML = "<p>Loading the universe...</p>";

// ==========================================
// 🚀 CUSTOM FEATURE: Interactive Clock & Date
// ==========================================
function updateClock() {
  const now = new Date();
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  document.querySelector("#clock").innerHTML = `${hours}:${minutes}:${seconds}`;
  
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  
  let dateContainer = document.querySelector("#current-date");
  if (!dateContainer) {
    dateContainer = document.createElement("div");
    dateContainer.id = "current-date";
    document.querySelector("#clock").after(dateContainer);
  }
  // Standard international tech date format (YYYY-MM-DD or DD.MM.YYYY)
  dateContainer.innerHTML = `${day}.${month}.${year}`;
}

updateClock();
setInterval(updateClock, 1000);
// ==========================================

// Helper function to calculate the age of the picture
function calculateAge(nasaDateStr) {
  if (!nasaDateStr) return "";
  const photoDate = new Date(nasaDateStr);
  const today = new Date();
  
  const diffTime = Math.abs(today - photoDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Today's shot!";
  } else if (diffDays < 365) {
    return `${diffDays} days ago`;
  } else {
    const years = (diffDays / 365.25).toFixed(1);
    return `${years} years ago`;
  }
}

// 3. Fetch data from the NASA APOD API (Optimized for GitHub Pages)
const url = new URL("https://api.nasa.gov/planetary/apod");
url.searchParams.append("api_key", API_KEY);

fetch(url.toString(), {
  method: "GET",
  headers: {
    "Accept": "application/json"
  }
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`NASA Server downtime or block (${response.status}). Please reload the page shortly!`);
    }
    return response.json();
  })
  .then(data => {
    if (data.error || !data.date) {
      throw new Error(data.error?.message || "Invalid NASA response");
    }

    let media;
    if (data.media_type === "image") {
      media = `<img src="${data.url}" alt="${data.title}"/>`;
    } else if (data.url.includes("youtube.com") || data.url.includes("youtu.be")) {
      media = `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
    } else {
      media = `<video src="${data.url}" controls></video>`;
    }

    const dateParts = data.date.split("-");
    const formattedNasaDate = dateParts.length === 3 ? `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}` : data.date;
    const imageAge = calculateAge(data.date);

    document.querySelector("#app").innerHTML = `
      <h1>${data.title}</h1>
      <div class="media-container">${media}</div>
      <div class="image-meta">Taken on: ${formattedNasaDate} • <span>${imageAge}</span></div>
      <p class="explanation">${data.explanation}</p>
    `;
  })
  .catch(err => {
    document.querySelector("#app").innerHTML = `
      <p style="color: #ef4444; font-weight: bold;">⚠️ Error in orbit</p>
      <p style="font-size: 1rem; margin-top: 0.5rem;">${err.message}</p>
    `;
  });