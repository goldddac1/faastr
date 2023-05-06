// DOM elements
const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const movieList = document.querySelector('.movies');
const imageList = document.querySelector('.Image');
const videoList = document.querySelector('.videos');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const adminItems = document.querySelectorAll('.admin');



const docRef = db.collection('Image').doc('1');


docRef.get().then(doc => {
  if (doc.exists) {
    const imageUrl = doc.data().image;
    imageList.innerHTML = `
      <a href="/movies/1">
        <img class="movie-image" src="${imageUrl}" alt="My Image" data-movie-id="1">
      </a>
    `;
  } else {
    console.log('No such document!');
  }
}).catch(error => {
  console.log('Error getting document:', error);
});


const docRef1 = db.collection("videos").doc("1");

docRef1.get().then((doc) => {
    if (doc.exists) {
        const videoUrl = doc.data().url;
        videoList.innerHTML = `<video width='640' height='360' controls><source src="${videoUrl}" type="video/webm"></video>`;
    } else {
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});

///test
const setupMovies = async data => {
  const moviesList = document.querySelector('movies');

  if (!data.length) {
    movieList.innerHTML = '<h5 class="center-align">В базе данных нет фильмов</h5>';
    return;
  }

  for (const doc of data) {
    const movie = doc.data();

    // Получаем ссылки на документы жанров, актеров и режиссера
    const [genreDoc1, actorDoc1, actorDoc2, genreDoc2, directorDoc] = await Promise.all([
      movie.genreRef.get(),
      movie.ActorRef.get(),
      movie.ActorRef2.get(),
      movie.genreRef2.get(),
      movie.directorRef.get()
    ]);

    const genreName1 = genreDoc1.exists ? genreDoc1.data().genre1 : '';
    const genreName2 = genreDoc2.exists ? genreDoc2.data().genre2 : '';
    const actorName1 = actorDoc1.exists ? actorDoc1.data().Name_actor1 : '';
    const actorName2 = actorDoc2.exists ? actorDoc2.data().Name_actor2 : '';
    const directorName = directorDoc.exists ? directorDoc.data().Name_director1 : '';

    const li = `
      <li>
        <div class="collapsible-header grey lighten-4">Назва: ${movie.Name_film}</div>
        <div class="collapsible-header grey lighten-4">Дата прем'єри: ${movie.Date_premiere}</div>
        <div class="collapsible-header grey lighten-4">бюджет: ${movie.Budget_film}</div>
        <div class="collapsible-header grey lighten-4">Жанр: ${genreName1}, ${genreName2}</div>
        <div class="collapsible-header grey lighten-4">Актори: ${actorName1}, ${actorName2}</div>
        <div class="collapsible-header grey lighten-4">Режисер: ${directorName}</div>
      </li>
    `;

    movieList.insertAdjacentHTML('beforeend', li);
  }
};



const setupUI = (user) => {
  if (user) {
    if (user.admin) {
      adminItems.forEach(item => item.style.display = 'block');
    }
    // account info
    db.collection('users').doc(user.uid).get().then(doc => {
      const html = `
        <div>Logged in as ${user.email}</div>
        <div>${doc.data().bio}</div>
        <div class="pink-text">${user.admin ? 'Admin' : ''}</div>
      `;
      accountDetails.innerHTML = html;
    });
    // toggle user UI elements
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    // clear account info
    accountDetails.innerHTML = '';
    // toggle user elements
    adminItems.forEach(item => item.style.display = 'none');
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
};



// setup guides
const setupGuides = (data) => {

  if (data.length) {
    let html = '';
    data.forEach(doc => {
      const guide = doc.data();
      const li = `
        <li>
          <div class="collapsible-header grey lighten-4"> ${guide.title} </div>
          <div class="collapsible-body white"> ${guide.content} </div>
        </li>
      `;
      html += li;
    });
    guideList.innerHTML = html
  } else {
    guideList.innerHTML = '<h5 class="center-align">Увійдіть</h5>';
  }
  

};

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});
