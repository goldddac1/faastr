const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const adminEmail = document.querySelector('#admin-email').value;
  const addAdminRole = functions.httpsCallable('addAdminRole');
  addAdminRole({ email: adminEmail }).then(result => {
    console.log(result);
  });
});


auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    });
    
    // Получаем ссылку на документ, содержащий значение поля с видео
    const docRef1 = db.collection("videos").doc("1");

    // Читаем значение поля с видео из Firestore
    docRef1.get().then((doc) => {
        if (doc.exists) {
            const videoUrl = doc.data().url;

            // Создаем новый элемент video и добавляем его на страницу
            const videoElement = document.createElement("video");
            videoElement.src = videoUrl; // Задаем значение атрибута src
            videoElement.width = 640; // Задаем ширину видео
            videoElement.height = 360; // Задаем высоту видео
            videoElement.controls = true; // Добавляем элементы управления

            const containerElement = document.querySelector(".video-container");
            containerElement.appendChild(videoElement);
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

  } else {
    setupUI();
    setupMovies([]);
  }
});



auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    });
    
    // Получаем ссылку на документ, содержащий значение поля с изображением
    const docRef = db.collection("Image").doc("1");

    // Читаем значение поля с изображением из Firestore
    docRef.get().then((doc) => {
        if (doc.exists) {
            const imageUrl = doc.data().image;

            // Создаем новый элемент img и добавляем его на страницу
            const imgElement = document.createElement("img");
            imgElement.src = imageUrl; // Задаем значение атрибута src

            const containerElement = document.querySelector(".image-container");
            containerElement.appendChild(imgElement);
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

  } else {
    setupUI();
    setupMovies([]);
  }
});



auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    });
    // Отслеживание изменений в коллекции "movies"
    db.collection('Movies').onSnapshot(snapshot => {
      setupMovies(snapshot.docs);
    }, err => console.log(err.message));
  } else {
    setupUI();
    setupMovies([]);
  }
});



// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    });
    db.collection('guides').onSnapshot(snapshot => {
      setupGuides(snapshot.docs);
    }, err => console.log(err.message));
  } else {
    setupUI();
    setupGuides([]);
  }
});

// create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('guides').add({
    title: createForm.title.value,
    content: createForm.content.value
  }).then(() => {
    // close the create modal & reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createForm.reset();
  }).catch(err => {
    console.log(err.message);
  });
});

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user & add firestore data
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      bio: signupForm['signup-bio'].value
    });
  }).then(() => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
    signupForm.querySelector('.error').innerHTML = ''
  }).catch(err => {
    signupForm.querySelector('.error').innerHTML = err.message;
  });
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
});





// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
    loginForm.querySelector('.error').innerHTML = '';
  }).catch(err => {
    loginForm.querySelector('.error').innerHTML = err.message;
  });

});