// 1. Deposit Money
// 2. Determine number of lines to bet on(1/2/3)
//          Note: If you bet $1 on 2 lines, you bet $2.
// 3. Place the bet amount
// 4. Submit/Spin the Slot Machine
// 5. Check if user won
// 6. If won, Give the user thier winnings 
// 7. Play Again!!

// slot machine is 3x3 
const prompt = require("prompt-sync")();

const ROWS = 3; //rows of slot machine
const COLMN = 3; // columns of slot machine
let playAgain = true; // checking if user wants to play again
let totalBalance = 0; 

//count(number) chances of winning on each symbol
const Symbol_Count = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8,
};

// valye of symbol which means value multiplies the deposit amount which is winning
const Symbol_Value ={
    "A":5,
    "B":4,
    "C":3,
    "D":2,
};


const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: "); 
        const numberDepositAmount = parseFloat(depositAmount); //converts intro flot nunmber if string entered result -> NaN
        totalBalance += numberDepositAmount; // adding to total balance
        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log("Invalid amount, TryAgain!");
        }
        else {
            return totalBalance;
        }
    }
};

const getNumberofLines = () => {
    while (true) {
        const lines = prompt("Enter number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines); 

        if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3){
            console.log("Invalid! Must be 1-3, TryAgain!");
        }
        else {
            return numberOfLines;
        }
    }
}

const getBetAmount = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter bet amount per line: ");
        console.log("");
        const betAmount = parseFloat(bet); 

        if(isNaN(betAmount) || betAmount <= 0 || betAmount > balance/lines){
            console.log("Invalid! bet, Try Again");
        }
        else {
            return betAmount;
        }
    }
}

const getSpin = () => {

    const symbols = [];
    for(const[symbol,count] of Object.entries(Symbol_Count)){
        for(let i = 0; i < count; i++){
            symbols.push(symbol);        
        }
    }

    const slots = [];
    for(let i=0; i < COLMN; i++){
        slots.push([]);
        const slotSymbols = [...symbols];  // copies all symbol in symbols in slotSymbols
        for(let j= 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random()*slotSymbols.length);
            const selectedSymbol = slotSymbols[randomIndex];
            slots[i].push(selectedSymbol);
            slotSymbols.splice(randomIndex,1);  //1 means remove one element
        }
    }

    return slots;

};

const transpose = (slots) => {

    const trans = [];
    for(let i=0; i < ROWS; i++){
        trans.push([]);
        for(let j=0; j < COLMN; j++) {
            trans[i].push(slots[j][i]);
        }
    }
    return trans;

};

const displaySlots = (trans) => {
    
    let display = "";
    for(const tran of trans){
        let slotLine = "";
        for(const [i,symbol] of tran.entries()){
            slotLine += symbol;
            if(i != tran.length -1){
                slotLine += " | ";
            }
        }
        display += slotLine + "\n";
    }
    
    return display;
}

const getWinnings = (trans, betAmount, numberOfLines) => {

    let currentWinnings = 0;
    let allWinnings = [];
    let winnings= 0;
    for(let i = 0; i < trans.length ; i++){
        const symbols = trans[i];
        let allSame = true;
        for (const symbol of symbols){
           if(symbol != symbols[0] ){
                allSame = false;
           }
        }
        if(allSame ){
            currentWinnings = betAmount * Symbol_Value[symbols[0]];
            allWinnings.push(currentWinnings);
     
        }  
        else {
            allWinnings.push(0);
        }
    }
    allWinnings.sort();

    for(let j = 1; j <= numberOfLines; j++){
        winnings += allWinnings[allWinnings.length-j];
    }
    return winnings;
}

const getBalance = (depositAmount, betAmount, numberOfLines, winnings) => {
    let balance = winnings - (betAmount * numberOfLines) ;
    totalBalance += balance;
    return totalBalance;
}

const display = (betAmount, numberOfLines, winnings, balance) => {
    if (winnings > (betAmount*numberOfLines)){
        console.log("JACKPOT!! You Won $"+ winnings);
    }   
    else{
        console.log("You Won $"+ winnings);

    }
    console.log("Your Balance: $" + balance);
};

const checkPlayAgain = () => {
    const askAgain = prompt("Do you want to play again?(Yes or No): ");
    if (askAgain.toLowerCase() != "yes"){
        playAgain = false;
    }
}

while (playAgain){

    const depositAmount = deposit();
    const numberOfLines = getNumberofLines();
    const betAmount = getBetAmount(depositAmount, numberOfLines);
    const slots  = getSpin();
    const trans = transpose(slots);
    const displayMachine = displaySlots(trans);
    console.log(displayMachine);
    const winnings = getWinnings(trans, betAmount, numberOfLines);
    const balance = getBalance(depositAmount, betAmount, numberOfLines, winnings);
    const displayResult = display(betAmount, numberOfLines, winnings, balance);
    const again = checkPlayAgain();
}