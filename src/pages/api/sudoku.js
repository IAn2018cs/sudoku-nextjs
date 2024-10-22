import fs from 'fs';
import path from 'path';
import { generateSudokuBoard, solveSudoku } from '../../utils/sudoku';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { layer, level } = req.body;

    // 读取配置文件
    const configPath = path.join(process.cwd(), 'config', 'sudoku_config.json');
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // 获取 question
    const layerData = configData[layer];
    if (!layerData || !layerData[level]) {
      return res.status(400).json({ error: 'Invalid layer or level' });
    }

    const questionData = layerData[level].split('_')[0];

    // 生成和解决数独
    const board = generateSudokuBoard(questionData);
    const solvedBoard = JSON.parse(JSON.stringify(board)); // 创建深拷贝
    solveSudoku(solvedBoard);

    res.status(200).json({ board, solvedBoard });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}