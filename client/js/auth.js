

const $ = (elm) => document.querySelector(elm);
const $all = (elm) => document.querySelectorAll(elm)
const log = (...param) => console.log(...param)
const sleep = (sec = 1) => new Promise((res, rej) => setTimeout(res(), 1 * 1000))

// listen when users signin or signout
window.addEventListener("load", () => {
    firebase.auth().onAuthStateChanged(user => {
        console.log(user)
        if (user) {
            //
        } else {
            //
        }
    })
})

const signinGoogleBtn = $(".signin_google");
const signupGoogleBtn = $(".signup_google");
const signupWithMailBtn = $(".signup_with_email");
const signinWithMailBtn = $(".signin_with_email");

const signupMailInp = $(".signup_email"),
    signupUsernameInp = $(".signup_username"),
    signupPwdInp = $(".signup_password");

const signinMailInp = $(".signin_email"),
    signinPwdInp = $(".signin_password");


// log(signinGoogleBtn, signupGoogleBtn, allPwdInput, allmailInput, usernameInp)

const firebaseConfig = {
    apiKey: "AIzaSyDiMMThp6o9tgGs6Ir5GREfe_xxqrlTx-s",
    authDomain: "proact-1a438.firebaseapp.com",
    projectId: "proact-1a438",
    storageBucket: "proact-1a438.appspot.com",
    messagingSenderId: "664808307749",
    appId: "1:664808307749:web:9161ea702348cde41253cc"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

// OAuth providers
const googleProvider = new firebase.auth.GoogleAuthProvider()

const BASE_URL = "http://localhost:5000"

class Auth {

    async signupWithGoogle(e) {
        try {

            const usercredential = await firebase.auth().signInWithPopup(googleProvider)
            const { idToken } = usercredential.credential;
            const { isAnonymous, uid, photoURL, displayName, email } = usercredential.user;

            if (typeof usercredential.user === "undefined") return

            // send token to backend
            try {
                const req = await fetch(BASE_URL + "/api/auth/google", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        token: idToken,
                        username: displayName,
                        email,
                        uid,
                        image: photoURL,
                        type: "signup_with_google"
                    })
                })

                const data = await req.json();

                if (!data.error) {
                    return alert(data.message);
                }

                localStorage.clear()
                alert(data.message);

                localStorage.setItem("user_auth", JSON.stringify({ id: uid, image: photoURL, username: displayName, email }))
                localStorage.setItem("authToken", JSON.stringify(idToken))


                const a = document.createElement("a")
                a.href = "/login.html"
                a.click()
            } catch (e) {
                log(e.message)
                alert("Something went wrong")
            }
        } catch (e) {
            log(e.message)
        }
    }

    async signinWithGoogle(e) {
        try {

            const usercredential = await firebase.auth().signInWithPopup(googleProvider)
            const { idToken } = usercredential.credential;
            const { isAnonymous, uid, photoURL, displayName, email } = usercredential.user;

            if (typeof usercredential.user === "undefined") return

            // send token to backend
            try {
                const req = await fetch(BASE_URL + "/api/auth/google", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        token: idToken,
                        username: displayName,
                        email,
                        uid,
                        image: photoURL,
                        type: "signin_with_google"
                    })
                })

                const data = await req.json();

                if (!data.error) {
                    return alert(data.message);
                }

                localStorage.clear()
                alert(data.message);

                const signinData = data.data;
                localStorage.setItem("user_auth", JSON.stringify({ email: signinData.email, username: signinData.username }))
                localStorage.setItem("authToken", JSON.stringify(signinData.token))

                // return log(data.data)
                const a = document.createElement("a")
                a.href = "/index.html"
                a.click()
            } catch (e) {
                log(e.message)
                alert("Something went wrong")
            }
        } catch (e) {
            log(e.message)
        }
    }

    async signupWithEmail(e) {
        if (signupMailInp.value === "") {
            return alert("email is empty")
        }
        if (signupUsernameInp.value === "") {
            return alert("username is empty")
        }
        if (signupPwdInp.value === "") {
            return alert("password is empty")
        }

        try {
            const req = await fetch(BASE_URL + "/api/auth/mail", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    username: signupUsernameInp.value,
                    email: signupMailInp.value,
                    password: signupPwdInp.value,
                    type: "signup_with_mail"
                })
            })

            const data = await req.json();

            if (!data.error) {
                return alert(data.message);
            }

            localStorage.clear()
            alert(data.message);

            log(data.data)
            // const {} = data.data;
            // localStorage.setItem("user_auth", JSON.stringify({}))
            // localStorage.setItem("authToken", JSON.stringify(idToken))


            // const a = document.createElement("a")
            // a.href = "/index.html"
            // a.click()
        } catch (e) {
            log(e.message)
            alert("Something went wrong")
        }
    }

    async signinWithEmail(e) {
        if (signinMailInp.value === "") {
            return alert("email is empty")
        }
        if (signinPwdInp.value === "") {
            return alert("password is empty")
        }

        try {
            const req = await fetch(BASE_URL + "/api/auth/mail", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    email: signinMailInp.value,
                    password: signinPwdInp.value,
                    type: "signin_with_mail"
                })
            })

            const data = await req.json();

            if (!data.error) {
                return alert(data.message);
            }

            localStorage.clear()
            alert(data.message);

            log(data.data)
            const { email, username, token } = data.data;
            localStorage.setItem("user_auth", JSON.stringify({ email, username }))
            localStorage.setItem("authToken", JSON.stringify(token))


            const a = document.createElement("a")
            a.href = "/index.html"
            a.click()
        } catch (e) {
            log(e.message)
            alert("Something went wrong")
        }
    }
}

const auth_instance = new Auth()

// signup with google
signupGoogleBtn?.addEventListener("click", auth_instance.signupWithGoogle)

// sign in with google
signinGoogleBtn?.addEventListener("click", auth_instance.signinWithGoogle)

// signup with email
signupWithMailBtn?.addEventListener("click", auth_instance.signupWithEmail)

// signin with  email
signinWithMailBtn?.addEventListener("click", auth_instance.signinWithEmail)