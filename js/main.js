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

    // --- ACTIVAR ESTRELLAS (NUEVO) ---
    inicializarEstrellas();
    
    // --- APLICAR TEMA GUARDADO ---
    if(localStorage.getItem('tema') === 'claro') aplicarTemaClaro();
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

// 5. AGREGADO: NUEVA LÓGICA DE CONTEO REALISTA
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

// ==========================================
//   NUEVAS FUNCIONES: COMENTARIOS Y CONSEJOS
// ==========================================

function publicarComentario() {
    const input = document.getElementById('nuevo-comentario');
    const texto = input.value;
    
    if (texto.trim() === "") return alert("¡Escribe un comentario primero!");

    const contenedor = document.getElementById('lista-comentarios');
    const user = localStorage.getItem('usuario_logueado');
    const nick = user ? user.split('@')[0].toUpperCase() : "INVITADO";

    const nuevoDiv = document.createElement('div');
    nuevoDiv.className = "bg-black/50 p-4 rounded-2xl border-l-4 border-orange-500 mb-4 animate-fade-in";
    nuevoDiv.innerHTML = `
        <p class="text-orange-500 font-black text-[10px] mb-1">${nick}</p>
        <p class="text-gray-300">${texto}</p>
    `;

    contenedor.prepend(nuevoDiv);
    input.value = ""; // Limpia el cuadro
}

function enviarConsejo() {
    const input = document.getElementById('input-consejo');
    const consejo = input.value;

    if (consejo.trim() === "") return;

    alert("¡Gracias por tu consejo! Lo revisaré para mejorar AniManga.");
    input.value = ""; // Limpia el cuadro
}

function inicializarEstrellas() {
    const estrellas = document.querySelectorAll('.fa-star');
    estrellas.forEach((estrella, index) => {
        estrella.onclick = () => {
            estrellas.forEach((s, i) => {
                if (i <= index) {
                    s.classList.replace('far', 'fas');
                    s.classList.add('text-yellow-500');
                } else {
                    s.classList.replace('fas', 'far');
                    s.classList.remove('text-yellow-500');
                }
            });
        };
    });
}

// ==========================================
//   LÓGICA DEL PANEL LATERAL (PERFIL)
// ==========================================

function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if(!sidebar || !overlay) return;
    
    sidebar.classList.toggle('translate-x-full');
    overlay.classList.toggle('hidden');
    
    if (!sidebar.classList.contains('translate-x-full')) {
        cargarPerfil();
    }
}

function cambiarTema() {
    const body = document.body;
    if (body.style.backgroundColor === "white") {
        body.style.backgroundColor = "#0b0e14";
        body.style.color = "#e1e1e1";
        localStorage.setItem('tema', 'oscuro');
    } else {
        aplicarTemaClaro();
        localStorage.setItem('tema', 'claro');
    }
}

function aplicarTemaClaro() {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
}

function cargarPerfil() {
    const favsContainer = document.getElementById('lista-favoritos-sidebar');
    const historialContainer = document.getElementById('lista-historial');
    if(!favsContainer || !historialContainer) return;

    // Cargar Favoritos en el Panel
    let favoritos = JSON.parse(localStorage.getItem('mis_favoritos')) || [];
    favsContainer.innerHTML = "";
    favoritos.forEach(id => {
        const anime = ANIMES.find(a => a.id === id);
        if (anime) {
            favsContainer.innerHTML += `
                <div onclick="irAlLector(${anime.id})" class="cursor-pointer group">
                    <img src="${anime.portada}" class="rounded-lg border border-gray-800 h-24 w-full object-cover">
                    <p class="text-[9px] mt-1 truncate font-bold uppercase">${anime.titulo}</p>
                </div>`;
        }
    });

    // Cargar Historial (Continuar viendo)
    historialContainer.innerHTML = "";
    let hayHistorial = false;
    ANIMES.forEach(anime => {
        const lastEp = localStorage.getItem(`last_ep_${anime.id}`);
        if (lastEp) {
            hayHistorial = true;
            historialContainer.innerHTML += `
                <div onclick="irAlLector(${anime.id})" class="flex items-center gap-3 p-2 bg-black/20 rounded-xl border border-gray-800 cursor-pointer hover:border-orange-500 transition">
                    <img src="${anime.portada}" class="w-10 h-10 rounded-lg object-cover">
                    <div>
                        <p class="text-[10px] font-black uppercase truncate w-32">${anime.titulo}</p>
                        <p class="text-orange-500 font-bold text-[9px]">Capítulo ${lastEp}</p>
                    </div>
                </div>`;
        }
    });
    if(!hayHistorial) historialContainer.innerHTML = '<p class="text-gray-600 text-[10px] italic text-center">No hay capítulos pendientes</p>';
}

function iniciarPago() {
    // Aquí es donde después vas a pegar tu link real de Mercado Pago
    const linkDePago = "https://www.mercadopago.com.ar"; 

    alert("¡Excelente elección! Te redirigimos a Mercado Pago para activar tu cuenta VIP.");
    
    // Esto abre el link de pago
    window.location.href = linkDePago;
}