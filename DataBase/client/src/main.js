console.log("Hello books!");

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();

  const data = new FormData(form);
  const formValues = Object.fromEntries(data);

  console.log(formValues);

  const serverResponse = await fetch("http://localhost:8080/wedding", {
    method: "POST",
    body: JSON.stringify(formValues),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const parsedResponse = await serverResponse.json();

  console.log("The parsed servers response is: ", parsedResponse);

  if (parsedResponse.success == true) {
    form.reset();

    getAndRenderWedding();
  }
}

const booksContainer = document.getElementById("books-container");

async function getAndRenderWedding() {
  const response = await fetch("http://localhost:8080/wedding");
  const data = await response.json();

  booksContainer.innerHTML = "";

  data.reverse().forEach(function (individualWedding) {
    const bookDiv = document.createElement("div");
    const name = document.createElement("p");
    const message = document.createElement("p");

    name.textContent = individualWedding.name;
    message.textContent = individualWedding.message;

    bookDiv.append(name, message);
    booksContainer.appendChild(bookDiv);
  });
}

getAndRenderWedding();
