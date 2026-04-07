document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll(".filtro-btn");
    const cards = document.querySelectorAll(".noticia-card");
    const container = document.querySelector(".noticias-cards");

    const mostrarNoticias = (categoria) => {
        cards.forEach(card => {
            const cardCategoria = card.dataset.categoria.toLowerCase();

            if (categoria === "todos" || cardCategoria === categoria) {
                card.classList.remove("oculto");
                card.style.display = "";  // Restaura el display original
            } else {
                card.classList.add("oculto");
                card.style.display = "none";  // Oculta completamente
            }
        });
    };

    botones.forEach(btn => {
        btn.addEventListener("click", () => {
            botones.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const categoria = btn.dataset.categoria.toLowerCase();
            mostrarNoticias(categoria);
        });
    });

    // Mostrar todas las noticias al inicio
    mostrarNoticias("todos");
});

// Dropdown filter functionality
const filtroBtn = document.getElementById('filtroBtn');
const filtroMenu = document.getElementById('filtroMenu');
const filtroSeleccionado = document.getElementById('filtroSeleccionado');
const dropdownFilter = document.querySelector('.dropdown-filter');

// Toggle dropdown
filtroBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownFilter.classList.toggle('active');
});

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', () => {
    dropdownFilter.classList.remove('active');
});

// Manejar selección de categoría
const filtroItems = document.querySelectorAll('.filtro-dropdown-menu li');
const noticiasCards = document.querySelectorAll('.noticia-card');

filtroItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Actualizar clase active en el menú
        filtroItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Actualizar texto del botón
        const categoriaTexto = item.textContent;
        filtroSeleccionado.textContent = categoriaTexto;
        
        // Filtrar noticias
        const categoria = item.dataset.categoria;
        
        noticiasCards.forEach(card => {
            const cardCategoria = card.dataset.categoria;
            if (categoria === 'todos' || cardCategoria === categoria) {
                card.classList.remove('oculto');
                card.style.display = '';
            } else {
                card.classList.add('oculto');
                card.style.display = 'none';
            }
        });
        
        // Cerrar dropdown
        dropdownFilter.classList.remove('active');
    });
});

// ================= CARRUSEL AUTOMÁTICO (lee las noticias del HTML) =================
function inicializarCarrusel() {
    // Obtener todas las tarjetas de noticias
    const noticiasCards = document.querySelectorAll('.noticia-card');
    const track = document.getElementById('carruselTrack');
    const indicators = document.getElementById('carruselIndicators');
    
    if (!track || !indicators || noticiasCards.length === 0) return;
    
    // Limpiar el carrusel actual
    track.innerHTML = '';
    indicators.innerHTML = '';
    
    let carruselItems = [];
    
    // Extraer datos de cada tarjeta de noticia
    noticiasCards.forEach((card, index) => {
        // Obtener la imagen
        const img = card.querySelector('img');
        const imgSrc = img ? img.src : '';
        
        // Obtener la categoría
        const categoriaSpan = card.querySelector('.noticia-categoria');
        const categoria = categoriaSpan ? categoriaSpan.innerHTML : '';
        
        // Obtener el título
        const tituloH3 = card.querySelector('h3');
        const titulo = tituloH3 ? tituloH3.innerText : '';
        
        // Obtener la descripción corta
        const descripcionP = card.querySelector('.descripcion');
        const descripcion = descripcionP ? descripcionP.innerText : '';
        
        carruselItems.push({ imgSrc, categoria, titulo, descripcion });
        
        // Crear slide
        const slide = document.createElement('div');
        slide.className = 'carrusel-slide';
        slide.innerHTML = `
            <img src="${imgSrc}" alt="${titulo}">
            <div class="carrusel-overlay">
                <span class="carrusel-categoria">${categoria}</span>
                <h3>${titulo}</h3>
                <p class="carrusel-descripcion">${descripcion.substring(0, 100)}${descripcion.length > 100 ? '...' : ''}</p>
            </div>
        `;
        track.appendChild(slide);
        
        // Crear indicador (punto)
        const dot = document.createElement('div');
        dot.className = 'carrusel-dot';
        if (index === 0) dot.classList.add('active');
        dot.onclick = () => irASlide(index);
        indicators.appendChild(dot);
    });
    
    let indiceActual = 0;
    let intervalo;
    
    function actualizarCarrusel() {
        track.style.transform = `translateX(-${indiceActual * 100}%)`;
        document.querySelectorAll('.carrusel-dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === indiceActual);
        });
    }
    
    function siguienteSlide() {
        indiceActual = (indiceActual + 1) % carruselItems.length;
        actualizarCarrusel();
        resetearIntervalo();
    }
    
    function irASlide(index) {
        indiceActual = index;
        actualizarCarrusel();
        resetearIntervalo();
    }
    
    function iniciarIntervalo() {
        intervalo = setInterval(siguienteSlide, 5000);
    }
    
    function resetearIntervalo() {
        clearInterval(intervalo);
        iniciarIntervalo();
    }
    
    // Pausar al hacer hover
    const carruselContainer = document.querySelector('.carrusel-container');
    if (carruselContainer) {
        carruselContainer.addEventListener('mouseenter', () => clearInterval(intervalo));
        carruselContainer.addEventListener('mouseleave', iniciarIntervalo);
    }
    
    iniciarIntervalo();
}

// Esperar a que el DOM esté listo y ejecutar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarCarrusel);
} else {
    inicializarCarrusel();
}