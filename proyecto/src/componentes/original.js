export default function mostrarOriginal() {
  const contenedor = document.getElementById("app");
  contenedor.innerHTML = `
    <h2>Explorar animes por temporada</h2>
    <div class="filtro-temporada">
      <div>
        <label for="anio">Año:</label>
        <input type="number" id="anio" value="2023" min="2000" max="2025" />
      </div>
      <div>
        <label for="temporada">Temporada:</label>
        <select id="temporada">
          <option value="winter">Invierno</option>
          <option value="spring">Primavera</option>
          <option value="summer">Verano</option>
          <option value="fall">Otoño</option>
        </select>
      </div>
      <button id="btnBuscar">Buscar</button>
    </div>
    <div id="resultados"></div>
  `;

  document.getElementById("btnBuscar").addEventListener("click", async () => {
    const year = document.getElementById("anio").value;
    const season = document.getElementById("temporada").value;
    const resultados = document.getElementById("resultados");

    resultados.innerHTML = "<p>Cargando animes de temporada...</p>";

    try {
      const res = await fetch(`https://api.jikan.moe/v4/seasons/${year}/${season}`);
      const { data } = await res.json();

      resultados.innerHTML = "";

      data.forEach(anime => {
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
          <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
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

        resultados.appendChild(card);
      });
    } catch (error) {
      console.error("Error al cargar animes de temporada:", error);
      resultados.innerHTML = "<p>Error al cargar los animes 😢</p>";
    }
  });
}