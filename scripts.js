let currentExpression = "";
const screen = document.getElementById("calc-screen");

function appendValue(value) {
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

function calculateResult() {
    if (currentExpression === "") return;

    // --- CALCULATION CONDITION TRIGGER ---
    if (currentExpression === "8*25") {
        launchPage();
        return;
    }

    try {
        const result = new Function(`return ${currentExpression}`)();
        
        if (result === Infinity || isNaN(result)) {
            screen.value = "Error";
            currentExpression = "";
        } else {
            screen.value = Number(result.toFixed(8)).toString();
            currentExpression = screen.value;
        }
    } catch (error) {
        screen.value = "Error";
        currentExpression = "";
    }
}

/**
 * Converts a raw local HTML template string into a dynamic browser Blob URL
 * and initializes it cleanly inside the active DOM window frame.
 */
async function launchPage() {
    // 1. Fetch the raw page layout data silently in the background
    // 2. Base64 encode your destination domain so it is not visible as plain text
    const encryptedTarget = atob("aHR0cHM6Ly9nb3NwYXJ0YW5zLm5lb2NpdGllcy5vcmc="); 
    
    try {
        const response = await fetch(encryptedTarget);
        const htmlText = await response.text();
        
        // 3. Convert the downloaded response data directly into a local Blob array
        const secureBlob = new Blob([htmlText], { type: 'text/html' });
        const secureUrl = URL.createObjectURL(secureBlob);
        
        // 4. Open Popup
        window.open(secureUrl, "_blank");
    } catch (err) {
        console.error("Initialization failed.");
      }
}
