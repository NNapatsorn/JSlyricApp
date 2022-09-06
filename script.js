const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

const apiUrl = "https://api.lyrics.ovh";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const songtxt = search.value.trim();
  if (!songtxt) {
    alert("Data incorrect!");
  } else {
    searchLyrics(songtxt);
  }
});

searchLyrics = async (song) => {
  const respond = await fetch(`${apiUrl}/suggest/${song}`);
  const allSongs = await respond.json();
  showData(allSongs);
};

showData = (songs) => {
  result.innerHTML = `
        <ul class="songs">
            ${songs.data
              .map(
                (song) =>
                  `<li>
                    <span>
                        <strong>${song.artist.name}</strong> - ${song.title}
                    </span>
                    <button class="btn"
                    data-artist="${song.artist.name}"
                    data-song="${song.title}">
                        Lyrics
                    </button>
                    </li>`
              )
              .join("")}
        </ul>
    `;
  // console.log(songs);
  if (songs.next || songs.previous) {
    more.innerHTML = `
    ${
      songs.previous
        ? `<button class="btn" onclick="getMoreSongs('${songs.previous}')">Previous</button>`
        : ""
    }
    ${
      songs.next
        ? `<button class="btn" onclick="getMoreSongs('${songs.next}')">Next</button>`
        : ""
    }
    `;
  } else {
    more.innerHTML = "";
  }
};

getMoreSongs = async (songsUrl) => {
  const respond = await fetch(
    `https://cors-anywhere.herokuapp.com/${songsUrl}`
  );
  const allSongs = await respond.json();
  showData(allSongs);
};

result.addEventListener("click", (e) => {
  const clickEL = e.target;

  if (clickEL.tagname == "BUTTON") {
    const artist = clickEL.getAttribute("data-artist");
    const songName = clickEL.getAttribute("data-song");
    getLyrics(artist, songName);
  }
});

getLyrics = async (artist, songName) => {
  const respond = await fetch(`${apiUrl}/v1/${artist}/${songName}`);
  const data = await respond.json();
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

  if (lyrics) {
    result.innerHTML = `
    <h2><span>
        <strong>${artist}</strong> - ${songName}
    </span></h2>
    <span>${lyrics}</span>
  `;
  } else {
    result.innerHTML = `
    <h2><span>
        <strong>${artist}</strong> - ${songName}
    </span></h2>
    <span>No Lyric for this song</span>
  `;
  }
};

more.innerHTML = "";
