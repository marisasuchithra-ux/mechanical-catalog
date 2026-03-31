const API_URL = "/api/parts";

async function fetchParts() {
  const res = await fetch(API_URL);
  const parts = await res.json();

  const catalog = document.getElementById("catalog");
  catalog.innerHTML = "";

  parts.forEach(part => {
    catalog.innerHTML += `
      <div class="card">
        <img src="${part.image}" />
        <h3>${part.name}</h3>
        <p>${part.category}</p>
        <p>$${part.price}</p>
        <p>${part.description}</p>
        <button onclick="deletePart(${part.id})">Delete</button>
      </div>
    `;
  });
}

async function addPart() {
  const part = {
    name: document.getElementById("name").value,
    category: document.getElementById("category").value,
    price: document.getElementById("price").value,
    description: document.getElementById("description").value,
    image: document.getElementById("image").value,
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(part),
  });

  fetchParts();
}

async function deletePart(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchParts();
}

fetchParts();