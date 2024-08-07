// src/components/Word.js
import React from "react";
import "./Word.css";

const Word = ({ word, orientation, onSelectWord, isSelected }) => {
	return (
		<div
			className={`word ${orientation} ${isSelected ? "selected" : ""}`}
			onClick={() => onSelectWord(word)}>
			{word.split("").map((letter, index) => (
				<div
					key={index}
					className="letter">
					{letter}
				</div>
			))}
		</div>
	);
};

export default Word;
