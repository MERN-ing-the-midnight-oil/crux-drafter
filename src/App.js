import React, { useState } from "react";
import Grid from "./components/Grid";
import Word from "./components/Word";
import HoldingArea from "./components/HoldingArea";
import "./App.css";

const App = () => {
	const gridSize = 10;
	const [grid, setGrid] = useState(
		Array(gridSize)
			.fill(null)
			.map(() => Array(gridSize).fill(null))
	);
	const [words, setWords] = useState([]);
	const [selectedWord, setSelectedWord] = useState(null);

	const handleSelectWord = (word) => {
		console.log(`Selected word: ${word.word}`);
		setSelectedWord(word);
	};

	const handleGridCellClick = (rowIndex, cellIndex) => {
		if (selectedWord) {
			console.log(
				`Placing word: ${selectedWord.word} at (${rowIndex}, ${cellIndex})`
			);

			const wordIndex = words.findIndex((w) => w.word === selectedWord.word);
			if (wordIndex === -1) {
				console.error("Selected word not found in words list.");
				return;
			}

			const newWords = [...words];
			newWords[wordIndex].position = { row: rowIndex, col: cellIndex };

			const newGrid = Array(gridSize)
				.fill(null)
				.map(() => Array(gridSize).fill(null));
			newWords.forEach(({ word, orientation, position }) => {
				if (position) {
					for (let i = 0; i < word.length; i++) {
						if (orientation === "horizontal") {
							newGrid[position.row][position.col + i] = word[i];
						} else {
							newGrid[position.row + i][position.col] = word[i];
						}
					}
				}
			});

			setGrid(newGrid);
			setWords(newWords);
			setSelectedWord(null);
		} else if (grid[rowIndex][cellIndex]) {
			const wordChar = grid[rowIndex][cellIndex];
			const selectedGridWord = words.find(
				(word) =>
					word.word.includes(wordChar) &&
					word.position &&
					((word.orientation === "horizontal" &&
						word.position.row === rowIndex &&
						word.position.col <= cellIndex &&
						word.position.col + word.word.length > cellIndex) ||
						(word.orientation === "vertical" &&
							word.position.col === cellIndex &&
							word.position.row <= rowIndex &&
							word.position.row + word.word.length > rowIndex))
			);

			if (selectedGridWord) {
				console.log(`Selected word from grid: ${selectedGridWord.word}`);
				setSelectedWord(selectedGridWord);
			}
		} else {
			console.error("No word selected.");
		}
	};

	const handleGridCellDoubleClick = (rowIndex, cellIndex) => {
		if (grid[rowIndex][cellIndex]) {
			const wordChar = grid[rowIndex][cellIndex];
			const selectedGridWord = words.find(
				(word) =>
					word.word.includes(wordChar) &&
					word.position &&
					((word.orientation === "horizontal" &&
						word.position.row === rowIndex &&
						word.position.col <= cellIndex &&
						word.position.col + word.word.length > cellIndex) ||
						(word.orientation === "vertical" &&
							word.position.col === cellIndex &&
							word.position.row <= rowIndex &&
							word.position.row + word.word.length > rowIndex))
			);

			if (selectedGridWord) {
				console.log(`Toggling orientation for word: ${selectedGridWord.word}`);

				const newWords = words.map((w) => {
					if (w.word === selectedGridWord.word) {
						const newOrientation =
							w.orientation === "horizontal" ? "vertical" : "horizontal";
						return { ...w, orientation: newOrientation };
					}
					return w;
				});

				const newGrid = Array(gridSize)
					.fill(null)
					.map(() => Array(gridSize).fill(null));
				newWords.forEach(({ word, orientation, position }) => {
					if (position) {
						for (let i = 0; i < word.length; i++) {
							if (orientation === "horizontal") {
								newGrid[position.row][position.col + i] = word[i];
							} else {
								newGrid[position.row + i][position.col] = word[i];
							}
						}
					}
				});

				setGrid(newGrid);
				setWords(newWords);
			}
		}
	};

	const handleAddWord = (newWord) => {
		setWords([
			...words,
			{ word: newWord, orientation: "horizontal", position: null },
		]);
	};

	const handleDeleteWord = () => {
		if (selectedWord) {
			const newWords = words.filter((w) => w.word !== selectedWord.word);
			const newGrid = Array(gridSize)
				.fill(null)
				.map(() => Array(gridSize).fill(null));
			newWords.forEach(({ word, orientation, position }) => {
				if (position) {
					for (let i = 0; i < word.length; i++) {
						if (orientation === "horizontal") {
							newGrid[position.row][position.col + i] = word[i];
						} else {
							newGrid[position.row + i][position.col] = word[i];
						}
					}
				}
			});

			setGrid(newGrid);
			setWords(newWords);
			setSelectedWord(null);
		}
	};

	return (
		<div className="app">
			<Grid
				grid={grid}
				onCellClick={handleGridCellClick}
				onCellDoubleClick={handleGridCellDoubleClick}
				selectedWord={selectedWord}
			/>
			<div className="holding-area-container">
				<HoldingArea onAddWord={handleAddWord} />
				<div className="words-container">
					{words.map((wordObj) => (
						<Word
							key={wordObj.word}
							word={wordObj.word}
							orientation={wordObj.orientation}
							onSelectWord={() => handleSelectWord(wordObj)}
							isSelected={selectedWord && selectedWord.word === wordObj.word}
						/>
					))}
				</div>
				<button
					onClick={handleDeleteWord}
					disabled={!selectedWord}>
					Delete Selected Word
				</button>
			</div>
		</div>
	);
};

export default App;
