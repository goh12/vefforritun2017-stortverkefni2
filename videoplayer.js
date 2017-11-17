const API_URL = './videos.json';

const videoPlayer = (() => {
  let videocontainer;
  let videoplayer;
  let playbutton;
  let pausebutton;
  let backbutton;
  let nextbutton;
  let mutebutton;
  let unmutebutton;
  let fullscreenbutton;


  /* ***********************************************
   *
   *    Control föll fyrir videoplayer
   *
   *********************************************** */

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

  /* ************ Control föll enda  ********************** */


  /*
    Býr til Controls hnapp og bætir honum
    í buttonContainer
  */
  function createControlButton(buttonContainer, buttonName) {
    const button = document.createElement('img');
    button.className = `videoplayer__controls__item videoplayer__controls__item--${buttonName}`;
    button.src = `img/${buttonName}.svg`;
    buttonContainer.appendChild(button);

    return button;
  }

  /*
    Setur rétta stýringu á alla hnappa
  */
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


  /*
    Býr til alla hnapp og bætir þeim í nýjan container
  */
  function createControls() {
    /* Bý til elements */
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'videoplayer__controls';

    backbutton = createControlButton(controlsContainer, 'back');
    playbutton = createControlButton(controlsContainer, 'play');
    pausebutton = createControlButton(controlsContainer, 'pause');
    mutebutton = createControlButton(controlsContainer, 'mute');
    unmutebutton = createControlButton(controlsContainer, 'unmute');
    fullscreenbutton = createControlButton(controlsContainer, 'fullscreen');
    nextbutton = createControlButton(controlsContainer, 'next');

    setControls();

    videocontainer.appendChild(controlsContainer);
  }


  /**
   * Býr til nýjan video player með stýrihnöppum
   *
   */
  function createVideoPlayer(videoInfo) {
    const heading = document.createElement('h2');
    heading.className = 'videoplayer__heading';
    heading.textContent = videoInfo.title;
    videoplayer = document.createElement('video');
    videoplayer.className = 'videoplayer__view';
    videoplayer.src = videoInfo.video;

    videocontainer.appendChild(heading);
    videocontainer.appendChild(videoplayer);
    createControls();
    videoplayer.play();
  }

  /*
    Nær í upplýsingar um myndbönd og nær í rétt mynbdand
    og setur í spilun.
  */
  function fetchData() {
    const url = new URL(window.location.href);
    const videoId = url.searchParams.get('id');

    const r = new XMLHttpRequest();
    /* Set upp beiðni */
    r.open('GET', API_URL, true);

    r.onload = () => {
      if (r.status === 200) {
        const results = JSON.parse(r.response);
        const videoInfo = results.videos[videoId - 1];
        createVideoPlayer(videoInfo);
      }
    };

    r.send();
  }

  /*
    Keyrslufall síðu
  */
  function init() {
    videocontainer = document.querySelector('main .videoplayer');

    fetchData();
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  videoPlayer.init();
});
