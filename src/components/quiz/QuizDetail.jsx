import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getQuizById, postScoreboard, fetchCurrentUser } from "../../services";

import QuizOverview from "./QuizOverview";
import QuizGame from "./QuizGame";

import "./QuizDetail.css";

const QuizDetail = () => {
	const { id } = useParams();
	const [quiz, setQuiz] = useState(null);
	const [error, setError] = useState(null);

	const [mode, setMode] = useState("overview");
	const [finalScore, setFinalScore] = useState(null);

	// Timer
	const [startTime, setStartTime] = useState(null);
	const [elapsedTime, setElapsedTime] = useState(null);

	// ID de l'utilisateur courant (ou null s'il n'est pas connecté)
	const [userId, setUserId] = useState(null);

	// Ref pour scroller
	const quizGameRef = useRef(null);

	useEffect(() => {
		if (!id) return;
		(async () => {
			try {
				const quizId = parseInt(id, 10);
				const data = await getQuizById(quizId);
				setQuiz(data);
			} catch (err) {
				setError(err.message);
			}
		})();
	}, [id]);

	// On récupère l'utilisateur côté service
	useEffect(() => {
		(async () => {
			const user = await fetchCurrentUser();
			setUserId(user ? user.id : null);
		})();
	}, []);

	// Scroll vers quizGameRef quand on passe en mode play
	useEffect(() => {
		if (mode === "play" && quizGameRef.current) {
			quizGameRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [mode]);

	if (error) {
		return <p>Erreur : {error}</p>;
	}
	if (!quiz) {
		return <p>Chargement...</p>;
	}

	const handlePlay = () => {
		setMode("play");
		setFinalScore(null);
		setElapsedTime(null);
		setStartTime(Date.now());
	};

	const handleGameOver = async (score) => {
		setFinalScore(score);
		setMode("end");

		// On calcule le temps
		if (startTime) {
			const endTime = Date.now();
			const totalMs = endTime - startTime;
			setElapsedTime(totalMs);

			// Poster le scoreboard si connecté
			if (userId) {
				const nbQuestions = quiz.questions?.length ?? 0;
				const scorePercent =
					nbQuestions > 0 ? Math.round((score / nbQuestions) * 100) : 0;

				try {
					const createdScoreboard = await postScoreboard(
						quiz.id,
						userId,
						scorePercent,
						totalMs
					);
					console.log("Scoreboard créé :", createdScoreboard);
				} catch (err) {
					console.error("Erreur creation scoreboard:", err);
				}
			}
		}
	};

	const totalQuestions = quiz.questions?.length || 0;
	const percentage =
		finalScore !== null && totalQuestions > 0
			? Math.round((finalScore / totalQuestions) * 100)
			: 0;

	const elapsedSeconds = elapsedTime ? (elapsedTime / 1000).toFixed(2) : null;

	return (
		<div className="quiz-detail-main">
			<div className="quiz-detail-content">
				{mode === "overview" && (
					<QuizOverview quiz={quiz} onPlay={handlePlay} />
				)}

				{mode === "play" && quiz.questions && quiz.questions.length > 0 && (
					<div ref={quizGameRef}>
						<QuizGame questions={quiz.questions} onGameOver={handleGameOver} />
					</div>
				)}

				{mode === "end" && (
					<div className="end-content">
						<h2>Partie terminée</h2>
						<p>
							Vous avez <span className="bold">{finalScore}</span> bonne(s) réponse(s) sur {totalQuestions}.
						</p>
						<p>Score final : <span className="bold">{percentage}%</span></p>
						{elapsedSeconds && <p>Temps total : <span className="bold">{elapsedSeconds}</span> secondes</p>}

						<button onClick={() => setMode("overview")}>
							Revenir à l’aperçu
						</button>
					</div>
				)}
			</div>

			<div>
				<Link to="/">Retour à la liste</Link>
			</div>
		</div>
	);
};

export default QuizDetail;
