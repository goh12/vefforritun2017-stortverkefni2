const API_URL = './videos.json';

const moviedisplayer = (() => {
  let videoscontainer;


  /*
    Býr til streng á formi m:ss úr lengd
    myndbands
  */
  function getLength(length) {
    const min = Math.floor(length / 60);
    const secs = length - (60 * min);
    const secsstring = secs < 10 ? `0${secs}` : secs;

    const durationString = `${min}:${secsstring}`;

    return durationString;
  }

  /*
    Býr til streng á forminu
    'Fyrir N (degi|vikum) síðan'
  */
  function getDurationSinceCreated(date) {
    const timeSince = Date.now() - date;

    const hoursSince = Math.floor(timeSince / (1000 * 60 * 60));

    if (hoursSince === 1) {
      return `Fyrir ${hoursSince} klukkustund síðan`;
    }
    if (hoursSince < 24) {
      return `Fyrir ${hoursSince} klukkustundum síðan`;
    }

    const daysSince = Math.floor(timeSince / (1000 * 60 * 60 * 24));

    if (daysSince === 1) {
      return `Fyrir ${daysSince} degi síðan`;
    }
    if (daysSince < 7) {
      return `Fyrir ${daysSince} dögum síðan`;
    }

    const weeksSince = Math.floor(daysSince / 7);
    if (weeksSince === 1) {
      return `Fyrir ${weeksSince} viku síðan`;
    }
    if (daysSince < 30) {
      return `Fyrir ${weeksSince} vikum síðan`;
    }

    const monthsSince = Math.floor(daysSince / 30);
    if (monthsSince === 1) {
      return `Fyrir ${monthsSince} mánuði síðan`;
    }
    if (daysSince < 365) {
      return `Fyrir ${monthsSince} mánuðum síðan`;;
    }

    const yearsSince = Math.floor(daysSince / 365);
    if (yearsSince === 1) {
      return `Fyrir ${yearsSince} ári síðan`;
    } else {
      return `Fyrir ${yearsSince} árum síðan`;
    }
  }

  /*
    Setur eventListener "click" á element, beinir vafra á síðu
    með mynbandi sem valið er
  */
  function addVideoLink(element, videoid) {
    element.addEventListener('click', () => {
      window.location = `/watch.html?id=${videoid}`;
    });
  }

  /*
    Setur upp HTML fyrir video.
  */
  function makeVideoListItem(videoInfo) {
    /* Bý til element */
    const container = document.createElement('div');
    const imgcontainer = document.createElement('div');
    const img = document.createElement('img');
    const lengthlabel = document.createElement('span');
    const title = document.createElement('h3');
    const date = document.createElement('p');

    /* Set klasa á element */
    container.className = 'video';
    imgcontainer.className = 'video__imgcontainer';
    img.className = 'video__img';
    lengthlabel.className = 'video__imglabel';
    title.className = 'video__title';
    date.className = 'video__date';

    /* Set content í element */
    img.src = videoInfo.poster;
    lengthlabel.textContent = getLength(videoInfo.duration);
    title.textContent = videoInfo.title;
    date.textContent = getDurationSinceCreated(videoInfo.created);
    addVideoLink(imgcontainer, videoInfo.id);

    /* Set í viðeigandi container */
    imgcontainer.appendChild(img);
    imgcontainer.appendChild(lengthlabel);
    container.appendChild(imgcontainer);
    container.appendChild(title);
    container.appendChild(date);

    return container;
  }

  /*
    Bætir við myndböndum í viðeigandi category.
    */
  function addVideosToCategory(container, videosInCategory, allVideos) {
    allVideos.forEach((video) => {
      if (videosInCategory.includes(video.id)) {
        container.appendChild(makeVideoListItem(video));
      }
    });
  }

  /*
    Býr til container fyrir category.
  */
  function buildContainer(title) {
    const container = document.createElement('div');
    const heading = document.createElement('h2');
    const videolistitemcontainer = document.createElement('div');
    const hr = document.createElement('hr');

    container.className = 'category';
    heading.className = 'category__heading';
    videolistitemcontainer.className = 'category__videolist';
    heading.textContent = title;

    container.appendChild(heading);
    container.appendChild(videolistitemcontainer);
    videoscontainer.appendChild(container);
    videoscontainer.appendChild(hr);

    return videolistitemcontainer;
  }

  /*
    Fall sem vinnur úr niðurstöðum úr AJAX request og sýnir
    á skjá.
  */
  function displayData(results) {
    results.categories.forEach((data) => {
      const container = buildContainer(data.title);
      addVideosToCategory(container, data.videos, results.videos);
    });
  }

  /*
    Framkvæmir AJAX fyrirspurn og kallar á fall sem
    sýnir niðurstöður
  */
  function fetchData() {
    const r = new XMLHttpRequest();
    /* Set upp beiðni */
    r.open('GET', API_URL, true);

    r.onload = () => {
      if (r.status === 200) {
        const results = JSON.parse(r.response);
        displayData(results);
      }
    };

    r.send();
  }


  /*
    Keyrslufall síðu.
    Setur allt af stað.
  */
  function init() {
    videoscontainer = document.querySelector('main .myndbond');
    fetchData();
  }


  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  moviedisplayer.init();
});
