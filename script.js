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
    // NOTA: Para añadir o modificar códigos, simplemente edita este objeto.
    // La clave es el código secreto, el valor es un objeto con el nombre de la sorpresa y el enlace.
    const secretCodes = {
        'amorinfinito': {
            name: 'Nuestra primera playlist',
            file: 'aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0d0c5d1hjUVU=' // Ejemplo: https://www.youtube.com/watch?v=dQw4w9WgXcQ (Rick Astley)
        },
        'mividaentera': {
            name: 'Carta de amor especial',
            file: 'ZGF0YSB1cmwvcGxhaW4vdGV4dCxsYSBjYXJ0YSBkZSBhbW9yIGRlIG1pIHZpZGEgZW50ZXJh' // Ejemplo: Contenido de texto en un data URL
        },
        'siemprejuntos': {
            name: 'Recuerdo de nuestro primer viaje',
            file: 'aHR0cHM6Ly9leGFtcGxlLmNvbS9pbWFnZXMvcmVjdWVyZG8tcHJpbWVyLXZpYWplLnBuZw==' // Ejemplo: https://example.com/images/recuerdo-primer-viaje.png
        },
        'miprincipe': {
            name: 'Una lista de cosas que amo de ti',
            file: 'ZGF0YSB1cmwvcGxhaW4vdGV4dCxFc3RhIGVzIGxhIGxpc3RhIGRlIGNvc2FzIHF1ZSBhbW8gZGUgdGk6IDEuIFR1IHNvbnJpc2EuIDIuIFR1IGFib2ZlZGEuIDMuIFR1IGluZmllcm5vIGh1bW9yLg=='
        }
        // Agrega más códigos aquí: 'nuevo_codigo': { name: 'Nueva Sorpresa', file: 'enlace' }
    };

    // Función para codificar un string (simple Base64)
    function encodeLink(str) {
        return btoa(str);
    }

    // Función para decodificar un string (simple Base64)
    function decodeLink(encodedStr) {
        try {
            return atob(encodedStr);
        } catch (e) {
            console.error("Error al decodificar el enlace:", e);
            return null;
        }
    }

    // --- Funcionalidad de Historial Local ---
    const LOCAL_STORAGE_KEY = 'unlockedSurprises';

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
            listItem.textContent = item;
            unlockedSurprisesList.appendChild(listItem);
        });
    }

    // Añade una sorpresa al historial y lo guarda
    function addSurpriseToHistory(surpriseName) {
        if (!unlockedItems.includes(surpriseName)) {
            unlockedItems.push(surpriseName);
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
            const decodedFileLink = decodeLink(surprise.file);

            if (decodedFileLink) {
                // Iniciar descarga
                const link = document.createElement('a');
                link.href = decodedFileLink;
                link.download = surprise.name.replace(/\s/g, '_') + '.txt'; // Nombre de archivo sugerido
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Mostrar confirmación visual
                confirmationMessage.classList.add('show');
                setTimeout(() => {
                    confirmationMessage.classList.remove('show');
                }, 3000); // Ocultar después de 3 segundos

                showMessage(`¡Felicidades! Has desbloqueado: "${surprise.name}"`, 'success');
                addSurpriseToHistory(surprise.name);
                secretCodeInput.value = ''; // Limpiar el campo
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
            // Opcional: Estilo para mensaje de éxito si lo deseas
        }
        // Ocultar mensaje después de un tiempo
        setTimeout(() => {
            messageDisplay.classList.remove('show');
        }, 3000);
    }

    // --- Funcionalidad de Temas de Colores ---
    // Cargar el tema guardado o establecer el predeterminado
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    } else {
        body.setAttribute('data-theme', 'default'); // Tema predeterminado
    }

    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            body.setAttribute('data-theme', theme);
            localStorage.setItem('selectedTheme', theme); // Guardar el tema seleccionado
        });
    });

    // Inicializar la visualización del historial al cargar la página
    displayUnlockedSurprises();
