'use strict';
document.addEventListener('DOMContentLoaded', () => {
  //keyboard
  {
    const keyboardButton = document.querySelector('.search-form__keyboard');
    const keyboard = document.querySelector('.keyboard');
    const closeKeyboard = document.getElementById('close-keyboard');
    const searchInput = document.querySelector('.search-form__input');

    const toggleKeyboard = () => {
      keyboard.style.top = keyboard.style.top ? '' : '50%';
    };

    const changeLanguage = (btn, lang) => {
      const langRu = ['ё', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '=', '⬅',
        'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
        'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э',
        'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.',
        'en', ' '
      ];
      const langEn = ['`', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '=', '⬅',
        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
        'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '"',
        'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
        'ru', ' '
      ];

      if (lang === 'en') {
        btn.forEach((element, index) => {
          element.textContent = langEn[index];
        });
      } else {
        btn.forEach((element, index) => {
          element.textContent = langRu[index];
        });
      }
    }

    const typing = event => {
      const target = event.target;

      if (target.tagName.toLowerCase() === 'button') {
        switch (target.textContent.trim()) {
          case '':
            searchInput.value += ' ';
            break;
          case '⬅':
            searchInput.value = searchInput.value.substr(0, searchInput.value.length - 1);
            break;
          case 'en':
          case 'ru':
            const buttons = [...keyboard.querySelectorAll('button')].filter(element => element.style.visibility !== 'hidden');
            changeLanguage(buttons, target.textContent.trim());
            break;
          default:
            searchInput.value += target.textContent.trim();
        }
      }
    };

    keyboardButton.addEventListener('click', toggleKeyboard);
    closeKeyboard.addEventListener('click', toggleKeyboard);
    keyboard.addEventListener('click', typing);
  }

  //menu
  {
    const burger = document.querySelector('.spinner');
    const sidebarMenu = document.querySelector('.sidebarMenu');
    const nextPageBtn = document.getElementById('next_result');

    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      sidebarMenu.classList.toggle('rollUp');
    });

    sidebarMenu.addEventListener('click', e => {
      let target = e.target;
      target = target.closest('a[href="#"]');
      if (target) {
        const parentTarget = target.parentElement;
        parentTarget.classList.toggle('active');
        sidebarMenu.querySelectorAll('li').forEach(element => {
          if (element === parentTarget) {
            element.classList.add('active');
          } else {
            element.classList.remove('active');
          }
        });
      }
      nextPageBtn.dataset.search = '';
    });
  }

  //modal
  const youtuber = () => {
    const youtuberItems = document.querySelectorAll('[data-youtuber]'); // Все видео на странице
    const youTuberModal = document.querySelector('.youTuberModal'); // Модальное окно
    const youtuberContainer = document.getElementById('youtuberContainer'); // Контекст модального окна

    const qw = [3840, 2560, 1920, 1280, 854, 640, 426, 256];
    const qh = [2160, 1440, 1080, 720, 480, 360, 240, 144];

    const sizeVideo = () => {
      const ww = document.documentElement.clientWidth;
      const wh = document.documentElement.clientHeight;

      for (let i = 0; i < qw.length; i++) {
        if (ww > qw[i]) {
          youtuberContainer.querySelector('iframe').style.cssText = `
            width: ${qw[i]}px;
            height: ${qh[i]}px;
          `;
          youtuberContainer.style.cssText = `
            width: ${qw[i]}px;
            height: ${qh[i]}px;
            top: ${(wh - qh[i]) / 2}px;
            left: ${(ww - qw[i]) / 2}px;
          `;
          break;
        }
      }
    };

    youtuberItems.forEach(elem => {
      elem.addEventListener('click', () => {
        const idVideo = elem.dataset.youtuber;
        youTuberModal.style.display = 'block';

        const youTuberFrame = document.createElement('iframe');
        youTuberFrame.src = `https://www.youtube.com/embed/${idVideo}`;
        youTuberFrame.style.border = 'transparent';
        youtuberContainer.insertAdjacentElement('beforeend', youTuberFrame);

        window.addEventListener('resize', sizeVideo);
        sizeVideo();
      });
    });

    youTuberModal.addEventListener('click', () => {
      youTuberModal.style.display = '';
      youtuberContainer.textContent = '';
      window.removeEventListener('resize', sizeVideo);
    });
  }

  {
    document.body.insertAdjacentHTML('beforeend', `
    <div class="youTuberModal">
    <div id="youtuberClose">&#215;</div>
    <div id="youtuberContainer"></div>
    </div>
    `);

    youtuber();
  }

  /* API */
  {
    const API_KEY = 'AIzaSyDqenKmMY3UHdwcJk8kuo5N-9Dyzm-5m2k';
    const CLIENT_ID = '516587106109-55lae4bgou262gklfprbul313mp1a5ag.apps.googleusercontent.com';
    
    //authorization
    {
      const buttonAuth = document.getElementById('authorize');
      const authBlock = document.querySelector('.auth');

      gapi.load("client:auth2", () => gapi.auth2.init({
        client_id: CLIENT_ID
      }));

      const authenticate = () => gapi.auth2.getAuthInstance()
        .signIn({
          scope: "https://www.googleapis.com/auth/youtube.readonly"
        })
        .then(() => console.log("Sign-in successful"))
        .catch(errorAuth);

      const loadClient = () => {
        gapi.client.setApiKey(API_KEY);
        return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
          .then(() => console.log("GAPI client loaded for API"))
          .then(() => authBlock.style.display = 'none')
          .catch(errorAuth);
      };

      const errorAuth = err => {
        console.error(err);
        authBlock.style.display = '';
      };

      buttonAuth.addEventListener('click', () => {
        authenticate().then(loadClient)
      });
    }

    /* Request */
    {
      const ytWrapper = document.getElementById('yt-wrapper');
      const gloTube = document.querySelector('.logo-academy');
      const trends = document.getElementById('yt_trend');
      const liked = document.getElementById('yt_like');
      const main = document.getElementById('yt_main');
      const subscriptions = document.getElementById('yt_subscriptions');
      const searchForm = document.querySelector('.search-form');
      const nextPageBtn = document.getElementById('next_result');
      nextPageBtn.style.display = 'none';

      const request = options => {
        nextPageBtn.dataset.method = options.method;
        return gapi.client.youtube[options.method]
          .list(options)
          .then(response => response.result)
          .then(options.method === 'subscriptions' ? renderSub : render)
          .catch(err => console.error('Во время выполнения запроса произошла ошибка: ' + err));
      }

      const render = data => {
        ytWrapper.textContent = '';
        data.items.forEach(item => {
          try {
            const {
              id,
              id: {
                videoId
              },
              snippet: {
                channelTitle,
                title,
                thumbnails: {
                  high: {
                    url
                  }
                },
                resourceId: {
                  videoId: likedVideoId
                } = {}
              }
            } = item;

            ytWrapper.innerHTML += `
              <div class="yt" data-youtuber="${likedVideoId || videoId || id}">
                <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
                  <img src="${url}" alt="thumbnail" class="yt-thumbnail__img">
                </div>
                <div class="yt-title">${title}</div>
                <div class="yt-channel">${channelTitle}</div>
              </div>
            `;
          } catch (err) {
            console.error(err);
          }
        });
        if (data.nextPageToken !== undefined) {
          nextPageBtn.style.display = 'block';
          nextPageBtn.dataset.nextpage = data.nextPageToken;
        } else {
          nextPageBtn.style.display = 'none';
          nextPageBtn.dataset.nextpage = '';
        }

        youtuber();
      };

      const renderSub = data => {
        ytWrapper.textContent = '';
        data.items.forEach(item => {
          try {
            const {
              snippet: {
                description,
                title,
                resourceId: {
                  channelId
                },
                thumbnails: {
                  high: {
                    url
                  }
                }
              }
            } = item;

            ytWrapper.innerHTML += `
              <div class="yt" data-youtuber="${channelId}">
                <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
                  <img src="${url}" alt="thumbnail" class="yt-thumbnail__img">
                </div>
                <div class="yt-title">${title}</div>
                <div class="yt-channel">${description}</div>
              </div>
            `;
          } catch (err) {
            console.error(err);
          }
        });
        if (data.nextPageToken !== undefined) {
          nextPageBtn.style.display = 'block';
          nextPageBtn.dataset.nextpage = data.nextPageToken;
        } else {
          nextPageBtn.style.display = 'none';
          nextPageBtn.dataset.nextpage = '';
        }

        ytWrapper.querySelectorAll('.yt').forEach(item => {
          item.addEventListener('click', () => {
            nextPageBtn.dataset.ytchannel = item.dataset.youtuber;
            return request({
              method: 'search',
              part: 'snippet',
              channelId: item.dataset.youtuber,
              order: 'date',
              maxResults: 8
            });
          });
        });
      };

      gloTube.addEventListener('click', () => {
        const sidebarMenu = document.querySelector('.sidebarMenu');
        sidebarMenu.querySelectorAll('li').forEach(element => element.classList.remove('active'));

        nextPageBtn.dataset.ytchannel = 'UCVswRUcKC-M35RzgPRv8qUg';
        request({
          method: 'search',
          part: 'snippet',
          channelId: nextPageBtn.dataset.ytchannel,
          order: 'date',
          maxResults: 6
        });
        nextPageBtn.dataset.search = '';
      });

      trends.addEventListener('click', () => {
        request({
          method: 'videos',
          part: 'snippet',
          chart: 'mostPopular',
          regionCode: 'RU',
          maxResults: 6
        });
      });

      liked.addEventListener('click', () => {
        request({
          method: 'playlistItems',
          part: 'snippet',
          playlistId: 'LLwXrh9gmu6gu3nmdZtHNuRw',
          maxResults: 6
        });
      });

      //click on main - error?? Временное решение
      main.addEventListener('click', () => {
        ytWrapper.textContent = '';
        ytWrapper.innerHTML = `
          <div class="yt" data-youtuber="B7rZxLzSAOM">
            <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
              <img src="./img/001.jpg" alt="thumbnail" class="yt-thumbnail__img">
            </div>
            <div class="yt-title">Как я стал фрилансером веб-разработчиком</div>
            <div class="yt-channel">Glo Academy — HTML, CSS и JS</div>
          </div>
          <div class="yt" data-youtuber="NF6DV-S9DEE">
            <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
              <img src="./img/002.jpg" alt="thumbnail" class="yt-thumbnail__img">
            </div>
            <div class="yt-title">Способы перебора массивов в JavaScript | Часть 2 | Уроки JavaScript</div>
            <div class="yt-channel">Glo Academy — HTML, CSS и JS</div>
          </div>
          <div class="yt" data-youtuber="NtcgznHOBlc">
            <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
              <img src="./img/003.jpg" alt="thumbnail" class="yt-thumbnail__img">
            </div>
            <div class="yt-title">Способы перебора массивов в JavaScript | Часть 1 | Уроки JavaScript</div>
            <div class="yt-channel">Glo Academy — HTML, CSS и JS</div>
          </div>
          <div class="yt" data-youtuber="c5--bmtCCVo">
            <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
              <img src="./img/004.jpg" alt="thumbnail" class="yt-thumbnail__img">
            </div>
            <div class="yt-title">Открытый урок с курса JS 9.0 - Слайдер карусель</div>
            <div class="yt-channel">Glo Academy — HTML, CSS и JS</div>
          </div>
          <div class="yt" data-youtuber="amrIqeOXQW0">
            <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
              <img src="./img/005.jpg" alt="thumbnail" class="yt-thumbnail__img">
            </div>
            <div class="yt-title">JS-фичи #4 | Круглый прогрессбар на JavaScript | Circle progress bar</div>
            <div class="yt-channel">Glo Academy — HTML, CSS и JS</div>
          </div>
          <div class="yt" data-youtuber="VpM4kAwuJTY">
            <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
              <img src="./img/006.jpg" alt="thumbnail" class="yt-thumbnail__img">
            </div>
            <div class="yt-title">JavaScript фичи #3 | Прогресс бар при прокрутке страницы | JS</div>
            <div class="yt-channel">Glo Academy — HTML, CSS и JS</div>
          </div>
        `;

        youtuber();
        nextPageBtn.style.display = 'none';
      });

      subscriptions.addEventListener('click', () => {
        request({
          method: 'subscriptions',
          part: 'snippet',
          mine: true,
          maxResults: 6
        });
      });

      nextPageBtn.addEventListener('click', () => {
        const currentMethod = nextPageBtn.dataset.method;
        let options = {
          method: currentMethod,
          part: 'snippet',
          maxResults: 6,
          pageToken: nextPageBtn.dataset.nextpage
        };

        if (currentMethod === 'subscriptions') {
          options.mine = true;
        } else if (currentMethod === 'playlistItems') {
          options.playlistId = 'LLwXrh9gmu6gu3nmdZtHNuRw';
        } else if (currentMethod === 'videos') {
          options.chart = 'mostPopular';
          options.regionCode = 'RU';
        } else if (nextPageBtn.dataset.search !== '') {
          options.method = 'search';
          options.q = nextPageBtn.dataset.search;
          options.order = 'relevance';
        } else if (currentMethod === 'search') {
          options.channelId = nextPageBtn.dataset.ytchannel;
          options.order = 'date';
        }
        request(options);
      });

      searchForm.addEventListener('submit', event => {
        event.preventDefault();
        let inputValue = searchForm.elements[0].value;
        if (!inputValue) {
          searchForm.style.border = '1px solid red';
          return;
        }
        searchForm.style.border = '';
        request({
          method: 'search',
          part: 'snippet',
          q: inputValue,
          order: 'relevance',
          maxResults: 6
        });
        nextPageBtn.dataset.search = inputValue;
        searchForm.elements[0].value = '';
      });
    }
  }
});