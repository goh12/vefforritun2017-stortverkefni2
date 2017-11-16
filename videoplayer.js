const API_URL = "./videos.json";

document.addEventListener('DOMContentLoaded', function() {
    videoplayer.init();
});

var videoplayer = (function() {
    var videocontainer;
    var videoplayer;

    var playbutton;
    var pausebutton;
    var backbutton;
    var nextbutton;
    var mutebutton;
    var unmutebutton;
    var fullscreenbutton;

    function fetchData() {
        const url = new URL(window.location.href);
        const video_id = url.searchParams.get('id');

        var r = new XMLHttpRequest();
        //Set upp beiðni
        r.open('GET', API_URL, true);

        r.onload = function() {
            if(r.status == 200) {
            var results = JSON.parse(r.response);
            const videoInfo = results.videos[video_id];
            createVideoPlayer(videoInfo);
            } else if (r.status >= 400) {

            }
        }

        r.onerror = function() {
            console.log('Óþekkt villa');
        }

        r.send();
    }


    function createVideoPlayer(videoInfo) {

        const heading = document.createElement('h2');
        heading.className = 'videoplayer__heading';
        heading.textContent = videoInfo.title;
        videoplayer = document.createElement('video');
        videoplayer.className = 'videoplayer__view';
        videoplayer.src = videoInfo.video;

        videocontainer.appendChild(heading);
        videocontainer.appendChild(videoplayer);
        setControls();
        videoplayer.play();

    }

    function setControls() {
        playbutton.style.display = 'none';
        unmutebutton.style.display = 'none';

        playbutton.addEventListener('click', playVideo);
        pausebutton.addEventListener('click', pauseVideo);
        backbutton.addEventListener('click', backVideo);
        nextbutton.addEventListener('click', forwardVideo);
        mutebutton.addEventListener('click', muteVideo);
        unmutebutton.addEventListener('click', unmuteVideo);
        fullscreenbutton.addEventListener('click', fullscreenVideo);
    }


        /************************************************
     * 
     *      Control föll fyrir videoplayer
     * 
     ************************************************/

    function playVideo() {
        videoplayer.play();
        playbutton.style.display = 'none';
        pausebutton.style.display = 'inline-block';
    }

    function pauseVideo() {
        videoplayer.pause();
        playbutton.style.display = 'inline-block';
        pausebutton.style.display = 'none';
    }

    function muteVideo() {
        videoplayer.muted = true;
        mutebutton.style.display = 'none';
        unmutebutton.style.display = 'inline-block';
    }

    function unmuteVideo() {
        videoplayer.muted = false;
        mutebutton.style.display = 'inline-block';
        unmutebutton.style.display = 'none';
    }

    function backVideo() {
        videoplayer.currentTime -= 5;
    }

    function forwardVideo() {
        videoplayer.currentTime += 5;
    }

    function fullscreenVideo() {
        if (videoplayer.mozRequestFullScreen) {
            videoplayer.mozRequestFullScreen();
        } else if (videoplayer.webkitRequestFullScreen) {
            videoplayer.webkitRequestFullScreen();
        }  
    }



    function init() {
        videocontainer = document.querySelector('main .videoplayer__container');
        playbutton = document.querySelector('.videoplayer__controls__item--play');
        pausebutton = document.querySelector('.videoplayer__controls__item--pause');
        backbutton = document.querySelector('.videoplayer__controls__item--back');
        nextbutton = document.querySelector('.videoplayer__controls__item--next');
        mutebutton = document.querySelector('.videoplayer__controls__item--mute');
        unmutebutton = document.querySelector('.videoplayer__controls__item--unmute');
        fullscreenbutton = document.querySelector('.videoplayer__controls__item--fullscreen');

        fetchData();

    }

    return {
        init: init
    }

})() ;
