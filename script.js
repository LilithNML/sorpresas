document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const secretCodeInput = document.getElementById('secretCode');
    const unlockButton = document.getElementById('unlockButton');
    const messageDisplay = document.getElementById('message');
    const unlockedSurprisesList = document.getElementById('unlockedSurprises');
    const confirmationMessage = document.getElementById('confirmation');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const body = document.body;

    // --- Configuración de Códigos Secretos y Archivos ---
    const secretCodes = {
        'vuqgsrnbbkuwswtrwhjcqdnwdvyypa': {
            name: 'contraseñas',
            file: 'contrasenas.PDF'
        },
        'mividaentera': {
            name: 'Carta de amor especial',
            file: 'data:text/plain,la carta de amor de mi vida entera' //
        },
        'siemprejuntos': {
            name: 'Recuerdo de nuestro primer viaje',
            file: 'https://picsum.photos/id/237/200/300' //
        },
        'miprincipe': {
            name: 'Una lista de cosas que amo de ti',
            file: 'data:text/plain,Esta es la lista de cosas que amo de ti: 1. Tu sonrisa. 2. Tu abofeda. 3. Tu infierno humor.'
        }
        // Agrega más códigos aquí
    };

    // --- Funcionalidad de Historial Local ---
    const LOCAL_STORAGE_KEY = 'unlockedCodes'; // Cambiamos la clave para mayor claridad

    // Carga el historial desde localStorage al iniciar
    let unlockedItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

    // Muestra el historial en la página
    function displayUnlockedSurprises() {
        unlockedSurprisesList.innerHTML = ''; // Limpiar la lista actual
        if (unlockedItems.length === 0) {
            unlockedSurprisesList.innerHTML = '<li>Aún no has desbloqueado ninguna sorpresa.</li>';
            return;
        }
        unlockedItems.forEach(item => {
            const listItem = document.createElement('li');
            // Ahora mostramos el código, y opcionalmente su nombre de sorpresa si quieres verlo también.
            // Por ejemplo: `listItem.textContent = `${item} (Desbloqueado: ${secretCodes[item] ? secretCodes[item].name : 'Desconocido'})`;`
            // Pero como pediste solo el código, lo dejamos simple:
            listItem.textContent = item; 
            unlockedSurprisesList.appendChild(listItem);
        });
    }

    // Añade el código al historial y lo guarda
    function addCodeToHistory(codeUsed) { // Cambiamos el nombre de la función y el parámetro
        if (!unlockedItems.includes(codeUsed)) {
            unlockedItems.push(codeUsed);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(unlockedItems));
            displayUnlockedSurprises();
        }
    }

    // --- Funcionalidad de Validación y Descarga ---
    unlockButton.addEventListener('click', handleUnlock);
    secretCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUnlock();
        }
    });

    function handleUnlock() {
        const code = secretCodeInput.value.trim().toLowerCase(); // Limpiar espacios y convertir a minúsculas
        messageDisplay.classList.remove('show', 'error'); // Resetear mensajes
        confirmationMessage.classList.remove('show'); // Resetear confirmación
        messageDisplay.textContent = ''; // Limpiar texto de mensaje

        if (!code) {
            showMessage('Por favor, introduce un código.', 'error');
            return;
        }

        if (secretCodes[code]) {
            const surprise = secretCodes[code];
            const fileLink = surprise.file; 

            if (fileLink) {
                // Iniciar descarga
                const link = document.createElement('a');
                link.href = fileLink;
                link.download = surprise.name.replace(/\s/g, '_') + '.txt'; 
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Mostrar confirmación visual
                confirmationMessage.classList.add('show');
                setTimeout(() => {
                    confirmationMessage.classList.remove('show');
                }, 3000); 

                showMessage(`¡Felicidades! Has desbloqueado: "${surprise.name}"`, 'success');
                // AQUÍ ES DONDE CAMBIA: ahora pasamos el código exacto
                addCodeToHistory(code); 
                secretCodeInput.value = ''; 
            } else {
                showMessage('Error al procesar el archivo. Intenta con otro código.', 'error');
            }
        } else {
            showMessage('Código incorrecto o inválido. ¡Sigue intentándolo!', 'error');
        }
    }

    // Función para mostrar mensajes al usuario
    function showMessage(msg, type) {
        messageDisplay.textContent = msg;
        messageDisplay.classList.add('show');
        if (type === 'error') {
            messageDisplay.classList.add('error');
        } else {
            messageDisplay.classList.remove('error');
        }
        setTimeout(() => {
            messageDisplay.classList.remove('show');
        }, 3000);
    }

    // --- Funcionalidad de Temas de Colores ---
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    } else {
        body.setAttribute('data-theme', 'default'); 
    }

    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            body.setAttribute('data-theme', theme);
            localStorage.setItem('selectedTheme', theme); 
        });
    });

    // Inicializar la visualización del historial al cargar la página
    displayUnlockedSurprises();
});
