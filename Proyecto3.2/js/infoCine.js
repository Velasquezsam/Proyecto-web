document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.dia-button');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'selected' class from all buttons
            buttons.forEach(btn => btn.classList.remove('selected'));
            // Add 'selected' class to the clicked button
            this.classList.add('selected');
        });
    });

    const leftButton = document.querySelector('.left-button');
    const rightButton = document.querySelector('.right-button');
    const diaButtons = document.querySelectorAll('.dia-button');

    const currentDate = new Date();
    let currentDayOfWeek = currentDate.getDay();
    let startDate = new Date(currentDate);

    function actualizarDiasSemana() {
        let startDayOfWeek = startDate.getDay();
        let diff = startDayOfWeek - 1;
        if (diff < 0) {
            diff = 6;
        }
        startDate.setDate(startDate.getDate() - diff);

        const diasSemana = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

        diaButtons.forEach((button, index) => {
            let date = new Date(startDate);
            date.setDate(startDate.getDate() + index);
            button.textContent = `${diasSemana[index]}\n${date.getDate()}`;
            button.style.whiteSpace = 'pre-line';
            button.style.textAlign = 'center';

            if (date < currentDate) {
                button.disabled = true;
                button.style.opacity = "0.5";
            } else {
                button.disabled = false;
                button.style.opacity = "1";
            }
        });
    }

    function irSemanaAnterior() {
        startDate.setDate(startDate.getDate() - 7);
        actualizarDiasSemana();
        actualizarEstadoBotones();
        diaButtons.forEach(button => button.classList.remove('selected'));
    }

    function irSemanaSiguiente() {
        startDate.setDate(startDate.getDate() + 7);
        actualizarDiasSemana();
        actualizarEstadoBotones();
        diaButtons.forEach(button => button.classList.remove('selected'));
    }

    function actualizarEstadoBotones() {
        leftButton.disabled = startDate <= new Date();

        let dosSemanasDespues = new Date();
        dosSemanasDespues.setDate(dosSemanasDespues.getDate() + 7);
        rightButton.disabled = startDate >= dosSemanasDespues;
    }

    leftButton.addEventListener('click', irSemanaAnterior);
    rightButton.addEventListener('click', irSemanaSiguiente);

    actualizarDiasSemana();
    actualizarEstadoBotones();

    const urlParams = new URLSearchParams(window.location.search);
    const theatreId = urlParams.get('id');
    const apiUrl = `https://cinexunidos-production.up.railway.app/theatres/${theatreId}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('cine-nombre').textContent = data.name;
            document.getElementById('cine-direccion').textContent = data.location;

            const cineImagen = document.getElementById('cine-imagen');
            if (data.images && data.images.length > 0) {
                cineImagen.src = `https://cinexunidos-production.up.railway.app/${data.images[0]}`;
                cineImagen.alt = `Imagen de ${data.name}`;
            } else {
                cineImagen.style.display = 'none';
            }

            const peliculasMap = new Map();
            const peliculasContainer = document.getElementById('peliculas-container');
            data.auditoriums.forEach(auditorium => {
                auditorium.showtimes.forEach(showtime => {
                    const movie = showtime.movie;

                    if (!peliculasMap.has(movie.id)) {
                        const movieElement = document.createElement('div');
                        movieElement.classList.add('cine');
                        movieElement.id = `movie-${movie.id}`;

                        const movieImage = document.createElement('img');
                        movieImage.src = `https://cinexunidos-production.up.railway.app/${movie.poster}`;
                        movieImage.alt = movie.name;
                        movieElement.appendChild(movieImage);

                        const detailsElement = document.createElement('div');
                        detailsElement.classList.add('details');

                        const movieTitle = document.createElement('h2');
                        movieTitle.textContent = movie.name;
                        detailsElement.appendChild(movieTitle);

                        const showtimesElement = document.createElement('div');
                        showtimesElement.classList.add('showtimes');
                        detailsElement.appendChild(showtimesElement);

                        movieElement.appendChild(detailsElement);
                        peliculasContainer.appendChild(movieElement);

                        peliculasMap.set(movie.id, showtimesElement);
                    }

                    const showtimesElement = peliculasMap.get(movie.id);

                    const showtimeButton = document.createElement('button');
                    showtimeButton.textContent = `${showtime.startTime} - ${auditorium.name}`;
                    showtimeButton.addEventListener('click', function() {
                        window.location.href = `asientos.html?sala=${auditorium.id}&pelicula=${movie.id}&horario=${showtime.id}&cine=${theatreId}`;
                    });
                    showtimesElement.appendChild(showtimeButton);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
