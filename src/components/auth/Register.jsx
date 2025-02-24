import { useState } from "react";
import { registerUser } from "../../services";

const Register = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [error, setError] = useState(null);
	const [successMsg, setSuccessMsg] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccessMsg(null);

		try {
			const success = await registerUser(username, email);
			if (success) {
				setSuccessMsg("Inscription réussie ! Vérifiez vos emails.");
			} else {
				setError("Un problème est survenu, veuillez réessayer.");
			}
		} catch (err) {
			setError("Une erreur est survenue lors de l’inscription.");
		}
	};

	return (
		<div>
			<h2>Inscription</h2>
			{error && <p style={{ color: "red" }}>{error}</p>}
			{successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="username">Nom d'utilisateur :</label>
					<br />
					<input
						id="username"
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>

				<div>
					<label htmlFor="email">Adresse e-mail :</label>
					<br />
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<button type="submit">S’inscrire</button>
			</form>
		</div>
	);
};

export default Register;
