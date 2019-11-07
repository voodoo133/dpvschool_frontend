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

if (location.pathname === '/' || location.pathname === '/index.html') {
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
}
