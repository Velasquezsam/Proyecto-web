document.addEventListener('DOMContentLoaded', function() {
    // Temporizador de 1 minuto
    const elementoContador = document.getElementById('contador');
    let tiempo = 10 * 60;

    function actualizarContador() {
        const minutos = Math.floor(tiempo / 60);
        const segundos = tiempo % 60;
        elementoContador.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        tiempo--;

        if (tiempo < 0) {
            clearInterval(intervaloContador);
            alert('El tiempo ha expirado.');

            // Llamar a la función liberarReservaDeAsientos
            liberarReservaDeAsientos().then(() => {
                // Redirección a cines.html después de liberar los asientos
                liberarReservaDeAsientos();
                window.location.href = 'cines.html';
                
            });
        }
    }

    const intervaloContador = setInterval(actualizarContador, 1000);

    obtenerAsientos();
});

const precios = {
    adulto: 2,
    nino: 1,
    mayor: 1
};

function actualizarTotal() {
    const cantidadAdulto = parseInt(document.querySelector('.cantidad.ba').textContent);
    const cantidadNino = parseInt(document.querySelector('.cantidad.bn').textContent);
    const cantidadMayor = parseInt(document.querySelector('.cantidad.bm').textContent);

    const precioAdulto = cantidadAdulto * precios.adulto;
    const precioNino = cantidadNino * precios.nino;
    const precioMayor = cantidadMayor * precios.mayor;

    document.querySelector('.precio-adulto').textContent = `${precioAdulto}$`;
    document.querySelector('.precio-nino').textContent = `${precioNino}$`;
    document.querySelector('.precio-mayor').textContent = `${precioMayor}$`;

    const precioTotal = precioAdulto + precioNino + precioMayor;
    document.querySelector('.total p').textContent = `Total ${precioTotal}$`;
}

document.querySelectorAll('.add').forEach(button => {
    button.addEventListener('click', function() {
        const cantidadElement = this.parentNode.querySelector('.cantidad');
        let cantidad = parseInt(cantidadElement.textContent);
        cantidadElement.textContent = cantidad + 1;
        actualizarTotal();
    });
});

document.querySelectorAll('.subtract').forEach(button => {
    button.addEventListener('click', function() {
        const cantidadElement = this.parentNode.querySelector('.cantidad');
        let cantidad = parseInt(cantidadElement.textContent);
        if (cantidad > 0) {
            cantidadElement.textContent = cantidad - 1;
            actualizarTotal();
        }
    });
});


const urlParams = new URLSearchParams(window.location.search);
const auditoriumId = urlParams.get('sala');
const peliculaId = urlParams.get('pelicula');
const showtimeId = urlParams.get('horario');
const theatreId = urlParams.get('cine');

async function obtenerAsientos() {
    try {
        const response = await fetch(`https://cinexunidos-production.up.railway.app/theatres/${theatreId}/auditoriums/${auditoriumId}/showtimes/${showtimeId}`);
        const data = await response.json();
        mostrarAsientos(data.seats);
        
    } catch (error) {
        console.error('Error al obtener los datos de la API:', error);
    }
}

async function reservarAsiento(asientoId) {
    try {
        const response = await fetch(`https://cinexunidos-production.up.railway.app/theatres/${theatreId}/auditoriums/${auditoriumId}/showtimes/${showtimeId}/reserve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ seat: asientoId })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error reservando el asiento');
        }
        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error(error.message);
    }
}

async function liberarReservaAsiento(asientoId) {
    try {
        const response = await fetch(`https://cinexunidos-production.up.railway.app/theatres/${theatreId}/auditoriums/${auditoriumId}/showtimes/${showtimeId}/reserve`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ seat: asientoId })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error liberando el asiento');
        }
        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error(error.message);
    }
}

function seleccionarAsiento(asiento) {
    const asientoId = asiento.dataset.id; // Suponiendo que cada botón de asiento tiene un data-id con su identificador
    if (asiento.classList.contains('asiento-selec')) {
        liberarAsiento(asiento);
    } else {
        reservarAsiento(asientoId).then(() => {
            asiento.classList.remove('asiento-dispo');
            asiento.classList.add('asiento-selec');
            asiento.removeEventListener('click', seleccionarAsiento);
            asiento.addEventListener('click', () => liberarAsiento(asiento));
        }).catch(error => {
            console.error(error);
            alert('No se pudo reservar el asiento. Inténtalo de nuevo.');
        });
    }
}

function liberarAsiento(asiento) {
    const asientoId = asiento.dataset.id; // Suponiendo que cada botón de asiento tiene un data-id con su identificador
    liberarReservaAsiento(asientoId).then(() => {
        asiento.classList.remove('asiento-selec');
        asiento.classList.add('asiento-dispo');
        asiento.disabled = false;
        asiento.removeEventListener('click', liberarAsiento);
        asiento.addEventListener('click', () => seleccionarAsiento(asiento));
    }).catch(error => {
        console.error(error);
        alert('No se pudo liberar el asiento. Inténtalo de nuevo.');
    });
}

// Contador para asientos disponibles
let asientosDisponibles = 0;

function mostrarAsientos(asientos) {
    const seleccionAsientos = document.querySelector('.seleccion-asientos');

    // Mostrar el nombre de la sala
    document.getElementById('nombre-sala').textContent = `Sala ${auditoriumId}`;

    Object.keys(asientos).forEach(fila => {
        const filaAsientos = document.createElement('section');
        filaAsientos.classList.add('fila-asientos');

        const nombreFila = document.createElement('h4');
        nombreFila.textContent = `${fila}`;
        filaAsientos.appendChild(nombreFila);

        asientos[fila].forEach((tipo, index) => {
            const tipoAsiento = document.createElement('button');
            tipoAsiento.classList.add('info-asiento');
            const asientoId = `${fila}${index}`; // Genera el ID del asiento basado en la fila y el índice
            tipoAsiento.dataset.id = asientoId;
            tipoAsiento.textContent = asientoId;

            switch (tipo) {
                case -1:
                    tipoAsiento.classList.add('asiento-no');
                    tipoAsiento.disabled = true;
                    tipoAsiento.style.opacity = 0;
                    break;
                case 0:
                    tipoAsiento.classList.add('asiento-dispo');
                    tipoAsiento.addEventListener('click', () => seleccionarAsiento(tipoAsiento));
                    asientosDisponibles++; // Incrementa el contador de asientos disponibles
                    break;
                case 1:
                    tipoAsiento.classList.add('asiento-ocu');
                    tipoAsiento.disabled = true;
                    break;
                case 2:
                    tipoAsiento.classList.add('asiento-reser');
                    tipoAsiento.disabled = true;
                    tipoAsiento.addEventListener('click', () => liberarAsiento(tipoAsiento));
                    break;
                default:
                    tipoAsiento.classList.add('asiento-selec');
                    tipoAsiento.textContent = 'Estado desconocido';
                    break;
            }

            filaAsientos.appendChild(tipoAsiento);
        });

        seleccionAsientos.appendChild(filaAsientos);
    });

    // Actualizar la cantidad de asientos disponibles
    document.getElementById('asientos-disponibles').textContent = asientosDisponibles;
}

document.getElementById('btn-otro').addEventListener('click', async function(event) {
    event.preventDefault(); // Evita que el enlace redireccione automáticamente
    
    const target = event.target;
    const targetClass = target.classList.contains('carameleria') ? 'carameleria' : 'pagar';
    
    // Obtener la cantidad total de boletos comprados
    const cantidadAdulto = parseInt(document.querySelector('.cantidad.ba').textContent);
    const cantidadNino = parseInt(document.querySelector('.cantidad.bn').textContent);
    const cantidadMayor = parseInt(document.querySelector('.cantidad.bm').textContent);
    const cantidadTotalBoletos = cantidadAdulto + cantidadNino + cantidadMayor;

    // Obtener la cantidad total de asientos seleccionados
    const cantidadAsientosSeleccionados = document.querySelectorAll('.asiento-selec').length;

    // Validar si las cantidades coinciden
    if (cantidadTotalBoletos !== cantidadAsientosSeleccionados) {
        alert('La cantidad de asientos seleccionados no coincide con la cantidad de boletos comprados. Por favor, revisa tu selección.');
    } else if (cantidadTotalBoletos === 0 && cantidadAsientosSeleccionados === 0) {
        alert('Debe seleccionar asientos y adquirir boletos.');
    } else {
        // Procesar la reserva de los asientos seleccionados
        const asientosSeleccionados = document.querySelectorAll('.asiento-selec');
        const asientosReservados = [];

        // Reservar los asientos seleccionados
        for (const asiento of asientosSeleccionados) {
            const asientoId = asiento.dataset.id;
            await reservarAsiento(asientoId); // Reservar el asiento en la API
            asientosReservados.push(asientoId);
        }

        // Actualizar los asientos en la interfaz a ocupados y deshabilitar clics
        asientosReservados.forEach(asientoId => {
            const asiento = document.querySelector(`button[data-id="${asientoId}"]`);
            asiento.classList.remove('asiento-selec');
            asiento.classList.add('asiento-ocu');
            asiento.disabled = true;
        });
        
        // Redirigir a la página correspondiente
        if (targetClass === 'carameleria') {
            window.location.href = 'carameleria.html';
        } else if (targetClass === 'pagar') {
            alert('Felicidades, su salida al cine le saldra completamente gratis.');
        }
    }
});

async function liberarReservaDeAsientos() {
    const asientosSeleccionados = document.querySelectorAll('.asiento-selec');
    for (const asiento of asientosSeleccionados) {
        const asientoId = asiento.dataset.id;
        await liberarReservaAsiento(asientoId); // Llamada a la función para liberar el asiento en la API
        asiento.classList.remove('asiento-selec');
        asiento.classList.add('asiento-dispo');
        asiento.disabled = false;
        asiento.removeEventListener('click', liberarAsiento);
        asiento.addEventListener('click', () => seleccionarAsiento(asiento));
    }
}

async function conectarSocket() {
    const socket = io('wss://cinexunidos-production.up.railway.app/', {
        auth: {
            token: 'ABC-456', // Se debería sustituir por un token real...
            name: 'username',
        },
    });

    socket.on('connect', () => {
        console.log('Conectado al servidor de WebSocket');
        socket.emit('online-users', { userId: 'usuario123', username: 'Usuario' });
    });

    socket.on('disconnect', () => {
        console.log('Desconectado del servidor de WebSocket');
    });

    socket.on('online-users', (users) => {
        console.log('Usuarios en línea:', users);
        actualizarListaUsuarios(users);
    });

    socket.on('new-message', (message) => {
        console.log('Nuevo mensaje recibido:', message);
        agregarMensaje(message);
    });

    document.querySelector('.input').addEventListener('submit', (event) => {
        event.preventDefault();
        const mensaje = event.target.querySelector('input').value;

        if (mensaje.trim()) {
            enviarMensaje(socket, mensaje);
            event.target.querySelector('input').value = '';
        }
    });

}

function enviarMensaje(socket, mensaje) {
    const message = {
        from: 'usuario',
        text: mensaje,
        createdAt: new Date().getTime()
    };

    socket.emit('send-message', message);
}

function agregarMensaje(data) {
    if (data && data.message && data.message.text) {
    const chatBody = document.querySelector('#chat-body');
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p>${data.message.from}: ${data.message.text}</p>`;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    }
}

function actualizarListaUsuarios(users) {
    const usersList = document.querySelector('#users-list');
    usersList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.username} (${user.userId})`;
        usersList.appendChild(li);
    });
}

function toggleChat() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.style.display = chatContainer.style.display === 'none' || !chatContainer.style.display ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    conectarSocket();
});
 