
window.onload = () => {
    isLoggedIn()
}

function isLoggedIn() {

    const token = localStorage.getItem("authToken") === null ? null : JSON.parse(localStorage.getItem("authToken"))

    const { pathname } = window.location;
    const path = pathname.split(".")[0]

    if (path === "/" || path === "/index") {
        if (token === null || token === "") {
            return window.location = "/login.html"
        }
    }
    if (path === "/login" || path === "/signup") {
        if (token !== null && token !== "") {
            return window.location = "/index.html"
        }
    }
}
