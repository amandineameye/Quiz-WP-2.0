const { VITE_URL_WP } = import.meta.env;

// Returns all published quizzes
export const getAllQuizzes = async () => {
	const response = await fetch(VITE_URL_WP + "/quiz?status=publish");
	if (!response.ok) {
		throw new Error(
			"Erreur lors du getAllQuizzes avec statut: ",
			response.status
		);
	}
	const data = await response.json();
	return data;
};

// Returns one quiz from id (with name of user in scorboard instead of id of scoreboard)
export const getQuizById = async (id) => {
	const response = await fetch(VITE_URL_WP + "/quiz/" + id);
	if (!response.ok) {
		throw new Error("Erreur lors dugetQuizById avec statut: ", response.status);
	}

	const quiz = await response.json();

	if (quiz.scoreboard && Array.isArray(quiz.scoreboard)) {
		const scoreboardPromises = quiz.scoreboard.map(async (score) => {
			if (score.id) {
				const response = await fetch(VITE_URL_WP + "/scoreboards/" + score.id);
				if (!response.ok) {
					throw new Error(
						"Erreur lors du fetch du scoreboard avec statut: ",
						response.status
					);
				}
				const data = await response.json();

				return {
					...score,
					utilisateur: data.utilisateur,
				};
			}
		});
		quiz.scoreboard = await Promise.all(scoreboardPromises);
	}
	return quiz;
};
