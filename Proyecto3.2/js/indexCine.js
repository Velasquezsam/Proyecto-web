// indexCine.js

function App() {}

window.onload = function(event){
    var app = new App();
    window.app = app;

    // Llamar función para cargar cines al cargar la página
    fetchAndDisplayTheatres();
}

// Función para obtener y mostrar los cines
function fetchAndDisplayTheatres() {
    fetch('https://cinexunidos-production.up.railway.app/theatres')
        .then(response => response.json())
        .then(data => {
            // Obtener el contenedor donde se mostrarán los cines
            const theatreContainer = document.getElementById('carrusel-list');

            // Limpiar el contenedor antes de agregar nuevos elementos
            theatreContainer.innerHTML = '';

            // Iterar sobre cada cine y crear elementos para mostrarlos
            data.forEach(theatre => {
                const theatreElement = document.createElement('div');
                theatreElement.classList.add('carrusel');

                const link = document.createElement('a');
                link.href = `../html/infoCine.html?id=${theatre.id}`; // Ajustar la URL según tu estructura y necesidades

                const h4 = document.createElement('h4');
                h4.innerHTML = `<small>${theatre.name}</small> Más`;

                const picture = document.createElement('picture');
                const img = document.createElement('img');
                img.src = `https://cinexunidos-production.up.railway.app/${theatre.images[0]}`; // Asumiendo que las imágenes están en un array "images" dentro de cada cine
                img.alt = `Imagen de ${theatre.name}`; // Usando el nombre del cine para el atributo alt

                picture.appendChild(img);
                link.appendChild(h4);
                link.appendChild(picture);
                theatreElement.appendChild(link);

                // Agregar el evento para redireccionar a la página de asientos.html con parámetros
                link.addEventListener('click', function() {
                    window.location.href = `asientos.html?cine=${theatre.id}`;
                });

                theatreContainer.appendChild(theatreElement);
            });
        })
        .catch(error => {
            console.error('Error al obtener los cines:', error);
        });
}

App.prototype.processingButton = function(event){
    const btn = event.currentTarget;
    const carruselList = event.currentTarget.parentNode;
    const track = event.currentTarget.parentNode.querySelector('#track');
    const carrusel = track.querySelectorAll('.carrusel');

    const carruselWidth = carrusel[0].offsetWidth;
    const trackWidth = track.offsetWidth;
    const listWidth = carruselList.offsetWidth;

    let leftPosition = track.style.left ? parseFloat(track.style.left.slice(0, -2) * -1) : 0;
    if (btn.dataset.button === "button-prev") {
        prevAction(leftPosition, carruselWidth, track);
    } else {
        nextAction(leftPosition, trackWidth, listWidth, carruselWidth, track);
    }
}

function prevAction(leftPosition, carruselWidth, track) {
    if (leftPosition > 0) {
        track.style.left = `${-1 * (leftPosition - carruselWidth)}px`;
    }
}

function nextAction(leftPosition, trackWidth, listWidth, carruselWidth, track) {
    if (leftPosition < (trackWidth - listWidth)) {
        track.style.left = `${-1 * (leftPosition + carruselWidth)}px`;
    }
}
