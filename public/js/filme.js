const stars = document.getElementsByClassName("star");
const url = window.location;
const id = url.search.split("=")[1];
for (let i = 0; i < stars.length; i++) {
  stars[i].addEventListener("click", async () => {
    setStars(stars[i].id);

    const resposta = await fetch("/api/opiniao", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ valor: stars[i].id, idFilme: id }),
    });
    const respostaJson = await resposta.json();
    console.log(respostaJson);
    window.location.reload(true);
  });
}

function setStars(pontos) {
  for (let j = 0; j < parseInt(pontos); j++) {
    if (stars[j].className.includes("unchecked")) {
      stars[j].classList.remove("unchecked");
      stars[j].classList.add("checked");
    }
  }
  for (let j = stars.length - 1; j >= parseInt(pontos); j--) {
    if (stars[j].className.includes("checked")) {
      stars[j].classList.remove("checked");
      stars[j].classList.add("unchecked");
    }
  }
}

const poster = document.getElementById("poster");
const title = document.getElementById("title");
const desc = document.getElementById("description");
const rating = document.getElementById("rating");
const votos = document.getElementById("votos");
const ytb = document.getElementById("LinkYoutube");
const HLink = document.getElementById("MenuLink");

async function FetchFilme() {
  const filmeFetch = await fetch(`http://localhost:3000/api/filmes/${id}`);
  const filmejson = await filmeFetch.json();

  const imgURL = "http://localhost:3000";
  document.title = filmejson.nome;
  HLink.innerHTML = filmejson.nome;
  poster.src = imgURL + filmejson.poster;
  title.innerHTML = filmejson.nome;
  desc.innerHTML = filmejson.descricao;
  rating.innerHTML = filmejson.media.toFixed(1);
  votos.innerHTML = `(${filmejson.votos})`;
  ytb.href = filmejson.trailer;
}

async function FetchOpiniao() {
  const opiniaoFetch = await fetch(`http://localhost:3000/api/opiniao/${id}`);
  const opiniaojson = await opiniaoFetch.json();
  console.log(opiniaojson);
  if (opiniaoFetch.status == 401) {
    window.location.pathname = "index.html";
  }
  if (opiniaoFetch.status == 203) {
    console.log("votação vazia");
  }
  setStars(opiniaojson.valor);
}

window.onload = () => {
  FetchFilme();
  FetchOpiniao();
};
