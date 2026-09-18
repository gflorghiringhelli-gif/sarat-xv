const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1n8aKar5IDKOMw9sFvlDOCsIBUMQN-Ak-rcFCSfT-rpsqgjX8fRS6A6ajnDpkngef4A/exec';

let revealedCount = 0;
let yaAbrio = false;
let explosionPétalosActivada = false;

// DETECTAR INVITADO VIP POR URL (?para=Familia+Perez)
function cargarInvitadoVIP() {
    const urlParams = new URLSearchParams(window.location.search);
    const para = urlParams.get('para');
    if (para) {
        const bloqueVip = document.getElementById('bloque-vip');
        const nombreVip = document.getElementById('nombre-invitado-vip');
        if (bloqueVip && nombreVip) {
            nombreVip.innerText = para.replace(/\+/g, ' ');
            bloqueVip.classList.remove('oculto');
        }
    }
}

function activarInvitacion() {
    if (yaAbrio) return;
    yaAbrio = true;

    const imgSobre = document.getElementById('imgSobreEstetica');
    const videoSobre = document.getElementById('videoSobre');
    const intro = document.getElementById('contenedor-principal');
    const btnTexto = document.getElementById('btn-toca-abrir');
    const musica = document.getElementById('musicaInvitacion');
    const musicIcon = document.getElementById('music-toggle');

    if (btnTexto) {
        btnTexto.innerHTML = "Abriendo... ✉️";
        btnTexto.style.opacity = "0.7";
    }

    if (musica) {
        musica.currentTime = 0;
        musica.play().catch(e => console.log("Audio play err:", e));
    }
    if (musicIcon) musicIcon.style.display = 'flex';

    if (imgSobre) imgSobre.style.opacity = '0';
    if (videoSobre) {
        videoSobre.style.display = 'block';
        videoSobre.currentTime = 0;
        let playPromise = videoSobre.play();

        const proceder = () => {
            transicionAFinal(intro);
        };

        if (playPromise !== undefined) {
            playPromise.then(() => {
                videoSobre.onended = proceder;
            }).catch(proceder);
        } else {
            videoSobre.onended = proceder;
        }
        setTimeout(proceder, 3500);
    } else {
        transicionAFinal(intro);
    }
}

function transicionAFinal(intro) {
    if (intro) {
        intro.style.transition = "opacity 0.8s ease";
        intro.style.opacity = '0';
    }
    setTimeout(() => {
        if (intro) intro.style.display = 'none';
        const seccionFinal = document.getElementById('seccion-final');
        const videoDeco = document.getElementById('videoDeco');

        if (seccionFinal) seccionFinal.classList.remove('oculto');
        if (videoDeco) videoDeco.play().catch(e => console.log("Video 2 play err:", e));

        window.scrollTo(0, 0);
        cargarInvitadoVIP();
        iniciarAnimacionesScroll();
        setInterval(actualizarContador, 1000);
        actualizarContador();
    }, 800);
}

function toggleMusic() {
    const musica = document.getElementById('musicaInvitacion');
    const icon = document.getElementById('music-toggle');
    if (!musica || !icon) return;
    if (musica.paused) {
        musica.play();
        icon.innerHTML = '<i class="fa-solid fa-music"></i>';
    } else {
        musica.pause();
        icon.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    }
}

function iniciarAnimacionesScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function revealDate(btn, text) {
  if (!btn.classList.contains('revealed')) {
    btn.innerText = text;
    btn.classList.add('revealed');
    revealedCount++;

    if (revealedCount === 3) {
      const msg = document.getElementById('revealed-date-msg');
      if (msg) msg.classList.add('show-revealed');
      if (!explosionPétalosActivada) {
          explosionPétalosActivada = true;
          lanzarFloresBlancas();
      }
    }
  }
}

// LLUVIA DE FLORES BLANCAS CON CENTRO DORADO
function lanzarFloresBlancas() {
    const c = document.getElementById('petalsCanvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const flores = [];
    for (let i = 0; i < 30; i++) {
        flores.push({
            x: Math.random() * c.width, y: -30,
            size: Math.random() * 5 + 4,
            speedY: Math.random() * 1.5 + 0.6,
            speedX: (Math.random() - 0.5) * 1.2,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.02,
            opacity: Math.random() * 0.75 + 0.25
        });
    }

    let frames = 0;
    function animar() {
        ctx.clearRect(0, 0, c.width, c.height);
        flores.forEach(f => {
            ctx.save();
            ctx.translate(f.x, f.y);
            ctx.rotate(f.angle);
            ctx.globalAlpha = f.opacity;

            ctx.fillStyle = '#ffffff';
            for (let j = 0; j < 5; j++) {
                ctx.rotate((Math.PI * 2) / 5);
                ctx.beginPath();
                ctx.ellipse(0, f.size * 0.7, f.size * 0.45, f.size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = '#c5a059';
            ctx.beginPath();
            ctx.arc(0, 0, f.size * 0.25, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

            f.y += f.speedY;
            f.x += Math.sin(frames * 0.025) * 0.4 + f.speedX;
            f.angle += f.spin;
        });
        frames++;
        if (frames < 380) requestAnimationFrame(animar);
        else ctx.clearRect(0, 0, c.width, c.height);
    }
    animar();
}

function actualizarContador() {
   const meta = new Date("2026-10-10T20:00:00").getTime();
   const dif = meta - new Date().getTime();
   if (dif > 0) {
       document.getElementById('days').innerText = Math.floor(dif / 86400000).toString().padStart(2, '0');
       document.getElementById('hours').innerText = Math.floor((dif % 86400000) / 3600000).toString().padStart(2, '0');
       document.getElementById('minutes').innerText = Math.floor((dif % 3600000) / 60000).toString().padStart(2, '0');
       document.getElementById('seconds').innerText = Math.floor((dif % 60000) / 1000).toString().padStart(2, '0');
   }
}

// ENVIAR DESEO DIRECTO A SHEETS (SIN PINTAR EN PANTALLA)
function enviarDeseo() {
    const name = document.getElementById('wishName').value.trim();
    const text = document.getElementById('wishText').value.trim();
    if (!name || !text) {
        mostrarToast('Completa tu nombre y mensaje 💕');
        return;
    }

    document.getElementById('wishName').value = '';
    document.getElementById('wishText').value = '';
    mostrarToast('¡Deseo enviado a Sarat! ✨💌');

    if (APPS_SCRIPT_URL) {
        fetch(`${APPS_SCRIPT_URL}?sheet=Deseo&name=${encodeURIComponent(name)}&text=${encodeURIComponent(text)}`, {
            method: 'POST'
        }).catch(err => console.log('Error sheet deseo:', err));
    }
}

// ENVIAR CANCIÓN DIRECTO A SHEETS (SIN PINTAR EN PANTALLA)
function pedirCancion() {
    const artist = document.getElementById('songArtist').value.trim();
    const title = document.getElementById('songTitle').value.trim();
    if (!artist || !title) {
        mostrarToast('Indica artista y canción 🎶');
        return;
    }

    document.getElementById('songArtist').value = '';
    document.getElementById('songTitle').value = '';
    mostrarToast('¡Canción enviada al DJ! 🎧');

    if (APPS_SCRIPT_URL) {
        fetch(`${APPS_SCRIPT_URL}?sheet=Canciones&artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`, {
            method: 'POST'
        }).catch(err => console.log('Error sheet canción:', err));
    }
}

function mostrarToast(txt) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.innerText = txt;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 2800);
  }
}