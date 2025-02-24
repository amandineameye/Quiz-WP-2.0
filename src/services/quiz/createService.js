const { VITE_URL_WP } = import.meta.env;

// Posts one question, returns the question if it worked and null if it did not
const postQuestion = async (question) => {
	const wpApiSettings = window;
	const nonce = wpApiSettings?.nonce;

	if (!nonce) {
		console.error("Nonce not found");
		return null;
	}

	const response = await fetch(VITE_URL_WP + "wp-json/wp/v2/questions", {
		mehtod: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-WP-Nonce": nonce,
		},
		body: JSON.stringify({
			question: question.question,
			contenu: question.contenu || "",
			reponse_fr: question.reponse_fr || "",
			reponse_en: question.reponse_en || "",
			reponse_alternative: question.reponse_alternative || "",
		}),
		credentials: "include",
	});

	const data = await response.json();

	if (!response.ok) {
		console.error("Error posting question: ", data);
		return null;
	}

	return data;
};

// Posts the image to media and returns the id of the media or null
export const uploadImage = async (imageFile) => {
	const wpApiSettings = window;
	const nonce = wpApiSettings?.nonce;

	if (!imageFile) {
		console.error("No file selected");
		return null;
	}

	const formData = new FormData();
	formData.append("file", imageFile);

	const response = await fetch(VITE_URL_WP + "wp-json/wp/v2/media", {
		method: "POST",
		headers: {
			"X-WP-Nonce": nonce,
		},
		body: formData,
		credentials: "include",
	});

	const data = await response.json();

	if (!response.ok) {
		console.error("Error uploading image: ", data);
		return null;
	}

	return data.id;
};

// Posts the quiz on WP and returns true if it worked
export const postQuiz = async (quiz) => {
	try {
		const wpApiSettings = window;
		const nonce = wpApiSettings?.nonce;

		if (!nonce) {
			console.error("Nonce not found");
			return false;
		}

		const questions = await Promise.all(quiz.questions.map(postQuestion));
		// const questions = await Promise.all(quiz.questions.map((question) => postQuestion(question)));

		const quizPayload = {
			title: quiz.title,
			status: "pending",
			vignette: quiz.imageId,
			description: quiz.description,
			questions: questions,
			difficulte: quiz.difficulte,
		};

		const response = await fetch(VITE_URL_WP + "wp-json/wp/v2/quiz", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				"X-WP-Nonce": nonce,
			},
			body: JSON.stringify(quizPayload),
			credentials: "include",
		});

		return response.ok;
	} catch (error) {
		console.error("Error posting quiz: ", error);
		return false;
	}
};
