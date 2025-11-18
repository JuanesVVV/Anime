import { db } from "../firebaseConfig.js";
import { doc, setDoc } from "firebase/firestore";

export default function mostrarOriginal() {
  const contenedor = document.getElementById("app");
  contenedor.innerHTML = `
    <h2>Explorar animes por temporada</h2>
    <div class="filtro-temporada">
      <label>Año: <input type="number" id="anio" value="2023" /></label>
      <label>Temporada:
        <select id="temporada">
          <option value="winter">Invierno</option>
          <option value="spring">Primavera</option>
          <option value="summer">Verano</option>
          <option value="fall">Otoño</option>
        </select>
      </label>
      <button id="btnBuscar">Buscar</button>
    </div>
    <div id="resultados"></div>
  `;

  document.getElementById("btnBuscar").addEventListener("click", async () => {
    const year = document.getElementById("anio").value;
    const season = document.getElementById("temporada").value;
    const resultados = document.getElementById("resultados");
    resultados.innerHTML = "<p>Cargando...</p>";

    try {
      const res = await fetch(`https://api.jikan.moe/v4/seasons/${year}/${season}`);
      const { data } = await res.json();
      resultados.innerHTML = "";

      data.forEach(anime => {
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

        const agregarBtn = document.createElement("button");
        agregarBtn.textContent = "Agregar para ver";
        agregarBtn.className = "boton-agregar";

        agregarBtn.addEventListener("click", async () => {
          const animeData = {
            mal_id: anime.mal_id,
            title: anime.title,
            title_japanese: anime.title_japanese,
            title_english: anime.title_english,
            image: anime.images.jpg.large_image_url,
            score: anime.score,
            rank: anime.rank,
            type: anime.type,
            synopsis: anime.synopsis,
            url: anime.url,
            temporada: season,
            año: year,
            timestamp: Date.now()
          };

          try {
            await setDoc(doc(db, "lista-ver", anime.mal_id.toString()), animeData);
            agregarBtn.textContent = "Agregado ✅";
            agregarBtn.disabled = true;
            agregarBtn.style.backgroundColor = "#2ecc71";
          } catch (error) {
            console.error("Error al guardar:", error);
            agregarBtn.textContent = "Error 😢";
          }
        });

        card.innerHTML = `
          <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
          <div class="app-info">
            <h3>${anime.title}</h3>
            <p><strong>Nombre japonés:</strong> ${anime.title_japanese ?? "N/A"}</p>
            <p><strong>Nombre en inglés:</strong> ${anime.title_english ?? "N/A"}</p>
            <p><strong>Tipo:</strong> ${anime.type}</p>
            <p><strong>Ranking:</strong> ${anime.rank ?? "N/A"}</p>
            <p><strong>Score:</strong> ${anime.score ?? "N/A"}</p>
            <p><strong>Descripción:</strong></p>
          </div>
        `;

        const info = card.querySelector(".app-info");
        info.appendChild(agregarBtn);
        info.appendChild(descripcion);
        info.appendChild(toggle);

        resultados.appendChild(card);
      });
    } catch (error) {
      console.error("Error al cargar animes:", error);
      resultados.innerHTML = "<p>Error al cargar los animes 😢</p>";
    }
  });
}