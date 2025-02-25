import { useState } from "react";
import "./Header.css";

import Login from "../auth/Login";
import Register from "../auth/Register";

const Header = () => {
	const [showLogin, setShowLogin] = useState(false);
	const [showRegister, setShowRegister] = useState(false);

	return (
		<>
			{/* On sépare le header pur (bandeau) 
          et les modals en dehors du header, 
          ainsi ils ne seront pas limités par l'overflow du header. */}
			<header>
				{/* Logo centré */}

				{/* Boutons en haut à droite */}
				<div>
					<button onClick={() => setShowLogin(true)}>Login</button>
					<button onClick={() => setShowRegister(true)}>Register</button>
				</div>
			</header>

			{/* Modals en dehors du <header> pour être sûrs 
          qu'ils soient en position fixe sur tout l'écran */}
			{showLogin && (
				<div>
					<div>
						<button onClick={() => setShowLogin(false)}>X</button>
						<Login />
					</div>
				</div>
			)}

			{showRegister && (
				<div>
					<div>
						<button onClick={() => setShowRegister(false)}>X</button>
						<Register />
					</div>
				</div>
			)}
		</>
	);
};

export default Header;
