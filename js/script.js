console.log("Let's play the music")
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {

    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;

}


async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")

    div.innerHTML = response;

    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {

        const element = as[index];

        if (element.href.endsWith(".mp3")) {

            songs.push(element.href.split(`/${folder}/`)[1])

        }
    }    

    // show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""

    for (const song of songs) {

        songUL.innerHTML = songUL.innerHTML +
            `<li> 
                             <img src="img/music.svg" alt="">
                             <div class="info">
                                 <div> ${song.replaceAll("%20", " ")} </div>
                            </div>
                            <img class="playNow" src="img/play.svg" alt="">
                        </li>`;

    }

    //Attatch an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", () => {

            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })

    })
    return songs;
}


const playMusic = (track, pause = false) => {

    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track

    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }

    document.querySelector(".songInfo").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"

    // currentSong.pause()

}

async function displayAlbum() {
    let a = await fetch(`/songs/`)
    let response = await a.text()

    console.log(response)

    let div = document.createElement("div")

    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".card-container")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

    if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
        let folder = e.href.split("/").slice(-2)[0]

        //get the meta data of the folder

        let a = await fetch(`/songs/${folder}/info.json`)
        let response = await a.json();

        cardContainer.innerHTML = cardContainer.innerHTML +

            `<div data-folder="${folder}" class="card">
                        <div  class="play">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
                            <!-- Purple background circle -->
                            <circle cx="12" cy="12" r="10" fill="#ae3dff" />

                            <!-- Existing path -->
                            <path
                                d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z"
                                stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round" fill="white" />
                        </svg>
                    </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>  
                    </div>`
    }
}
    // load the playlist when the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })

}



async function main() {

    // get the list of all songs
    await getSongs("songs/phonk")
    playMusic(songs[1], true)

    //display all the albums on the page
    await displayAlbum()


    //Attatch an event listner to play , next and previious songs
    play.addEventListener("click", () => {

        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }

        else {

            currentSong.pause()
            play.src = "img/play.svg"

        }

    })

    //listen for time update event

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/
                                                        ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"

    })

    //add an event listner to seek bar
    document.querySelector(".seekBar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration) * percent / 100
    })

    //add an event listner for hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })


    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".right").style.display = "none"
    })

    //add an event listner for closing the left tab

    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-140%"
    })

    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".right").style.display = "block"
    })

    //add an event listner to previous and next

    back.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //add an event to volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })

}

main()   