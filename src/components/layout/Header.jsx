import { useState, useEffect } from "react";
import "./Header.css";
import { fetchCurrentUser } from "../../services";


import Login from "../auth/Login";
import Register from "../auth/Register";

const Header = () => {
	const [showLogin, setShowLogin] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		(async () => {
			const user = await fetchCurrentUser();
			setUserId(user ? user.id : null);
		})();
	}, []);

	return (
		<>
			{/* On sépare le header pur (bandeau) 
          et les modals en dehors du header, 
          ainsi ils ne seront pas limités par l'overflow du header. */}
			<header>
				{/* Logo centré */}
				{userId && <div className={header-left}>
				<Link to="/create">Crée un quiz</Link>
				</div>}
				<p className="header-title">Quizzy</p>
				{/* Boutons en haut à droite */}
				<div className="header-right">
					<button onClick={() => setShowLogin(true)}>Connexion</button>
					<button onClick={() => setShowRegister(true)}>Inscription</button>
				</div>
			</header>

			{/* Modals en dehors du <header> pour être sûrs 
          qu'ils soient en position fixe sur tout l'écran */}
			{showLogin && (
				<div className="modal-overlay">
					<div className="modal-content">
						<button className="modal-close" onClick={() => setShowLogin(false)}>X</button>
						<Login />
					</div>
				</div>
			)}

			{showRegister && (
				<div className="modal-overlay">
					<div className="modal-content">
						<button className="modal-close" onClick={() => setShowRegister(false)}>X</button>
						<Register />
					</div>
				</div>
			)}
		</>
	);
};

export default Header;
