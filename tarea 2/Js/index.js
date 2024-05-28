document.addEventListener("DOMContentLoaded", () => {
    const pantalla = document.querySelector(".pantalla");
    const botones = document.querySelectorAll(".btn");

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            const botonApretado = boton.textContent;

            if (boton.id === "c") {
                pantalla.textContent = "0";
                return;
            }

            if (boton.id === "borrar") {
                if (pantalla.textContent.length === 1 || pantalla.textContent === "Error!") {
                    pantalla.textContent = "0";
                } else {
                    pantalla.textContent = pantalla.textContent.slice(0, -1);
                }
                return;
            }

            if (boton.id === "igual") {
                try {
                    let resultado = calcular(pantalla.textContent);
                    pantalla.textContent = resultado;
                    addToHistory(pantalla.textContent);
                } catch {
                    pantalla.textContent = "Error!";
                }
                return;
            }

            if (pantalla.textContent === "0" || pantalla.textContent === "Error!") {
                pantalla.textContent = botonApretado;
            } else {
                pantalla.textContent += botonApretado;
            }

            // Prevención de múltiples operadores consecutivos
            if (/[\+\-\*\/]{2}/.test(pantalla.textContent)) {
                pantalla.textContent = pantalla.textContent.slice(0, -1);
            }
        });
    });

    function calcular(expresion) {
        const operadores = expresion.match(/[\+\-\*\/]/g);
        const numeros = expresion.split(/[\+\-\*\/]/g).map(Number);

        if (numeros.length - 1 !== operadores.length) {
            throw new Error("Expresión inválida");
        }

        let resultado = numeros[0];
        for (let i = 0; i < operadores.length; i++) {
            const operador = operadores[i];
            const numero = numeros[i + 1];
            switch (operador) {
                case '+':
                    resultado += numero;
                    break;
                case '-':
                    resultado -= numero;
                    break;
                case '*':
                    resultado *= numero;
                    break;
                case '/':
                    if (numero === 0) throw new Error("División por cero");
                    resultado /= numero;
                    break;
                default:
                    throw new Error("Operador desconocido");
            }
        }
        return resultado;
    }

    function addToHistory(operation) {
        const history = JSON.parse(localStorage.getItem('history')) || [];
        history.push(operation);
        localStorage.setItem('history', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        const history = JSON.parse(localStorage.getItem('history')) || [];
        const historyElement = document.getElementById('history');
        historyElement.innerHTML = '';
        history.forEach(operation => {
            const li = document.createElement('li');
            li.textContent = operation;
            historyElement.appendChild(li);
        });
    }

    function clearHistory() {
        localStorage.removeItem('history');
        renderHistory();
    }

    window.clearHistory = clearHistory;
    renderHistory();
});
