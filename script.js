document.addEventListener('DOMContentLoaded', () => {
    const secretCodeInput = document.getElementById('secretCode');
    const submitCodeButton = document.getElementById('submitCode');
    const messageDisplay = document.getElementById('message');
    const downloadArea = document.getElementById('downloadArea');
    const downloadButton = document.getElementById('downloadButton');

    // **IMPORTANTE: Define tus códigos válidos y sus URLs aquí**
    // Reemplaza estas URLs con las rutas reales de tus archivos en '../assets/diario'
    // o URLs de GitHub Pages como en tu ejemplo.
    const validCodes = {
        "VUQGSRNBBKUWSWTRWHJCQDNWDVYYPA": "assets/contrasenas.PDF",
        "regalo123": "../assets/diario/regalo.zip",
        "foto2024": "../assets/diario/vacaciones.jpg",
        "documentoXYZ": "https://github.com/usuario/repositorio/raw/main/documentos/informe.docx"
    };

    let currentFileUrl = ''; // Almacena la URL del archivo para la descarga

    // Función para mostrar mensajes
    function showMessage(msg, type) {
        messageDisplay.textContent = msg;
        messageDisplay.className = `message show ${type}`;
    }

    // Función para ocultar mensajes
    function hideMessage() {
        messageDisplay.classList.remove('show', 'error', 'success');
        messageDisplay.textContent = '';
    }

    // Función para validar el código y manejar la UI
    function validateCode() {
        const enteredCode = secretCodeInput.value.trim();
        hideMessage(); // Ocultar cualquier mensaje anterior
        downloadArea.classList.remove('show'); // Ocultar área de descarga

        if (validCodes.hasOwnProperty(enteredCode)) {
            currentFileUrl = validCodes[enteredCode];
            showMessage('¡Código correcto!', 'success');
            // Pequeña animación de éxito en el input o botón
            submitCodeButton.style.backgroundColor = 'var(--secondary-color)';
            setTimeout(() => {
                submitCodeButton.style.backgroundColor = 'var(--primary-color)';
                downloadArea.classList.add('show'); // Mostrar área de descarga
                downloadButton.textContent = 'Descargar Archivo'; // Resetear texto por si se intentó varias veces
                downloadButton.classList.remove('downloading');
            }, 500); // Pequeño retraso para la animación
        } else {
            showMessage('Código incorrecto. Intenta de nuevo.', 'error');
            secretCodeInput.classList.add('error-shake'); // Animación de error
            setTimeout(() => {
                secretCodeInput.classList.remove('error-shake');
            }, 500);
            secretCodeInput.value = ''; // Limpiar el campo
        }
    }

    // Event Listeners
    submitCodeButton.addEventListener('click', validateCode);

    secretCodeInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            validateCode();
        }
    });

    downloadButton.addEventListener('click', () => {
        if (currentFileUrl) {
            downloadButton.textContent = 'Preparando descarga...';
            downloadButton.classList.add('downloading');
            // Simular una pequeña espera antes de la descarga real
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = currentFileUrl;
                // Intentar inferir el nombre del archivo de la URL para el atributo download
                const fileNameMatch = currentFileUrl.match(/\/([^\/?#]+)[\/?#]?.*$/);
                if (fileNameMatch && fileNameMatch[1]) {
                    link.download = fileNameMatch[1];
                } else {
                    link.download = 'archivo_secreto'; // Nombre por defecto si no se puede inferir
                }
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                downloadButton.textContent = '¡Descarga iniciada!';
                setTimeout(() => {
                    downloadButton.classList.remove('downloading');
                    downloadButton.textContent = 'Descargar Archivo'; // Resetear para futuros usos
                    downloadArea.classList.remove('show'); // Ocultar área de descarga después de descargar
                    secretCodeInput.value = ''; // Limpiar el campo de entrada
                    secretCodeInput.focus(); // Poner el foco de nuevo en el input
                }, 1500); // Dar tiempo para ver el mensaje de descarga iniciada
            }, 700);
        }
    });

    // Añadir clase para la animación de "shake" en el input de código incorrecto
    const styleSheet = document.styleSheets[0];
    const keyframes = `@keyframes errorShake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
        100% { transform: translateX(0); }
    }`;
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

    styleSheet.insertRule(`
        #secretCode.error-shake {
            animation: errorShake 0.3s ease-in-out;
            border-color: var(--error-color) !important;
        }
    `, styleSheet.cssRules.length);
});
