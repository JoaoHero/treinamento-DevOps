const form = document.querySelector("form");
let timer;

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = form.querySelector("#email").value;
    const password = form.querySelector("#password").value;

    const formData = {
        email: email,
        password: password,
    };

    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    }).then((res) => res.json())
    .then((jsonBody) => {
        if(jsonBody.error) {
            const div = document.querySelector(".alertResponse");
            clearTimeout(timer);
    
            div.style.display = "block";
            div.innerHTML = jsonBody.message;
            
            timer = setTimeout(() => {
                div.style.display = "none";
            }, 3000);
        }else {
           window.location = "/login"
        }
    })
    .catch((err) => console.log("Erro ao se conectar com o POST", err));
});

const email = "joao.silvaramos2013@hotmail.com"






console.log(validateEmail(email));  
