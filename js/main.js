// 1. FUNCIÓN PARA MOSTRAR LOS ANIMES EN LA PANTALLA PRINCIPAL
function mostrarAnimes(lista) {
    const contenedor = document.getElementById('contenedor-animes');
    if (!contenedor) return;
    contenedor.innerHTML = ""; 

    lista.forEach(anime => {
        const totalEpisodios = anime.episodios ? anime.episodios.length : 0;
        
        const card = `
            <div class="anime-card group relative cursor-pointer">
                <div onclick="irAlLector(${anime.id})">
                    <div class="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gray-800 group-hover:border-orange-500 transition-all">
                        <img src="${anime.portada}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                        <div class="absolute bottom-3 left-3">
                            <p class="text-orange-500 font-bold text-[10px]">EPS: ${totalEpisodios}</p>
                        </div>
                    </div>
                </div>
                <button onclick="toggleFavorito(${anime.id})" class="absolute top-2 right-2 z-10 bg-black/50 w-8 h-8 rounded-full hover:bg-orange-500 transition flex items-center justify-center">
                    <i class="fas fa-plus text-[10px]"></i>
                </button>
                <h3 class="mt-3 font-bold text-sm group-hover:text-orange-500 transition">${anime.titulo}</h3>
                <p class="text-[10px] text-gray-500 uppercase">${anime.categoria}</p>
            </div>
        `;
        contenedor.innerHTML += card;
    });
}

// 2. LÓGICA AL CARGAR LA PÁGINA
document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DE USUARIO ---
    const usuarioGuardado = localStorage.getItem('usuario_logueado');
    if (usuarioGuardado) {
        const loginLink = document.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.innerHTML = `<i class="fas fa-user-circle mr-1"></i> ${usuarioGuardado.split('@')[0].toUpperCase()}`;
            loginLink.classList.add('text-orange-500'); 
        }
    }

    // --- AGREGADO: ACTIVAR EL CONTEO REALISTA ---
    actualizarEstadisticasRealistas();

    mostrarAnimes(ANIMES); 

    const buscador = document.getElementById('input-busqueda');
    if (buscador) {
        buscador.addEventListener('input', (e) => {
            const texto = e.target.value.toLowerCase();
            const filtrados = ANIMES.filter(a => 
                a.titulo.toLowerCase().includes(texto) || 
                a.categoria.toLowerCase().includes(texto)
            );
            mostrarAnimes(filtrados);
        });
    }
});

// 3. FUNCIONES DE NAVEGACIÓN Y FAVORITOS
function irAlLector(id) {
    window.location.href = `lector.html?id=${id}`;
}

function toggleFavorito(id) {
    let favoritos = JSON.parse(localStorage.getItem('mis_favoritos')) || [];
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(favId => favId !== id);
        alert("Eliminado de favoritos");
    } else {
        favoritos.push(id);
        alert("¡Guardado en favoritos!");
    }
    localStorage.setItem('mis_favoritos', JSON.stringify(favoritos));
}

// 4. FUNCIONES VIP
function abrirVIP() {
    const modal = document.getElementById('modal-vip');
    if (modal) modal.classList.remove('hidden');
}

function cerrarVIP() {
    const modal = document.getElementById('modal-vip');
    if (modal) modal.classList.add('hidden');
}

// --- 5. AGREGADO: NUEVA LÓGICA DE CONTEO REALISTA ---
function actualizarEstadisticasRealistas() {
    let visitas = parseInt(localStorage.getItem('stats_visitas')) || 0;
    visitas++;
    localStorage.setItem('stats_visitas', visitas);
    
    const elVisitas = document.getElementById('total-visitas');
    if(elVisitas) elVisitas.innerText = visitas.toLocaleString();

    const elUser = document.getElementById('total-registrados');
    if(elUser) {
        let registrados = localStorage.getItem('usuario_logueado') ? 1 : 0;
        elUser.innerText = registrados;
    }

    const elOnline = document.getElementById('user-online');
    if(elOnline) elOnline.innerText = "1";
}