document.addEventListener('DOMContentLoaded', function() {
    let display = document.getElementById('display');
    let historyList = document.getElementById('history-list');
    let themeToggle = document.getElementById('theme-toggle');
    
    function appendToDisplay(value) {
        display.value += value;
    }
    
    function clearDisplay() {
        display.value = '';
    }
    
    function calculate() {
        try {
            const expression = display.value;
            const result = evaluateExpression(expression);
            display.value = result;
            addToHistory(expression, result);
        } catch (error) {
            display.value = 'Virhe';
        }
    }
    
    function evaluateExpression(expression) {
        // Poista kaikki välilyönnit
        expression = expression.replace(/\s+/g, '');
        
        // Jaa numerot ja operaattorit
        const tokens = expression.match(/(\d+(\.\d+)?|\+|\-|\*|\/)/g);
        
        if (!tokens) {
            throw new Error('Virheellinen lauseke');
        }
        
        let result = parseFloat(tokens[0]);
        
        for (let i = 1; i < tokens.length; i += 2) {
            const operator = tokens[i];
            const operand = parseFloat(tokens[i + 1]);
            
            if (isNaN(operand)) {
                throw new Error('Virheellinen numero');
            }
            
            switch (operator) {
                case '+':
                    result += operand;
                    break;
                case '-':
                    result -= operand;
                    break;
                case '*':
                    result *= operand;
                    break;
                case '/':
                    if (operand === 0) {
                        throw new Error('Nollalla jako');
                    }
                    result /= operand;
                    break;
                default:
                    throw new Error('Tuntematon operaattori');
            }
        }
        
        return result;
    }
    
    function addToHistory(expression, result) {
        const listItem = document.createElement('li');
        listItem.textContent = `${expression} = ${result}`;
        historyList.prepend(listItem);
        
        // Rajoita historian pituutta
        if (historyList.children.length > 5) {
            historyList.removeChild(historyList.lastChild);
        }
    }
    
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
    }
    
    // Lisää kuuntelijat numeroille
    document.querySelectorAll('.number').forEach(button => {
        button.addEventListener('click', function() {
            appendToDisplay(this.dataset.number);
        });
    });
    
    // Lisää kuuntelijat operaattoreille
    document.querySelectorAll('.operator').forEach(button => {
        button.addEventListener('click', function() {
            appendToDisplay(this.dataset.operator);
        });
    });
    
    // Lisää kuuntelija yhtäsuuruus-painikkeelle
    document.getElementById('equals').addEventListener('click', calculate);
    
    // Lisää kuuntelija tyhjennys-painikkeelle
    document.getElementById('clear').addEventListener('click', clearDisplay);
    
    // Lisää kuuntelija teeman vaihtopainikkeelle
    themeToggle.addEventListener('click', toggleTheme);
});