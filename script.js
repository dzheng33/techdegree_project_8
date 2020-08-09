const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const search = document.querySelector("#search");
let arrowIndex = 0;
let employees = [];


async function getJSON(url){
    try {
        const response = await fetch(url);
        return await response.json();
    }
    catch(error) {
        throw error;
    }

}

async function getInfo(url){
    const infoJSON = await getJSON(url);
    
    const info = infoJSON.results.map( result => {
        let bday = new Date(result.dob.date);

        const name = `${result.name.first} ${result.name.last}`;
        const email = result.email;
        const city =  result.location.city;
        const phoneNumber = result.phone;
        const address = `${result.location.street.number} ${result.location.street.name}, ${result.location.state} ${result.location.postcode}`;
        const dob = `${bday.getMonth() + 1}/${bday.getDate()}/${bday.getFullYear()}`;
        const pic = result.picture.large;

        return {name, email, city, phoneNumber, address, dob, pic};
    });

    return info;
}

function generateHTML(data){
   
    employees = data;
    data.map( person => {
        const div = document.createElement("DIV");
        div.className = "card";
        div.innerHTML = `
        <img src="${person.pic}" alt="employee photo">

        <div class="text-container">
            <h2 class="name">${person.name}</h2>
            <p class="email">${person.email}</p>
            <p class="address">${person.city}</p>
        </div>
        `;

        gridContainer.appendChild(div);
    });

}

function generateModal(index){


    
    const modal = `

    <img src="${employees[index].pic}" alt="employee photo">
    <div class="text-container">
        <h2 class="name">${employees[index].name}</h2>
        <p class="email">${employees[index].email}</p>
        <p class="address">${employees[index].city}</p>
        <hr>
        <p class="extra-text">${employees[index].phoneNumber}</p>
        <p class="address">${employees[index].address}</p>
        <p class="extra-text">Birthday: ${employees[index].dob}</p>
    </div>
    
    `;

    modalContainer.innerHTML = modal;

}



getInfo(urlAPI)
    .then(generateHTML)
    .catch( error => {
        gridContainer.innerHTML = "<h2>There Was An Error</h2>";
        console.error(error);
    });

gridContainer.addEventListener("click", function(event){
    if(event.target.className !== gridContainer){
        const card = event.target.closest(".card");
        const index = Array.prototype.indexOf.call(gridContainer.children, card);
        generateModal(index);
        overlay.classList.remove("hidden");
        arrowIndex = index;
    }
});

modalClose.addEventListener("click", function(event){
        overlay.classList.add("hidden");
    
});

search.addEventListener("keyup", function(){
    const input = search.value.toUpperCase();
    const card = document.querySelectorAll(".card");

    for(let i = 0; i< employees.length; i++){

        const employeeName = employees[i].name.toUpperCase();
        if(employeeName.includes(input)){
            card[i].style.display = "";
        }
        else {
            card[i].style.display = "none";
        }
    }
});

const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

next.addEventListener("click", function(){
    if(arrowIndex < employees.length - 1) {
        arrowIndex++;
        generateModal(arrowIndex);
        console.log(arrowIndex);
    }
});

prev.addEventListener("click", function(){
    if(arrowIndex > 0){
        arrowIndex--;
        generateModal(arrowIndex);
    }
});

