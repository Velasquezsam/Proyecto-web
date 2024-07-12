// Seleccionar todos los botones de aumentar y disminuir cantidad
const decrementButtons = document.querySelectorAll('.product-controls button:first-of-type');
const incrementButtons = document.querySelectorAll('.product-controls button:last-of-type');

// Seleccionar el total y el botón de pagar
const totalElement = document.querySelector('.cart p');
const payButton = document.querySelector('.cart button');

// Inicializar total
let total = 0;

// Función para actualizar el total en el DOM
function updateTotal() {
    totalElement.textContent = `Total: $${total}`;
}

// Función para manejar la disminución de la cantidad
function handleDecrement(event) {
    const productControls = event.target.parentElement;
    const quantityElement = productControls.querySelector('p');
    let quantity = parseInt(quantityElement.textContent);
    
    if (quantity > 0) {
        quantity--;
        quantityElement.textContent = quantity;
        const productPrice = parseInt(productControls.previousElementSibling.querySelector('p').textContent.replace('$', ''));
        total -= productPrice;
        updateTotal();
    }
}

// Función para manejar el aumento de la cantidad
function handleIncrement(event) {
    const productControls = event.target.parentElement;
    const quantityElement = productControls.querySelector('p');
    let quantity = parseInt(quantityElement.textContent);
    
    quantity++;
    quantityElement.textContent = quantity;
    const productPrice = parseInt(productControls.previousElementSibling.querySelector('p').textContent.replace('$', ''));
    total += productPrice;
    updateTotal();
}

// Agregar los event listeners a los botones
decrementButtons.forEach(button => button.addEventListener('click', handleDecrement));
incrementButtons.forEach(button => button.addEventListener('click', handleIncrement));

// Función para manejar el pago
function handlePay() {
    if (total > 0) {
        alert(`El total a pagar es $${total}`);
        // Reiniciar las cantidades y el total después del pago
        document.querySelectorAll('.product-controls p').forEach(quantityElement => quantityElement.textContent = '0');
        total = 0;
        updateTotal();
    } else {
        alert('El carrito está vacío.');
    }
}

// Agregar el event listener al botón de pagar
payButton.addEventListener('click', handlePay);

// Inicializar el total al cargar la página
updateTotal();
