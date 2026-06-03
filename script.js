const historyDiv = document.getElementById("history");
let currentExpression = "";
const screen = document.getElementById("calc-screen");

function appendValue(value) {
    const lastChar = currentExpression.slice(-1);

    // Prevent double operators
    if (['+', '*', '/', '-'].includes(lastChar) &&
        ['+', '*', '/', '-'].includes(value)) {
        return;
    }

    // Prevent starting with operator
    if (currentExpression === "" && ['+', '*', '/'].includes(value)) {
        return;
    }

    // Prevent multiple decimals in same number
    if (value === ".") {
        const parts = currentExpression.split(/[\+\-\*\/]/);
        const lastNumber = parts[parts.length - 1];
        if (lastNumber.includes(".")) return;
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

    // Secret trigger (keep your feature)
    if (currentExpression === "8*25") {
        launchPage();
        return;
    }

    try {
        const expression = currentExpression; // save BEFORE evaluating
        const result = new Function(`return ${currentExpression}`)();

        if (!isFinite(result)) {
            screen.value = "Error";
            currentExpression = "";
        } else {
            const formatted = Number(result.toFixed(8)).toString();

            // ✅ Add to history
            const entry = document.createElement("div");
            entry.textContent = `${expression} = ${formatted}`;
            historyDiv.appendChild(entry);

            // Update display
            screen.value = formatted;
            currentExpression = formatted;
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

// Keyboard support
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
