import React, { useState } from 'react';
import { Logo } from '@146north/logotype';
import './App.css';

function App() {
	return (
		<div id="App" className="App">
			<header>
				<Logo text="Boilerplate" logosize="100%" margin="24vh,5vh" />
			</header>
			<main className="center mb-100">Hej</main>
			<footer>&copy; 2023 Henrik Danielsson</footer>
		</div>
	);
}

export default App;
