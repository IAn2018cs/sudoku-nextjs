// utils/sudoku.js

class GameRulesDescribe {
  constructor(cell_row, cell_col, block_row, block_col, msg) {
    this.cell_row = cell_row;
    this.cell_col = cell_col;
    this.block_row = block_row;
    this.block_col = block_col;
    this.msg = msg;
  }

  get_all_col() {
    return this.cell_col * this.block_col;
  }

  get_all_row() {
    return this.cell_row * this.block_row;
  }
}

class CellData {
  constructor(all_row) {
    this.all_row = all_row;
    this.can_edit = false;
    this.answer_num = 0;
    this.row = 0;
    this.col = 0;
  }

  set_can_edit(can_edit) {
    this.can_edit = can_edit;
  }

  set_answer_num(answer_num) {
    this.answer_num = answer_num;
  }

  set_row(row) {
    this.row = row;
  }

  set_col(col) {
    this.col = col;
  }
}

export function generateSudokuBoard(question) {
  const length = question.length;
  const roles = new GameRulesDescribe(3, 3, 3, 3, "rules is battle 9x9");
  const array_list = [];

  for (let i = 0; i < length; i++) {
    const char_at = question[i];
    const cell_data = new CellData(roles.get_all_row());

    let i10;
    if (char_at === char_at.toUpperCase()) {
      i10 = char_at.charCodeAt(0) - 'A'.charCodeAt(0);
      cell_data.set_can_edit(false);
    } else {
      i10 = char_at.charCodeAt(0) - 'a'.charCodeAt(0);
      cell_data.set_can_edit(true);
    }

    cell_data.set_answer_num(i10 + 1);
    cell_data.set_row(Math.floor(i / roles.get_all_row()));
    cell_data.set_col(i % roles.get_all_col());
    array_list.push(cell_data);
  }

  return array_list;
}

export function solveSudoku(board) {
  const size = 9;
  const emptyCell = findEmptyCell(board);
  
  if (!emptyCell) {
    return board;
  }
  
  const [row, col] = emptyCell;
  
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row * size + col].answer_num = num;
      
      if (solveSudoku(board)) {
        return board;
      }
      
      board[row * size + col].answer_num = 0;
    }
  }
  
  return false;
}

function findEmptyCell(board) {
  const size = 9;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i * size + j].answer_num === 0) {
        return [i, j];
      }
    }
  }
  return null;
}

function isValid(board, row, col, num) {
  const size = 9;
  
  // Check row
  for (let i = 0; i < size; i++) {
    if (board[row * size + i].answer_num === num) {
      return false;
    }
  }
  
  // Check column
  for (let i = 0; i < size; i++) {
    if (board[i * size + col].answer_num === num) {
      return false;
    }
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[(boxRow + i) * size + (boxCol + j)].answer_num === num) {
        return false;
      }
    }
  }
  
  return true;
}