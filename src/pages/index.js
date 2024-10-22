import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [layer, setLayer] = useState('')
  const [level, setLevel] = useState('')
  const [sudokuBoard, setSudokuBoard] = useState(null)
  const [solvedBoard, setSolvedBoard] = useState(null)

  const handleLayerChange = (e) => {
    const value = e.target.value
    if (value === '' || /^[0-9]+$/.test(value)) {
      setLayer(value)
    }
  }

  const handleLevelChange = (e) => {
    const value = e.target.value
    if (value === '' || /^[0-9]+$/.test(value)) {
      setLevel(value)
    }
  }

  const generateSudoku = async () => {
    if (layer === '' || level === '') {
      alert('请输入 layer 和 level')
      return
    }
    
    const response = await fetch('/api/sudoku', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ layer, level: parseInt(level) }),
    })
    const data = await response.json()
    if (data.error) {
      alert(data.error)
    } else {
      setSudokuBoard(data.board)
      setSolvedBoard(data.solvedBoard)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>数独生成器</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>数独生成器</h1>

        <div className={styles.inputContainer}>
          <input
            type="number"
            value={layer}
            onChange={handleLayerChange}
            placeholder="输入 layer"
            className={styles.input}
          />
          <input
            type="number"
            value={level}
            onChange={handleLevelChange}
            placeholder="输入 level"
            className={styles.input}
          />
          <button onClick={generateSudoku} className={styles.button}>
            生成数独
          </button>
        </div>

        <div className={styles.boardsContainer}>
          {sudokuBoard && (
            <div className={styles.boardContainer}>
              <h2>数独棋盘</h2>
              <div className={styles.board}>
                {sudokuBoard.map((cell, index) => (
                  <div
                    key={index}
                    className={`${styles.cell} ${
                      !cell.can_edit ? styles.fixed : ''
                    }`}
                  >
                    {cell.can_edit ? '.' : cell.answer_num}
                  </div>
                ))}
              </div>
            </div>
          )}

          {solvedBoard && (
            <div className={styles.boardContainer}>
              <h2>解出的数独棋盘</h2>
              <div className={styles.board}>
                {solvedBoard.map((cell, index) => (
                  <div key={index} className={styles.cell}>
                    {cell.answer_num}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
