import { postQuiz, uploadImage } from "../../services";
import { useState, useRef } from "react";

import "./CreateQuiz.css";

const CreateForm = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [questions, setQuestions] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState({
		question: "",
		contenu: null,
		reponse_en: "",
		reponse_fr: "",
		reponse_alternative: "",
	});
	const [imageFile, setImageFile] = useState(null);
	const [difficulty, setDifficulty] = useState("");
	const [message, setMessage] = useState(null);

	const fileInputRef = useRef(null);

	const handleQuestionChange = (e) => {
		const { id, value, files } = e.target;
		setCurrentQuestion((prev) => ({
			...prev,
			[id]: files ? files[0] : value,
		}));
	};

	const addQuestion = () => {
		if (!currentQuestion.question.trim()) {
			setMessage("Question cannot be empty.");
			return;
		}
		setQuestions((prev) => {
			return [
				...prev,
				{ ...currentQuestion, contenu: currentQuestion.contenu },
			];
		});
		setCurrentQuestion({
			// Reset form for next question
			question: "",
			contenu: null,
			reponse_en: "",
			reponse_fr: "",
			reponse_alternative: "",
		});

		if (fileInputRef.current) {
			fileInputRef.current.value = ""; // Reset the file input field
		}
	};

	const deleteQuestion = (indexToDelete) => {
		setQuestions((prev) => prev.filter((_, index) => index !== indexToDelete));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (questions.length === 0) {
			setMessage("Please add at least one question.");
			return;
		}
		if (!title.trim() || !description.trim()) {
			setMessage("Please provide a title and a description.");
			return;
		}
		if (!difficulty) {
			setMessage("Please select a difficulty level.");
			return;
		}
		try {
			const imageId = imageFile ? await uploadImage(imageFile) : null;
			const quiz = {
				title,
				description,
				questions,
				imageId,
				difficulty,
			};
			const success = await postQuiz(quiz);
			const resultMessage = success
				? "Quiz sent for approval. Thank you!"
				: "An error occurred. Try later please.";
			setMessage(resultMessage);
		} catch (error) {
			console.error(error);
			setMessage("An error occurred. Try later please.");
		}
	};

	return (
		<div className="create-main">
			{message && <p>{message}</p>}
			<form onSubmit={handleSubmit}>
				<h2>Crée ton propre quiz</h2>
				<label htmlFor="title">Titre</label>
				<input
					type="text"
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<label htmlFor="description">Description</label>
				<textarea
					id="description"
					name="description"
					rows="4"
					cols="50"
					placeholder="Enter quiz description..."
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				></textarea>

				<label htmlFor="quiz-image">Image du quiz</label>
				<input
					type="file"
					id="quiz-image"
					onChange={(e) => setImageFile(e.target.files?.[0] || null)}
				/>

				<select
					name="difficulte"
					id="difficulte"
					onChange={(e) => setDifficulty(e.target.value)}
					value={difficulty}
				>
					<option value="">Niveau de difficulté</option>
					<option value="easy">Facile</option>
					<option value="medium">Moyen</option>
					<option value="hard">Difficile</option>
				</select>

				<h3>Questions</h3>
				<label htmlFor="question">Question</label>
				<input
					type="text"
					id="question"
					onChange={handleQuestionChange}
					value={currentQuestion.question}
					required
				/>

				<label htmlFor="contenu">Contenu</label>
				<input
					type="file"
					id="contenu"
					onChange={handleQuestionChange}
					ref={fileInputRef}
				/>

				<label htmlFor="reponse_fr">Réponse en français</label>
				<input
					type="text"
					id="reponse_fr"
					onChange={handleQuestionChange}
					value={currentQuestion.reponse_fr}
				/>

				<label htmlFor="reponse_en">Réponse en anglais</label>
				<input
					type="text"
					id="reponse_en"
					onChange={handleQuestionChange}
					value={currentQuestion.reponse_en}
				/>

				<label htmlFor="reponse_alternative">Réponse alternative</label>
				<input
					type="text"
					id="reponse_alternative"
					onChange={handleQuestionChange}
					value={currentQuestion.reponse_alternative}
				/>
				<button className="submit-button" type="button" onClick={addQuestion}>
					Ajouter la question
				</button>

				{questions.length > 0 && (
					<div className="added-questions">
						<h3>Questions ajoutées</h3>
						{questions.map((question, index) => (
							<div className="added-question-item-div" key={index}>
								<p>{question.question}</p>
								<button className="delete-button"  type="button" onClick={() => deleteQuestion(index)}>
									X
								</button>
							</div>
						))}
					</div>
				)}

				<button className="submit-button"  type="submit" disabled={questions.length === 0}>
					Envoyer le quiz
				</button>
			</form>
		</div>
	);
};

export default CreateForm;
