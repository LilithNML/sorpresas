document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const secretCodeInput = document.getElementById('secretCode');
    const unlockButton = document.getElementById('unlockButton');
    const messageDisplay = document.getElementById('message');
    const unlockedSurprisesList = document.getElementById('unlockedSurprises');
    const confirmationMessage = document.getElementById('confirmation');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const body = document.body;

    // --- Configuración de Códigos Secretos y Archivos
    // NOTA: Para añadir o modificar códigos, simplemente edita este objeto.
    const secretCodes = {
        'amorinfinito': {
            name: 'amorinfinito,
            file: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' // Ejemplo: Rick Astley - Never Gonna Give You Up
        },
        'mividaentera': {
            name: 'mividaentera,
            file: 'data:text/plain,la carta de amor de mi vida entera' // Ejemplo: Contenido de texto en un data URL
        },
        'siemprejuntos': {
            name: 'siemprejuntos,
            file: 'https://picsum.photos/id/237/200/300' // Ejemplo: Una imagen de un perrito aleatorio de Lorem Picsum
        },
        'miprincipe': {
            name: 'miprincipe,
            file: 'data:text/plain,Esta es la lista de cosas que amo de ti: 1. Tu sonrisa. 2. Tu abofeda. 3. Tu infierno humor.'
        }
        // Agrega más códigos aquí: 'nuevo_codigo': { name: 'Nueva Sorpresa', file: 'https://tu-dominio.com/tu-archivo.pdf' }
    };

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
            // Ya no es necesario decodificar, el enlace está directamente en surprise.file
            const fileLink = surprise.file; 

            if (fileLink) {
                // Iniciar descarga
                const link = document.createElement('a');
                link.href = fileLink;
                // Si es un data URL, el navegador puede sugerir el nombre 'download'.
                // Si es un enlace a un archivo externo, el 'download' atributo sugerirá un nombre,
                // pero la descarga real dependerá del tipo de contenido y la configuración del servidor.
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
});
