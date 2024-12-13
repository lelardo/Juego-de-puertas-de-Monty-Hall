let choice = null; // Almacena la puerta seleccionada
let auxDoor = null; // Almacena la puerta con cabra que se abrirá
let finalChoice = null; // Almacena la puerta final elegida
let doors = []; // Contendrá las puertas (cabras o coche)
const selectSound = new Audio('sounds/select.mp3');
const winSound = new Audio('sounds/win.mp3');
const loseSound = new Audio('sounds/lose.mp3');
const swipeDoor = new Audio('sounds/swipe.mp3');
const openDoor = new Audio('sounds/open.mp3');

function playSound(sound) {
    sound.play();
}
// Inicializa las puertas del juego
function initDoors() {
    doors = [
        { isGoat: true, isOpen: false }, // Puerta A
        { isGoat: true, isOpen: false }, // Puerta B
        { isGoat: true, isOpen: false }, // Puerta C
    ];

    // Aleatoriamente asigna una puerta con un coche
    let carDoor = Math.floor(Math.random() * 3);
    doors[carDoor].isGoat = false;
    document.querySelectorAll('.door').forEach(door => {
        door.style.backgroundColor = ''; // Quitar el color de fondo de todas las puertas
    }); 
}

// Método para seleccionar la puerta
function selectDoor(doorIndex) {
    if (choice !== null) return; // Evita cambiar la puerta una vez seleccionada

    choice = doorIndex;
    playSound(selectSound);
    document.getElementById(`door-${doorIndex}`).style.opacity = 0.5; // Marca la puerta seleccionada con opacidad
    document.getElementById(`door-${doorIndex}`).style.backgroundColor =
        "#f0a500";
    
    document.getElementById("message-container").innerText =
        "Has elegido la puerta " + (doorIndex + 1);

    // Abre una puerta con cabra
    openGoatDoor();

    // Muestra las opciones para cambiar o no
    document.getElementById("decision-container").style.display = "flex";
}


function openGoatDoor() {
    // Busca puertas con cabra que no sean la elegida por el jugador
    let goatDoors = doors
        .map((door, index) => (door.isGoat && index !== choice ? index : -1))
        .filter((index) => index !== -1);
    let randomGoatDoor = goatDoors[Math.floor(Math.random() * goatDoors.length)];
    playSound(openDoor);
    doors[randomGoatDoor].isOpen = true;
    updateProbability(choice, randomGoatDoor);

    // Cambia la imagen de la puerta seleccionada (abierta con cabra)
    document.getElementById(`door-${randomGoatDoor}`).style.backgroundImage =
        "url('img/goat.png')";
    document.getElementById(`door-${randomGoatDoor}`).style.opacity = 1; // Hacerla visible
    document.getElementById("message-container").innerText +=
        "\nSe ha abierto una puerta con cabra.";

    // Determina la puerta auxiliar (la que contiene el coche o la otra puerta cerrada)
    auxDoor = doors.findIndex(
        (door, index) => !door.isOpen && index !== choice
    );
}

// Método para tomar la decisión de cambiar o no de puerta
function makeDecision(decision) {
    if (decision === "s") {
        // Cambiar a la puerta auxiliar
        finalChoice = auxDoor;
        document.getElementById("message-container").innerText +=
            "\nHas decidido cambiar a la puerta " + (auxDoor + 1);
    } else {
        // Mantener la puerta seleccionada
        finalChoice = choice;
        document.getElementById("message-container").innerText +=
            "\nMantienes la puerta " + (choice + 1);
    }

    // Reinicia el color y opacidad de todas las puertas
    document.querySelectorAll('.door').forEach((door, index) => {
        door.style.backgroundColor = ''; // Quitar el color de fondo
        door.style.opacity = index === finalChoice ? 1 : 0.5; // Marcar la puerta final
    });
    playSound(swipeDoor);

    // Marca la puerta final con un color
    document.getElementById(`door-${finalChoice}`).style.backgroundColor =
        "#f0a500";

    // Verifica si ganó o no
    checkWin();
}


// Método para verificar si ganó o no
function checkWin() {
    if (doors[finalChoice].isGoat) {
        document.getElementById("final-message").innerText =
            "¡Perdiste! La puerta " + (finalChoice + 1) + " tiene una cabra.";
            playSound(loseSound);
    } else {
        document.getElementById("final-message").innerText =
            "¡Ganaste! La puerta " + (finalChoice + 1) + " tiene el coche.";
            playSound(winSound);
    }

    // Mostrar todas las puertas al final
    revealDoors();

    // Mostrar el botón para jugar otra vez
    document.getElementById("restart-btn").style.display = "block";
}

// Método para revelar todas las puertas
function revealDoors() {
    playSound(openDoor);
    doors.forEach((door, index) => {
        let doorElement = document.getElementById(`door-${index}`);
        if (door.isGoat) {
            doorElement.style.backgroundImage = "url('img/goat.png')";
        } else {
            doorElement.style.backgroundImage = "url('img/car.png')";
        }
        doorElement.style.opacity = 1; // Asegurarse de que las puertas no estén transparentes al final
    });
}

function updateProbability(selectedDoor, openedDoor) {
    // Seleccionamos todas las puertas
    const doors = document.querySelectorAll('.door');

    doors.forEach((door, index) => {
        const probabilityElement = door.querySelector('.probability');

        if (index === selectedDoor) {
            // La puerta seleccionada mantiene 0.33
            probabilityElement.textContent = "0.33";
        } else if (index === openedDoor) {
            // La puerta abierta (con cabra) se oculta o no se actualiza
            probabilityElement.textContent = "";
        } else {
            // La puerta sobrante tiene 0.66
            probabilityElement.textContent = "0.66";
        }
    });
}

function initProbability() {
    const doors = document.querySelectorAll('.door');

    doors.forEach(door => {
        const probabilityElement = door.querySelector('.probability');
        probabilityElement.textContent = "0.33";
    });
}

// Ejemplo de uso: Puerta 0 seleccionada, puerta 1 abierta
updateProbability(0, 1);


// Inicializa el juego
function startGame() {
    initDoors();
    initProbability();
    document.getElementById("message-container").innerText =
        "Elige una puerta para comenzar.";
    document.getElementById("final-message").innerText = "";
    document.getElementById("decision-container").style.display = "none";
    document.getElementById("restart-btn").style.display = "none"; // Escondemos el botón de reinicio al inicio

    // Resetea los estilos de las puertas
    Array.from(document.querySelectorAll(".door")).forEach((door) => {
        door.style.opacity = 1; // Restablecer la visibilidad de las puertas
        door.style.backgroundImage = "url('img/door.png')"; // Establecer la imagen predeterminada
    });
}

// Función para reiniciar el juego
function restartGame() {
    // Reiniciar variables y UI
    choice = null;
    auxDoor = null;
    finalChoice = null;
    startGame();
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

// Función para generar los destellos
function generateFlashes() {
    const numFlashes = 100; // Número de destellos
    const body = document.body;

    for (let i = 0; i < numFlashes; i++) {
        const flash = document.createElement('div');
        flash.classList.add('flash');
        
        // Asignar un color aleatorio
        flash.style.backgroundColor = getRandomColor();
        
        // Asignar un tamaño aleatorio
        flash.style.width = Math.random() * 5 + 2 + 'px';
        flash.style.height = flash.style.width; // Mantener forma circular

        // Colocar el destello en una posición aleatoria inicial
        flash.style.top = Math.random() * 100 + 'vh';
        flash.style.left = Math.random() * 100 + 'vw';

        // Añadir el destello al body
        body.appendChild(flash);

        // Mover el destello y cambiar su color antes de la animación
        function moveFlash() {
            flash.style.top = Math.random() * 100 + 'vh';
            flash.style.left = Math.random() * 100 + 'vw';
            flash.style.backgroundColor = getRandomColor(); // Cambiar color aleatorio
        }

        // Mover y cambiar color a intervalos aleatorios
        setInterval(() => {
            moveFlash();  // Cambiar de lugar
        }, 1500); // Mover a una nueva posición cada 1.5 segundos

        // Animación de parpadeo (mantener el mismo efecto de brillo)
        flash.style.animation = 'flash 1.5s infinite alternate';
    }
}

// Llamar a la función cuando la página cargue
window.onload = generateFlashes;


startGame();
