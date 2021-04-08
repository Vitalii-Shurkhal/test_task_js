const usersUrl = 'https://jsonplaceholder.typicode.com/users';
const postsUrl = 'https://jsonplaceholder.typicode.com/posts';


// ogółna funkcja do wysylania zapatań API 
function sendRequest(method, url, body = null) {
    return fetch(url).then(response => {
        return response.json();
    });
};

//////TASK_2_1///////

// otrzymujemy listę Userów 
sendRequest('GET', usersUrl)
    .then(function (users) {
        showUsers(users);
    })
    .catch(error => console.log(error));


// wyświetlamy listę Usewów na stronie 
function showUsers(users) {
    let usersLists = document.getElementById('usersLists');

    users.forEach(users => {
        let create_li = document.createElement('li');
        create_li.innerHTML = users.name;
        create_li.dataset.id = users.id;
        create_li.classList.add('item');
        create_li.addEventListener('click', (event) => getPosts(event));
        usersLists.appendChild(create_li);
    })
};

// otrzymujemy listę postów Userów 
function getPosts(event) {
    let user_id = event.target.dataset.id
    let postsUrl = `https://jsonplaceholder.typicode.com/posts?userId=${user_id}`;

    sendRequest('GET', postsUrl)
        .then(json => showPosts(json, event.target));
};

// wyświetlamy posty Userów na stronie 
function showPosts(posts, target) {

    hidePosts();

    let postsList = document.createElement('ol');

    posts.forEach(posts => {
        let item = document.createElement('li');
        let postTitle = document.createElement('strong');
        let postBody = document.createElement('p');

        postTitle.innerHTML = `Title: ${posts.title}`;
        postBody.innerHTML = `<b>Body</b>: ${posts.body}`;

        item.appendChild(postTitle);
        item.appendChild(postBody);
        postsList.appendChild(item);

    })

    target.appendChild(postsList);
};

function hidePosts() {
    let posts = document.querySelectorAll('.item ol');
    for (let i = 0; i < posts.length; i++) {
        if (posts[i]) {
            posts[i].style.display = 'none';
        };
    };
};

//////TASK_2_2///////


sendRequest('GET', usersUrl)
    .then(function countPosts(users) {

        let postCounter = document.getElementById('postCounter')

        for (let i = 0; i < users.length; i++) {   //za pomocą cyklu wybieramy każdego Usera
            let postsUrl = `https://jsonplaceholder.typicode.com/posts?userId=${users[i].id}`;  // 

            sendRequest('GET', postsUrl)  // dla każdego Usera wysyłamy zapyt o postach  
                .then(function (posts) {
                    let count = posts.length;  // sprawdzamy iłość postów 
                    postCounter.innerHTML += ` <li>user_name ${users[i].name} posted ${count} posts;</li>`
                });

        };

    }

    )
    .catch(error => console.log(error));


//////TASK_2_3///////

sendRequest('GET', postsUrl)
    .then(function uniqTitle(posts) {

        let allTitles = posts.map(posts => posts.title);  // dostajemy tablice  wszystkich Title 

        let nonDuplicates = [];
        let duplicates = [];

        let test = ['apple', 'melon', 'kiwi', 'orange', 'orange', 'peach', 'melon', 'apple', 'lemon', 'peach', 'kiwi', 'apple']
        //allTitles = test;  // < --- dla testu usuń // 

        // sprawdza na powtarzalne elementu 
        for (let i = 0; i < allTitles.length; i++) {
            for (let k = 0; k < allTitles.length; k++) {
                if (i !== k && allTitles[i] == allTitles[k]) {
                    duplicates.push(allTitles[i]);
                };
            };
        };
        // sprawdza na unikalne elementu 
        for (let i = 0; i < allTitles.length; i++) {
            if (duplicates.indexOf(allTitles[i]) === -1) {
                nonDuplicates.push(allTitles[i]);
            };
        };

        console.log(duplicates);  // powtarzalne elementy 
        console.log(nonDuplicates); // unikalne elenemty 

        // pożądnym rozwiązaniem tego zadania jest użycie metody filter, 
        //jest skomplikowane, ale wygłąda ładnie -- Stack Overflow One Love
        // let uniqTitles = arr => arr.filter((item, index) => arr.indexOf(item) != index);
        // console.log(uniqTitles(allTitles))

    })
    .catch(error => console.log(error));


//////TASK_2_4///////

// funkcja dla obliczenia dystansu pomiędzy Userami , wzięta ze Stack Owerflow

function countDistance(lat1, lng1, lat2, lng2) {
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lng2 - lng1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)).toFixed(1); // 2 * R; R = 6371 km
}

sendRequest('GET', usersUrl)
    .then(function distance(users) {

        for (let i = 0; i < users.length; i++) {

            let lat1 = users[i].address.geo.lat;
            let lng1 = users[i].address.geo.lng;

            let closesUser = null;
            let minDistance = Infinity;

            for (let k = 0; k < users.length; k++) {
                let lat2 = users[k].address.geo.lat;
                let lng2 = users[k].address.geo.lng;

                let distanceBetweenUsers = countDistance(lat1, lng1, lat2, lng2); // obliczamy odleglość użytkownika do innych

                if (i == k) {  // opuszczamy sprawdzenie odłegłosci usera do samego siebie 
                    continue;
                } else if (distanceBetweenUsers < minDistance) {  // porównujemy odłegłości 
                    minDistance = distanceBetweenUsers;
                    closesUser = users[k];
                };
            };

            document.getElementById('distance').innerHTML += `<li>Closest user to ${users[i].name} is ${closesUser.name} distance is: ${minDistance} km;</li>`;

        };

    }).catch(error => console.log(error));


    ///// The End //// 