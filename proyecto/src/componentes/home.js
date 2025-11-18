export default async function mostrarHome() {
  const appContainer = document.getElementById("app");
  appContainer.innerHTML = "<h2>Cargando animes populares...</h2>";

  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime");
    const { data: animes } = await response.json();

    appContainer.innerHTML = "";

    animes.forEach((anime) => {
      const nombres = [
        anime.title_japanese,
        anime.title_english,
        ...anime.titles.map(t => t.title)
      ].filter((v, i, arr) => v && arr.indexOf(v) === i);

      const card = document.createElement("div");
      card.classList.add("app-card");

      const descripcion = document.createElement("p");
      descripcion.className = "descripcion-expandible";
      descripcion.textContent = anime.synopsis ?? "Sin descripción disponible.";

      const toggle = document.createElement("button");
      toggle.className = "boton-toggle";
      toggle.textContent = "Mostrar más";
      toggle.onclick = () => {
        descripcion.classList.toggle("expandida");
        toggle.textContent = descripcion.classList.contains("expandida")
          ? "Mostrar menos"
          : "Mostrar más";
      };

      card.innerHTML = `
        <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
        <div class="app-info">
          <h3>${anime.title}</h3>
          <p><strong>Nombre japonés:</strong> ${anime.title_japanese ?? "N/A"}</p>
          <p><strong>Nombre en inglés:</strong> ${anime.title_english ?? "N/A"}</p>
          <p><strong>Sinónimos:</strong> ${nombres.join(" / ")}</p>
          <p><strong>Tipo:</strong> ${anime.type}</p>
          <p><strong>Ranking:</strong> ${anime.rank ?? "N/A"}</p>
          <p><strong>Score:</strong> ${anime.score ?? "N/A"}</p>
          <p><strong>Descripción:</strong></p>
        </div>
      `;

      const info = card.querySelector(".app-info");
      info.appendChild(descripcion);
      info.appendChild(toggle);

      appContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    appContainer.innerHTML = "<p>Error al cargar los animes 😢</p>";
  }
}