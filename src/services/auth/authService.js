const { VITE_URL_WP } = import.meta.env;

// Posts username and password for verification
// Returns true if it worked
export const loginUser = async (username, password) => {
	const formData = new URLSearchParams();
	formData.append("log", username);
	formData.append("pwd", password);

	try {
		const response = await fetch(VITE_URL_WP + "wp-login.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: formData.toString(),
			credentials: "include",
		});
		return response.ok;
	} catch (error) {
		console.error("Erreur lors de la connexion: ", error);
		throw error;
	}
};

// Posts a register action with username and email
// Returns true if it worked
// Need plugin to send password by email
export const registerUser = async (username, email) => {
	const formData = new URLSearchParams();
	formData.append("user_login", username);
	formData.append("user_email", email);
	formData.append("wp-submit", "Register");
	formData.append("action", "register");
	formData.append("redirect_to", "/");

	try {
		const response = await fetch(VITE_URL_WP + "wp-login.php?action=register", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: formData.toString(),
			credentials: "include",
		});

		return response.ok;
	} catch (error) {
		console.error("Erreur lors de l'inscription: ", error);
		throw error;
	}
};

// Returns the id and name of the current user in an object
export const fetchCurrentUser = async () => {
	try {
		const { wpApiSettings } = window;

		if (!wpApiSettings.root) {
			console.error("wpApiSettings.root est introuvable");
			return null;
		}

		const response = await fetch(`${wpApiSettings.root}wp/v2/users/me`, {
			credentials: "include",
			headers: {
				"X-WP-Nonce": wpApiSettings.nonce,
			},
		});

		if (!response.ok) {
			console.error(
				"Erreur fetchCurrentUser: ",
				response.status,
				await response.text()
			);
			return null;
		}

		const data = await response.json();
		return { id: data.id, name: data.name };
	} catch (error) {
		console.error("Erreur lors du fetchCurrentUser: ", error);
	}
};
