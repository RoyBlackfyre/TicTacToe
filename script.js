

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
        console.log(boardState)
    }

    function setValue(x,y,value){
        board[x][y].addValue("Mierdeta")
    }
    return {
        getBoard,
        printBoard,
        setValue
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

function GameController (){

}