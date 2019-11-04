let menuToggleButton = document.querySelector('.header__menu-toggle');

menuToggleButton.onclick = (e) => document.querySelector('.header__menu.menu').classList.toggle('menu--opened');

const postsUrl = '/posts.json';

fetch(postsUrl)
  .then(res => res.json())
  .then(posts => {
    const funsProcessing = document.querySelector('.funs__processing');

    const funsList = document.querySelector('.funs__list');
    let funsListHtml = '';

    for (let post of posts) {
      funsListHtml += `
        <li class="funs__list-item fun">
            <h2 class="fun__header">${post.title}</h2>
            <div class="fun__content">
              <img class="fun__img" src="${post.imgUrl}" alt="fun_image" />
              <div class="fun__author">Fun: ${post.author}</div>
              <div class="fun__meta">
                <div class="fun__rate">
                  <button class="fun__rate-btn fun__rate-btn--up">▲</button>
                  <span class="fun__rating">${post.rating}</span>
                  <button class="fun__rate-btn fun__rate-btn--down">▼</button>
                </div>
                <div class="fun__comments">${post.comments}</div>
                <button class="fun__play"></button>
              </div>
            </div>
          </li>
      `;
    }
    
    funsProcessing.classList.add('funs__processing--hide');
    funsList.insertAdjacentHTML('beforeEnd', funsListHtml);

    const funsMore = document.querySelector('.funs__more');
    funsMore.classList.remove('funs__more--hide');
  })
  .catch(error => {
    const funsProcessing = document.querySelector('.funs__processing');
    funsProcessing.classList.add('funs__processing--hide');

    const funsList = document.querySelector('.funs__list');

    const funsError = document.createElement('p');
    funsError.classList.add('funs__error');
    funsError.textContent = 'Can\'t get posts';
 
    funsList.after(funsError);
  });


