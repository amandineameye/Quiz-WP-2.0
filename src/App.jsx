import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import QuizList from "./components/quiz/QuizList";
import QuizDetail from "./components/quiz/QuizDetail";
import CreateForm from "./components/quiz/CreateQuiz";

function App() {
	return (
		<>
			<Router>
				<Header />
				<Routes>
					<Route path="/" element={<QuizList />} />
					<Route path="/quiz/:id" element={<QuizDetail />} />
					<Route path="/create" element={<CreateForm />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
