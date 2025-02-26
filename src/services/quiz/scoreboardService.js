const { VITE_URL_WP } = import.meta.env;

// Posts the formatted scoreboard and returns it
export const postScoreboard = async (quizId, userId, scorePercent, timeMs) => {
	const { wpApiSettings } = window;

	if (!wpApiSettings || !wpApiSettings.root || !wpApiSettings.nonce) {
		throw new Error("WpApiSettings ou root ou nonce introuvable");
	}

	const now = new Date();
	const dateString = now.toISOString().replace("T", " ").split(".")[0];
	const postTitle = `QUIZ-${quizId}-USER-${userId}-DATE${dateString.replace(
		/[^0-9]/g,
		""
	)}`;
	//Pour le replace: tout ce qui n'est pas un chiffre on le remplace par rien

	const payload = {
		quiz: quizId,
		utilisateur: userId,
		score: scorePercent,
		temps: timeMs,
		title: postTitle,
		status: "publish",
	};

	console.log("Payload: ", payload);

	const response = await fetch(VITE_URL_WP + "wp-json/wp/v2/scoreboards", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-WP-Nonce": wpApiSettings.nonce,
		},
		credentials: "include",
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			"Erreur lors du postScoreboard. Statut et error text: ",
			response.status,
			errorText
		);
	}

	const createdScoreboard = await response.json();
	return createdScoreboard;
};
