const toggle = document.getElementById("toggle");
const body = document.body;

var isWhite = false;

toggle.addEventListener("click", () => {
  body.classList.toggle("white");
  toggle.classList.toggle("white");
  isWhite = !isWhite;
  toggle.textContent = isWhite ? "🌙 Modo Escuro" : "☀️ Modo Claro";
});

function primeiraMaiuscula(texto) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

async function buscarPokemons(limit = 20) {
  const container = document.getElementById("list");

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  const data = await res.json();

  for (const p of data.results) {
    const [detalhes, especie] = await Promise.all([
      fetch(p.url).then((res) => res.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${p.name}`).then((res) =>
        res.json()
      ),
    ]);

    const nome = detalhes.name;
    const numero = detalhes.id;
    const tipos = detalhes.types.map((t) => t.type.name);
    const imagem = detalhes.sprites.front_default;

    const descricaoObj = especie.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );
    const descricao = descricaoObj
      ? descricaoObj.flavor_text.replace(/\f/g, " ")
      : "Sem descrição.";

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
         <div>
            <div class="labels">
                ${tipos.map((tipo) => `<div class=\"label\"> ${primeiraMaiuscula(tipo)} </div>`).join('')}
            </div>
            <div class="number">#${`${numero}`.padStart(3, "0")}</div>
        </div>
        <div class="description">
            <div class="content">
                <h3>${primeiraMaiuscula(nome)}</h3>
                <p>${descricao}</p>
                <button type="button">Saiba Mais</button>
            </div>
            <div class="image-list">
                <img src="${imagem}" alt="${nome}">
            </div>
        </div>
        `;

    container.appendChild(card);
  }
}

  buscarPokemons(30);
