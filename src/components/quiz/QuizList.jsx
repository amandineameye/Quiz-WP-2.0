import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllQuizzes } from "../../services";

import "./QuizList.css";

const QuizList = () => {
	const [quizzes, setQuizzes] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				const data = await getAllQuizzes();
				setQuizzes(data);
			} catch (err) {
				setError(err.message);
			}
		})();
	}, []);

	if (error) {
		return <p>Erreur : {error}</p>;
	}

	return (
		<div>
			<h1>Tous les Quiz</h1>

			<div>
				{quizzes.map((quiz) => (
					<div key={quiz.id}>
						{/* Vignette à gauche */}
						<div>
							{quiz.vignette?.guid && (
								<img
									src={quiz.vignette.guid}
									alt={quiz.vignette.post_title || "Quiz Thumbnail"}
								/>
							)}
						</div>

						{/* Contenu texte + bouton */}
						<div>
							<h3>{quiz.title.rendered}</h3>
							<p>{quiz.description}</p>
							<p>Difficulté : {quiz.difficulte?.[0]}</p>

							<div>
								<Link to={`/quiz/${quiz.id}`}>Découvrir</Link>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default QuizList;
