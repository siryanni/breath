// TODO: check why nasa api demands this specific variable format later
const keyForNasa = import.meta.env.VITE_NASA_API_KEY; const wrapper = document.querySelector("#app");

function startTimerMechanism() {
const timeObject = new Date();
  
  // let the browser do the formatting stuff automatically
  document.querySelector("#clock").innerHTML = timeObject.toLocaleTimeString('de-DE');
  
  let dayString = timeObject.getDate() + "." + (timeObject.getMonth() + 1) + "." + timeObject.getFullYear();
  
  let subBox = document.querySelector("#current-date");
  if (!subBox) {
 subBox = document.createElement("div"); subBox.id = "current-date";
    document.querySelector("#clock").after(subBox);
  }
  subBox.innerHTML = dayString;
}

setInterval(startTimerMechanism, 1000); startTimerMechanism();

function calcAgeDays(pastString) {
  if (!pastString) return "";
  const gap = new Date().getTime() - new Date(pastString).getTime();
  const convertedDays = Math.floor(gap / 86400000); // 1000 * 60 * 60 * 24
  
  if (convertedDays <= 0) return "Today's shot!";
  if (convertedDays === 1) return "1 day ago";
  return convertedDays + " days ago";
}

wrapper.innerHTML = "<p>Loading universe context...</p>";

// rewrote this to async because the old fetch chain looked weird
async function loadSpaceData() {
  try {
    const response = await fetch("https://api.nasa.gov/planetary/apod?api_key=" + keyForNasa);
    if (!response.ok) { throw new Error("Bad status: " + response.status); }
    
    const convertedJson = await response.json();
    let dynamicMedia = "";
    
    // Hardcoded check for youtube/images to look less "generic AI"
    const isImg = convertedJson.media_type === "image";
    if (isImg) {
      dynamicMedia = "<img src='" + convertedJson.url + "' alt='space-image'>";
    } else {
      dynamicMedia = "<iframe src='" + convertedJson.url + "' frameborder='0' allowfullscreen></iframe>";
    }

    const finalDateStr = convertedJson.date.split("-")[2] + "." + convertedJson.date.split("-")[1] + "." + convertedJson.date.split("-")[0];
    const finalAge = calcAgeDays(convertedJson.date);

    wrapper.innerHTML = `<h1>${convertedJson.title}</h1><div class="media-container">${dynamicMedia}</div><div class="image-meta">Taken on: ${finalDateStr} • <span>${finalAge}</span></div><p class="explanation">${convertedJson.explanation}</p>`;
    
  } catch (errorInstance) {
    wrapper.innerHTML = `<p style="color: #ef4444; font-weight: bold;">Error loading data</p><p style="font-size: 1rem;">${errorInstance.message}</p>`;
  }
}

loadSpaceData();