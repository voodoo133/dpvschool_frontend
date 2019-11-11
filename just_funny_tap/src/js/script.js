function formatDate(date, format) {
  let result = '';

  let day  = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let partOfDay = (hours >= 12) ? 'PM' : 'AM';

  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;

  if (minutes < 10) minutes = "0" + minutes;

  switch (format) {
    case 'ISO': 
      result = `${year}-${month}-${day}T${hours}:${minutes}`;
      break;

    case 'human':
      if (hours > 12) hours = hours - 12;
      
      result = `${day}.${month}.${year} ${hours}:${minutes} ${partOfDay}`;

      break;
  }

  return result;
}

function initRateHandler () {
  const rateBlocks = document.querySelectorAll('.rate');

  for (let rateBlock of rateBlocks) {
    rateBlock.onclick = (e) => {
      const target = e.target;

      if (!target.classList.contains('rate__btn')) return;

      const ratingBlock = rateBlock.querySelector('.rate__rating');
      const ratingValue = parseInt(ratingBlock.textContent);
      let ratingBlockTextContent = '';

      if (target.classList.contains('rate__btn--up')) {
        ratingBlockTextContent = ratingValue + 1;
      } else if (target.classList.contains('rate__btn--down')) {
        ratingBlockTextContent = ratingValue - 1;
      }

      if (rateBlock.classList.contains('fun-expanded__rate'))
        ratingBlockTextContent += ' votes';

      ratingBlock.textContent = ratingBlockTextContent;
    };
  }
}

const firebaseConfig = {
  apiKey: "AIzaSyAMD4YENydmYRDou7OGCAtPMlfVuxKlfzY",
  authDomain: "just-funny-tap.firebaseapp.com",
  databaseURL: "https://just-funny-tap.firebaseio.com",
  projectId: "just-funny-tap",
  storageBucket: "just-funny-tap.appspot.com",
  messagingSenderId: "1067412251905",
  appId: "1:1067412251905:web:72e170174f37e6730ba700"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const menuToggleButton = document.querySelector('.header__menu-toggle');
menuToggleButton.onclick = (e) => document.querySelector('.header__menu.menu').classList.toggle('menu--opened');

const menuLogin = document.querySelector('.menu__login');
menuLogin.onclick = (e) => document.querySelector('.modal').classList.toggle('modal--hide');

const modal = document.querySelector('.modal');
modal.onclick = (e) => {
  if (e.target.classList.contains('modal')) {
    document.querySelector('.modal--auth').classList.toggle('modal--hide');

    const formResult = document.querySelector('.modal__result');
    formResult.classList.add('modal__result--hide');
    formResult.classList.remove('modal__result--success', 'modal__result--fail');
    formResult.textContent = '';

    for (let modalInput of modalContent.querySelectorAll('.modal__input')) {
      modalInput.value = '';
    }
  }
};

const modalChangeForm = document.querySelector('.modal__btn--change-form');
modalChangeForm.onclick = (e) => {
  e.preventDefault();
  const modalContent = e.target.closest('.modal__content');
  modalContent.classList.add('modal__content--hide');
};

let modalContent = document.querySelector('.modal__content');
modalContent.addEventListener('transitionend', function () {
  if (+getComputedStyle(this).opacity === 0) {
    if (this.dataset.type === 'auth') {
      this.querySelector('.modal__btn--change-form').textContent = 'Sign in';
      this.querySelector('.modal__btn--submit').textContent = 'Sign up';
      this.setAttribute('data-type', 'reg');
    } else if (this.dataset.type === 'reg') {
      this.querySelector('.modal__btn--change-form').textContent = 'Sign up';
      this.querySelector('.modal__btn--submit').textContent = 'Sign in';
      this.setAttribute('data-type', 'auth');
    }

    this.classList.remove('modal__content--hide');
  }
});
modalContent.onsubmit = (e) => {
  e.preventDefault();

  const form = e.target;

  const email = form.querySelector('.modal__input--email').value.trim();
  const password = form.querySelector('.modal__input--password').value.trim();

  const formResult = form.querySelector('.modal__result');

  if (email.length === 0) {
    formResult.textContent = 'Empty email';
    formResult.classList.add('modal__result--fail');
    formResult.classList.remove('modal__result--hide');

    return;
  }

  if (password.length === 0) {
    formResult.textContent = 'Empty password';
    formResult.classList.add('modal__result--fail');
    formResult.classList.remove('modal__result--hide');

    return;
  }

  formResult.textContent = 'Processing...';
  formResult.classList.remove('modal__result--hide');

  if (form.dataset.type === 'auth') {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function(data) { 
        formResult.textContent = 'Success authentication';
        formResult.classList.add('modal__result--success');
      })
      .catch(function(error) {
        formResult.textContent = 'Fail authentication';
        formResult.classList.add('modal__result--fail');
      });
  } else if (form.dataset.type === 'reg') {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(data) {
        formResult.textContent = 'Success registration';
        formResult.classList.add('modal__result--success');
      })
      .catch(function(error) {
        formResult.textContent = 'Fail registration';
        formResult.classList.add('modal__result--fail');
      });
  }
}

for (let modalInput of modalContent.querySelectorAll('.modal__input')) {
  modalInput.onfocus = () => {
    const formResult = document.querySelector('.modal__result');
    formResult.classList.add('modal__result--hide');
    formResult.classList.remove('modal__result--success', 'modal__result--fail');
    formResult.textContent = '';
  };  
}

if (location.pathname.endsWith('/') || location.pathname.endsWith('/index.html')) {
  const postsUrl = 'posts.json';

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
                <div class="fun__rate rate">
                  <button class="rate__btn rate__btn--up">▲</button>
                  <span class="rate__rating">${post.rating}</span>
                  <button class="rate__btn rate__btn--down">▼</button>
                </div>
                <div class="fun__comments">${post.comments}</div>
                <a class="fun__play" href="${post.url}"></a>
              </div>
            </div>
          </li>
        `;
      }
      
      funsProcessing.classList.add('funs__processing--hide');
      funsList.insertAdjacentHTML('beforeEnd', funsListHtml);

      const funsMore = document.querySelector('.funs__more');
      funsMore.classList.remove('funs__more--hide');

      initRateHandler();
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
} else if (location.pathname.endsWith('/page.html')) {
  initRateHandler();

  const commentsForm = document.querySelector('.comments__form');
  commentsForm.onsubmit = (e) => {
    e.preventDefault();

    const commentText = commentsForm.querySelector('.comments__form-textarea').value.trim();
    const currDate = new Date();
    const commentsList = document.querySelector('.comments__list');

    const commentHTML = `
      <li class="comments__list-item comment">
        <h4 class="comment__author">Anonymous says</h4>
        <time class="comment__date" datetime="${formatDate(currDate, 'ISO')}">${formatDate(currDate, 'human')}</time>
        <div class="comment__text">${commentText}</div>
        <button class="comment__reply">✍️ Answer her</button>
      </li>
    `;

    commentsList.insertAdjacentHTML('beforeEnd', commentHTML);
  } 
}



