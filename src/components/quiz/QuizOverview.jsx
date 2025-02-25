import React from "react";
import "./QuizOverview.css";

const QuizOverview = ({ quiz, onPlay }) => {
	return (
		<div>
			<div className="quiz-info">
				<h2>{quiz.title.rendered}</h2>
				<p>Difficulté : <span className="bold">{quiz.difficulte?.[0]}</span></p>
				<p>{quiz.description}</p>

				<button onClick={onPlay}>Jouer</button>

				<hr />

				{/* Scoreboard */}
				{quiz.scoreboard && quiz.scoreboard.length > 0 ? (
					<div className="scoreboard-main-div">
						<div className="scoreboard-titles-div">
							<span>Pseudo</span>
							<span>Score</span>
							<span>Temps (s)</span>
						</div>
						{quiz.scoreboard.map((s) => (
							<div className="scores-div" key={s.ID}>
								<span>{s.utilisateur}</span>
								<span>{s.score}%</span>
								<span>{(s.temps / 1000).toFixed(2)}</span>
							</div>
						))}
					</div>
				) : (
					<p>Aucun score pour l’instant.</p>
				)}
			</div>

			<div className="overview-image-div">
				{quiz.vignette?.guid && (
					<img
						src={quiz.vignette.guid}
						alt={quiz.vignette.post_title || "Quiz Image"}
					/>
				)}
			</div>
		</div>
	);
};

export default QuizOverview;
