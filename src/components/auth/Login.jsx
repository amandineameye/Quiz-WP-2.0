import { useState } from "react";
import { loginUser } from "../../services";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		try {
			const success = await loginUser(username, password);
			if (success) {
				window.location.href = "/";
			} else {
				setError("Identifiants incorrects");
			}
		} catch (err) {
			setError("Une erreur est survenue");
		}
	};

	return (
		<div>
			<h2>Connexion</h2>
			{error && <p style={{ color: "red" }}>{error}</p>}
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
					<label htmlFor="password">Mot de passe :</label>
					<br />
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button type="submit">Se connecter</button>
			</form>
		</div>
	);
};

export default Login;
