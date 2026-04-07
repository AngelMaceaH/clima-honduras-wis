// ================= HONDURAS - COORDENADAS CENTRALES =================
// Usamos el centro geográfico aproximado de Honduras
const LATITUD = 14.8;
const LONGITUD = -86.2;
const PAIS = "Honduras";

// Colores según nivel UV
function getUVColor(uvi) {
    if (uvi <= 2) return { bg: "#2ecc71", text: "Bajo", icon: "✅" };
    if (uvi <= 5) return { bg: "#f1c40f", text: "Moderado", icon: "⚠️" };
    if (uvi <= 7) return { bg: "#e67e22", text: "Alto", icon: "⚠️⚠️" };
    if (uvi <= 10) return { bg: "#e74c3c", text: "Muy Alto", icon: "🚨" };
    return { bg: "#9b59b6", text: "Extremo", icon: "☠️" };
}

// Recomendaciones según nivel UV
function getRecommendations(uvi) {
    if (uvi <= 2) {
        return [
            "✅ Seguro para estar al aire libre sin protección",
            "🧴 Protector solar solo si estarás mucho tiempo expuesto",
            "🕶️ Gafas de sol opcionales",
            "🌳 Disfruta del aire libre sin preocupaciones"
        ];
    } else if (uvi <= 5) {
        return [
            "🧴 Usa protector solar SPF 30+",
            "🧢 Usa sombrero o gorra para proteger tu rostro",
            "🕶️ Gafas de sol recomendadas para evitar daño ocular",
            "⛱️ Busca sombra durante las horas centrales del día"
        ];
    } else if (uvi <= 7) {
        return [
            "⚠️ PROTECCIÓN OBLIGATORIA",
            "🧴 Protector solar SPF 50+ cada 2 horas",
            "🧢 Sombrero de ala ancha para mayor protección",
            "🕶️ Gafas de sol con protección UV certificada",
            "⛱️ Evita el sol entre 10am y 4pm"
        ];
    } else if (uvi <= 10) {
        return [
            "🚨 RIESGO MUY ALTO - EXTREMA PRECAUCIÓN",
            "🧴 SPF 50+ y reaplicar cada hora",
            "🧥 Ropa de manga larga y tela gruesa",
            "🏠 Permanece en interiores si es posible",
            "⛱️ SOMBRA ESTRICTA - No te expongas directamente"
        ];
    } else {
        return [
            "☠️ RIESGO EXTREMO - PELIGRO INMINENTE",
            "🚫 NO TE EXPONGAS AL SOL BAJO NINGUNA CIRCUNSTANCIA",
            "🏠 Permanece en interiores hasta que el índice disminuya",
            "🧴 Si es absolutamente necesario salir, SPF 50+ y protección total",
            "📱 Revisa el índice constantemente antes de planificar actividades"
        ];
    }
}

// Calcular porcentaje para la barra (UV máximo 11+)
function getBarPercentage(uvi) {
    return Math.min((uvi / 11) * 100, 100);
}

// Formatear hora
function formatHour(timeString) {
    const date = new Date(timeString);
    return date.toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' });
}

// Obtener el índice UV desde la API
async function fetchUVIndex() {
    const uvContent = document.getElementById('uvContent');
    
    if (!uvContent) return;
    
    try {
        uvContent.innerHTML = `
            <div class="loading-uv">
                <i class="ri-loader-4-line ri-spin"></i> Cargando Índice UV para ${PAIS}...
            </div>
        `;
        
        const response = await fetch(
            `https://currentuvindex.com/api/v1/uvi?latitude=${LATITUD}&longitude=${LONGITUD}`
        );

        if (!response.ok) throw new Error('Error al obtener datos');
        
        const data = await response.json();
        
        if (!data.ok) throw new Error(data.message || 'Error en la respuesta de la API');

        const currentUV = data.now.uvi;
        const color = getUVColor(currentUV);
        const percentage = getBarPercentage(currentUV);
        const recommendations = getRecommendations(currentUV);
        
        let forecast = [];
        if (data.forecast && Array.isArray(data.forecast)) {
            forecast = data.forecast.filter((_, index) => index % 3 === 0).slice(0, 6);
        }

        uvContent.innerHTML = `
            <div class="uv-card">
                <div class="uv-location">
                    <i class="ri-map-pin-line"></i> 🇭🇳 ${PAIS}
                    <small>- Promedio nacional</small>
                </div>
                
                <div class="uv-value">
                    <div class="uv-number" style="color: ${color.bg}">${currentUV}</div>
                    <div class="uv-label">ÍNDICE UV</div>
                    <div class="uv-level" style="color: ${color.bg}">
                        ${color.icon} Nivel ${color.text} ${color.icon}
                    </div>
                </div>

                <div class="uv-bar-container">
                    <div class="uv-bar" style="width: ${percentage}%; background: ${color.bg};"></div>
                </div>

                ${forecast.length > 0 ? `
                    <div class="uv-hours">
                        ${forecast.map(hour => `
                            <div class="uv-hour-item">
                                <div class="uv-hour-time">${formatHour(hour.time)}</div>
                                <div class="uv-hour-value" style="color: ${getUVColor(hour.uvi).bg}">${hour.uvi}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <div class="uv-recommendations">
                    <h3><i class="ri-shield-star-line"></i> Recomendaciones de protección</h3>
                    <ul>
                        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>

                <div style="font-size: 11px; text-align: center; margin-top: 20px; opacity: 0.5;">
                    <i class="ri-database-2-line"></i> Datos: CurrentUVIndex.com | Tiempo real
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Error:', error);
        uvContent.innerHTML = `
            <div class="error-uv">
                <i class="ri-error-warning-line"></i>
                <strong>❌ Error al cargar el Índice UV para ${PAIS}</strong>
                <br>
                <small>${error.message}</small>
                <br>
                <button onclick="location.reload()">
                    <i class="ri-refresh-line"></i> Reintentar
                </button>
            </div>
        `;
    }
}

// Inicializar cuando la página cargue
document.addEventListener('DOMContentLoaded', () => {
    fetchUVIndex();
    // Actualizar cada 30 minutos
    setInterval(fetchUVIndex, 30 * 60 * 1000);
});