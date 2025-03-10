const grid = document.querySelector(".board")
const newGame = document.querySelector(".newGame")
const texto = document.querySelector(".texto")
let juego = {}

newGame.addEventListener("click", ()=>{
    juego=GameController()
    const gridItems = Array.from(grid.children)
    gridItems.forEach((cell)=>{
        cell.innerText='';
        cell.addEventListener("click",jugar)
    })
    texto.innerText="Player One turn"
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

      const winPatterns = [
        // Rows
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // Columns
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]]
      ]

    const isWinningCondition = (a,b,c) =>
    {

        return (a==b && a==c && a!=0)
    }
    const checkBoard = () =>
    {     
        for (const pattern of winPatterns){
            const [a,b,c] = pattern;
            console.log(a,b,c)
            if (isWinningCondition(
                board.getCellValue(a[0],a[1]),
                board.getCellValue(b[0],b[1]),
                board.getCellValue(c[0],c[1])

            )){
                console.log(board.getCellValue(a[0],a[1]),
                board.getCellValue(b[0],b[1]),
                board.getCellValue(c[0],c[1]))
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



