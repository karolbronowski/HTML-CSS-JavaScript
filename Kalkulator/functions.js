
document.addEventListener('DOMContentLoaded',appStart)          // Start "appStart" after loading index.html
let screen                                                      // Global declaration of the screen calculator 
let operation = ''                                              // Place for the current operation
let memory = undefined                                          // Place for first argument of operation - memory calculator
let equalButton                                                 // Button for equality

function appStart(){                                            // Starting point of the application
    screen = document.querySelector("#screen")                  // Complete the display
    equalButton = document.querySelector("#blue");              // Handle for equality sign
    equalButton.classList.toggle("div-disabled");               // Inactive until use operator https://css-tricks.com/almanac/properties/p/pointer-events/
    let buttons = document.querySelectorAll('.number')          // Button list from 0 to 9
    buttons.forEach(                                            // Each button assigns the event handler 'click'
        function(button) {
            button.addEventListener('click',numberPressed)
        }
    )
    let operatory = document.querySelectorAll('.operator')      // Operator list and click assignment
    operatory.forEach(
        function(button) {
            button.addEventListener('click',operatorPressed)
        }
    )
}


function numberPressed(e) {                                     // Function for click on buttons from 0 to 9
    let button = e.target                                       // In 'e' we have an event
                                                                // In 'e.target' - the element that was clicked
    screen.value += button.dataset.val                          // We use html attribute "data-XXX", which are later available in .js - htmlElement.dataset.XXX
    if(memory !== undefined)
    equalButton.classList.toggle("div-disabled");               // Inactive button before we enter values
}

function operatorPressed(e) {                                   
    let operator = e.target                                    // Button selected
    let screenVal = parseFloat(screen.value.replace(',','.'))  // Get value from screen, convert to float  
    switch (operator.dataset.val) {                            // Execute the action according to the button
        case 'plus':
        case 'minus':
        case 'multiply':
        case 'divide':
        {
           operation = operator.dataset.val
           memory = screenVal
           screen.value = ''
           break;
        }
        case 'AC':
        {
            screen.value = null;                               // To not to see 0 or for example 08
            memory = undefined;
            break;
        }  
        case 'sinus':
        {
            screen.value = Math.sin(screenVal);
            break;
        }
        case 'cosinus':
        {
            screen.value = Math.cos(screenVal);
            break;
        }
        case 'tanges':
        {
            screen.value = Math.tan(screenVal);
            break;
        }
        case 'cotanges':
        {
            screen.value = Math.atan(screenVal);
            break;
        }
         case 'plusminus':
         {
            screen.value = Number(-screen.value);
            break;
         }
        case 'equals':
        {
            equalButton.classList.toggle("div-disabled");
            switch (operation) {
                case 'plus':
                    memory+=screenVal
                    break;
                case 'minus':
                    memory-=screenVal
                    break;
                case 'multiply':
                    memory*=screenVal
                    break;
                case 'divide':
                    memory/=screenVal
                    break;
            } 
        }
            screen.value = memory
            operation = ''
    }
    screen.value = screen.value.replace('.',',')
}

