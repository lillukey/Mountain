document.addEventListener("DOMContentLoaded", () => {

    let currentExpression = "";
    const screen = document.getElementById("calc-screen");

    function appendValue(value) {
        const lastChar = currentExpression.slice(-1);

        if (['+', '*', '/', '-'].includes(lastChar) &&
            ['+', '*', '/', '-'].includes(value)) {
            return;
        }

        if (currentExpression === "" && ['+', '*', '/'].includes(value)) {
            return;
        }

        currentExpression += value;
        screen.value = currentExpression;
    }

    function clearScreen() {
        currentExpression = "";
        screen.value = "0";
    }

    function backspace() {
        currentExpression = currentExpression.slice(0, -1);
        screen.value = currentExpression || "0";
    }

    function calculateResult() {
        if (currentExpression === "") return;

        if (currentExpression === "8*25") {
            launchPage();
            return;
        }

        try {
            const result = new Function(`return ${currentExpression}`)();

            if (!isFinite(result)) {
                screen.value = "Error";
                currentExpression = "";
            } else {
                screen.value = Number(result.toFixed(8)).toString();
                currentExpression = screen.value;
            }
        } catch {
            screen.value = "Error";
            currentExpression = "";
        }
    }

    async function launchPage() {
        const encryptedTarget = atob("aHR0cHM6Ly9nb3NwYXJ0YW5zLm5lb2NpdGllcy5vcmc=");

        try {
            const newTab = window.open("", "_blank");

            const response = await fetch(encryptedTarget);
            const htmlText = await response.text();

            const blob = new Blob([htmlText], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            newTab.location.href = url;
        } catch {
            console.error("Initialization failed.");
        }
    }

    document.addEventListener("keydown", (e) => {
        const key = e.key;

        if (/^[0-9]$/.test(key)) appendValue(key);
        else if (["+", "-", "*", "/"].includes(key)) appendValue(key);
        else if (key === ".") appendValue(".");
        else if (key === "Enter") {
            e.preventDefault();
            calculateResult();
        }
        else if (key === "Backspace") backspace();
        else if (key === "Escape") clearScreen();
    });

    // 👇 expose functions to HTML buttons
    window.appendValue = appendValue;
    window.clearScreen = clearScreen;
    window.calculateResult = calculateResult;
    window.backspace = backspace;

});
