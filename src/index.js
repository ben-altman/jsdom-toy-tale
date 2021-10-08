let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  toggleToyForm()
  getToys()
  toyFormPost()
});

function getToys() {
  const toysURL = "http://localhost:3000/toys"
  fetch(toysURL)
    // fetch returns a Promise
    // parse json, convert to javascript
    .then(resp => resp.json())
    // also returns a Promise
    .then(toys => {
      // toys.forEach(toy => makeToyCard(toy))
      for (toy of toys) {
        makeToyCard(toy)
      }
    });
}

function toggleToyForm() {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
}

function handleLikeButton(e) {
  const likes = e.target.previousElementSibling
  let text = likes.innerText
  const newLikes = parseInt(text) + 1
  console.log(`${newLikes} likes`);
  e.target.previousElementSibling.innerText = `${newLikes} likes`

  fetch(`http://localhost:3000/toys/${e.target.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": newLikes
    })
  })
  .then(res => res.json())
  .then(data => console.log(data))
}

function makeToyCard(toy) {
  const toyName = document.createElement('h2')
  toyName.innerText = toy.name

  const toyImg = document.createElement('img')
  toyImg.src = toy.image
  toyImg.className = "toy-avatar"
  // toyImg.setAttribute('class', 'toy-avatar')

  const toyLikes = document.createElement('p')
  toyLikes.innerText = `${toy.likes} likes`

  const likeButton = document.createElement('button')
  likeButton.innerText = "Like <3"
  likeButton.className = "like-btn"
  likeButton.id = toy.id
  likeButton.addEventListener("click", (e) => {
    handleLikeButton(e);
  })

  const toyCard = document.createElement('div')
  toyCard.className = "card"

  const collection = document.getElementById("toy-collection")
  collection.append(toyCard)
  
  toyCard.append(toyName, toyImg, toyLikes, likeButton)
}

function toyFormPost () {
  // grab form from html
  const addToyForm = document.querySelector('.add-toy-form')
  // event listener:
  addToyForm.addEventListener('submit', (e) => {
    // prevent normal html POST function
    e.preventDefault()
    // grab data from form e=event target=the form
    const newToyData = {
      name: e.target["name"].value,
      image: e.target["image"].value,
      likes: 0
    }
    // reset form input fields
    e.target.reset();
    // create an object with the input data
    const toyObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(newToyData)
    }
    // fetch POST data, update DOM and persist to database
    fetch('http://localhost:3000/toys', toyObj)
    .then(resp => resp.json())
    .then(toy => makeToyCard(toy))
    .catch(error => console.log(error))
  })
}
