document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll(".filtro-btn");
    const cards = document.querySelectorAll(".noticia-card");

    const mostrarNoticias = (categoria) => {
        cards.forEach(card => {
            const cardCategoria = card.dataset.categoria.toLowerCase();

            if (categoria === "todos" || cardCategoria === categoria) {
                card.style.display = "block"; // vuelve a mostrar
                setTimeout(() => {
                    card.classList.remove("oculto"); // animación lenta
                }, 50);
            } else {
                card.classList.add("oculto"); // desaparece lentamente
                setTimeout(() => {
                    card.style.display = "none"; // quita del grid
                }, 500); // coincide con transition-duration
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
