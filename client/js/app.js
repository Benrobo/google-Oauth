
window.onload = () => {
    getUser()




}

const $ = (elm) => document.querySelector(elm);
const $all = (elm) => document.querySelectorAll(elm)
const log = (...param) => console.log(...param)
const sleep = (sec = 1) => new Promise((res, rej) => setTimeout(res(), 1 * 1000))


const cardCont = $(".card-cont");

async function getUser() {

    const token = JSON.parse(localStorage.getItem("authToken"))

    cardCont.innerHTML = "<p>Loading...</p>"
    const res = await fetch("http://localhost:5000/user", {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })

    const data = await res.json();

    if (data.error) {
        cardCont.innerHTML = `
            <p>${data.message}</p>
        `
        return;
    }

    const userInfo = data.data[0]

    cardCont.innerHTML = `
    <br>
    <div class="profile-info">
        <img src="${userInfo.image}" />
        <h3 class="">${userInfo.username}</h3>
        <p>${userInfo.email}</p>
        </br>
        <button class="logout" onClick="logout()">Logout</button>
    </div>    
    `

    console.log(data)
}


function logout() {
    localStorage.clear();
    window.location = "/login.html"
}

