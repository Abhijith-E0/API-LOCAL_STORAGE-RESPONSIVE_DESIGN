// RANDOM USER GENERATOR

/* DOM ELEMENTS */

const userImage = document.getElementById("userImage");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userPhone = document.getElementById("userPhone");
const userLocation = document.getElementById("userLocation");
const userAge = document.getElementById("userAge");

const generateBtn = document.getElementById("generateBtn");
const saveBtn = document.getElementById("saveBtn");

const loader = document.getElementById("loader");

/* API */

const API_URL = "https://randomuser.me/api/";

let currentUser = null;

/* LOADER */

function showLoader() {
    loader.classList.remove("hidden");
}

function hideLoader() {
    loader.classList.add("hidden");
}

/* FETCH USER */

async function fetchUser() {

    showLoader();

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch user.");
        }

        const data = await response.json();

        currentUser = data.results[0];

        displayUser(currentUser);

    } catch (error) {

        console.error(error);

        alert("Unable to load user.");

    } finally {

        hideLoader();

    }

}

/* DISPLAY USER */

function displayUser(user) {

    userImage.src = user.picture.large;

    userName.textContent =
        `${user.name.first} ${user.name.last}`;

    userEmail.innerHTML =
        `<i class="fa-solid fa-envelope"></i> ${user.email}`;

    userPhone.innerHTML =
        `<i class="fa-solid fa-phone"></i> ${user.phone}`;

    userLocation.innerHTML =
        `<i class="fa-solid fa-location-dot"></i> ${user.location.city}, ${user.location.country}`;

    userAge.innerHTML =
        `<i class="fa-solid fa-cake-candles"></i> Age: ${user.dob.age}`;

}

/*GENERATE BUTTON */

generateBtn.addEventListener("click", fetchUser);

/*LOAD FIRST USER  */

fetchUser();

// FAVORITES + DARK MODE

const favoritesContainer = document.getElementById("favoritesContainer");
const clearFavoritesBtn = document.getElementById("clearFavorites");
const themeBtn = document.getElementById("themeBtn");

let favorites =
    JSON.parse(localStorage.getItem("favoriteUsers")) || [];

// SAVE FAVORITE

saveBtn.addEventListener("click", () => {

    if (!currentUser) return;

    const exists = favorites.some(user =>
        user.login.uuid === currentUser.login.uuid
    );

    if (exists) {
        alert("User already exists in favorites.");
        return;
    }

    favorites.push(currentUser);

    localStorage.setItem(
        "favoriteUsers",
        JSON.stringify(favorites)
    );

    renderFavorites();

});

// REMOVE FAVORITE

function removeFavorite(id){

    favorites = favorites.filter(user =>
        user.login.uuid !== id
    );

    localStorage.setItem(
        "favoriteUsers",
        JSON.stringify(favorites)
    );

    renderFavorites();

}

//  RENDER FAVORITES

function renderFavorites(){

    favoritesContainer.innerHTML = "";

    if(favorites.length===0){

        favoritesContainer.innerHTML=`
            <p style="text-align:center;color:#777;">
                No favorite users yet.
            </p>
        `;

        return;
    }

    favorites.forEach(user=>{

        const card=document.createElement("div");

        card.className="favorite-user";

        card.innerHTML=`

            <img src="${user.picture.medium}">

            <div class="favorite-info">

                <h4>${user.name.first} ${user.name.last}</h4>

                <p>${user.email}</p>

            </div>

            <button
                class="removeBtn"
                data-id="${user.login.uuid}">
                <i class="fa-solid fa-trash"></i>
            </button>

        `;

        /* Click favorite to view */

        card.querySelector("img").addEventListener("click",()=>{

            currentUser=user;

            displayUser(user);

        });

        card.querySelector("h4").addEventListener("click",()=>{

            currentUser=user;

            displayUser(user);

        });

        /* Remove */

        card.querySelector(".removeBtn")
            .addEventListener("click",(e)=>{

                e.stopPropagation();

                removeFavorite(user.login.uuid);

            });

        favoritesContainer.appendChild(card);

    });

}

// CLEAR ALL

clearFavoritesBtn.addEventListener("click",()=>{

    if(!favorites.length) return;

    if(confirm("Clear all favorite users?")){

        favorites=[];

        localStorage.removeItem("favoriteUsers");

        renderFavorites();

    }

});

// DARK MODE

function loadTheme(){

    const theme=localStorage.getItem("theme");

    if(theme==="dark"){

        document.body.classList.add("dark");

        themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

    }

}

loadTheme();

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

    }

    else{

        localStorage.setItem("theme","light");

        themeBtn.innerHTML='<i class="fa-solid fa-moon"></i>';

    }

});

//  INITIALIZE

renderFavorites();