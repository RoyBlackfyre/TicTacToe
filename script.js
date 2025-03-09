const grid = document.querySelector(".board")
const newGame = document.querySelector(".newGame")
const texto = document.querySelector(".texto")
let juego = {}

newGame.addEventListener("click", ()=>{
    juego=GameController()
    for(let i=0; i<grid.children.length;i++){
        grid.children[i].innerText = ''
    }
    texto.innerText="Player One turn"

    for(let i=0; i<grid.children.length;i++){
        grid.children[i].addEventListener("click",jugar)
        
    }
})

//Con esta funcion se muestra el token del jugador en el board, y se elige
//la celda.
//Se declara la funcion fuera del evento, para poder remover el evento una
//vez algun jugador alla ganado.

function jugar(){
    const row = this.getAttribute("data-row")
    const column = this.getAttribute("data-column")
    this.innerText = juego.getActivePlayer().token
    juego.playRound(row,column)
    this.removeEventListener("click",jugar)
}

//Closure para crear tablero, devolverlo, mostrarlo y modificar casillas
function Gameboard() {

    const rows = 3;
    const columns = 3;
    const board = []

    //Crear board de 3x3 
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
          board[i].push(Cell());
        }
      }

    function getBoard() {
        return board
    };

    function printBoard(){
        let boardState = board.map(row=>row.map(celda => celda.getValue()))
        console.table(boardState)
    }

    //Se modifica el valor de la celda solo si no tiene token asignado
    function setCellValue(row,column,token){
        if(!board[row][column].getValue())
        {
            board[row][column].addValue(token)
            return true
        }
        return false

    }

    function getCellValue(row,column){
        return board[row][column].getValue()
    }

    return {
        getBoard,
        printBoard,
        setCellValue,
        getCellValue
    }
}

function Cell(){
    let value = 0;

    const addValue = (player) => {
        value = player;
    };

    const getValue = () => value;

    return{
        addValue,
        getValue
    }
}

function GameController (
    playerOneName="Player One",
    playerTwoName = "Player Two"
){

    //Se inicializan tableros y jugadores
    const board = Gameboard();

    let matchFinished = false;
    
    let turn = 1;

    const players = [
        {
            name: playerOneName,
            token: "x"
        },
        {
            name: playerTwoName,
            token: "o"
        }
    ]

    let activePlayer = players[0]

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        turn++
        texto.innerText=`${activePlayer.name} turn`
      };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
      };

    const checkBoard = () =>
    {     
        for(let i=0; i<3;i++){
            //Check for horizontal win condition
            if(board.getCellValue(i,0)==board.getCellValue(i,1) && board.getCellValue(i,0)==board.getCellValue(i,2) && board.getCellValue(i,0)){
                return true
            }
            //Check for vertical win condition
            if(board.getCellValue(0,i)==board.getCellValue(1,i) && board.getCellValue(2,i)==board.getCellValue(0,i) && board.getCellValue(0,i)){
                return true
            }
        }

        //Check diagonal win conditions
        if(board.getCellValue(1,1) == board.getCellValue(0,0) && board.getCellValue(1,1) == board.getCellValue(2,2) && board.getCellValue(1,1)){
            return true
        }

        return (board.getCellValue(1,1) == board.getCellValue(0,2) && board.getCellValue(1,1) == board.getCellValue(2,0) && board.getCellValue(1,1))
        
    }
    //Al seleccionar celda, se modifica, si no se modifica por que ya fue elegida
    //previamente, se revisa si jugador gano, si no, se cambia de turno.
    const playRound = (row,column) => {
        //If all cell have been selected and no one have won, the match is finished
        

        if(!matchFinished){
            if(board.setCellValue(row,column,activePlayer.token)){
                
                if (turn>4){
                    if(checkBoard()){
                        board.printBoard()
                        matchFinished=true;
                        for(let i=0; i<grid.children.length;i++){
                            grid.children[i].removeEventListener("click",jugar)
                        }
                        texto.innerText=`Congratulations ${activePlayer.name}`
                    } else {
                        switchPlayerTurn()
                        printNewRound()
                    }
                } else{
                switchPlayerTurn()
                printNewRound()
                }
            }
        }

        if(turn==10 && !checkBoard()){
            texto.innerText=`Tie!, push New Game button to start a new game`
        }

    }

    return {
        playRound,
        getActivePlayer
    }
}



