document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = `https://cinexunidos-production.up.railway.app/theatres/sambil-chacao`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const peliculasContainer = document.getElementById('peliculas-container');
            const peliculasMap = new Map();

            data.auditoriums.forEach(auditorium => {
                auditorium.showtimes.forEach(showtime => {
                    const movie = showtime.movie;

                    if (!peliculasMap.has(movie.id)) {
                        const movieElement = document.createElement('div');
                        movieElement.classList.add('img');
                        movieElement.id = `movie-${movie.id}`;

                        const movieImage = document.createElement('img');
                        movieImage.src = `https://cinexunidos-production.up.railway.app/${movie.poster}`;
                        movieImage.alt = movie.name;
                        movieElement.appendChild(movieImage);

                        const movieDetails = document.createElement('div');
                        movieDetails.classList.add('details');
                        movieDetails.innerHTML = `
                            <h2>${movie.name}</h2>
                            <p>Duración: ${movie.runningTime}</p>
                            <p>Rating: ${movie.rating}</p>
                        `;
                        movieElement.appendChild(movieDetails);

                        peliculasContainer.appendChild(movieElement);
                        peliculasMap.set(movie.id, movie);
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
