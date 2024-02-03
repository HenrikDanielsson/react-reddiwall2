import React, { useEffect, useState } from 'react';
import get from './components/get';
import { Logo } from '@146north/logotype';
import { Alert, FormControlLabel, Switch } from '@mui/material';
import './App.css';
import { Masonry, LoadingButton } from '@mui/lab';

function App() {
	const [error, setError] = useState(null);
	const [sub, setSub] = useState('');
	const [loading, setLoading] = useState(false);
	const [posts, setPosts] = useState([]);
	const [nextPage, setNextPage] = useState('');
	const [currentPage, setCurrentPage] = useState('');
	const [nsfw, setNsfw] = useState(false);
	const [showLoadMore, setShowLoadMore] = useState(false);

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			setPosts([]);
			setShowLoadMore(true);
			newSub();
		}
	};

	const newSub = (nextPage) => {
		setLoading(true);
		console.info('Fetching new sub', sub, nextPage);
		get(sub, nextPage, 20, nsfw, posts).then((data) => {
			if (data.err) {
				setError(data.err);
				setLoading(false);
				setPosts([]);
				setNextPage('');
				setCurrentPage('');
				return;
			}
			setError(null);
			setPosts((posts) => [...posts, ...data.posts]);
			setNextPage(data.next);
			setCurrentPage(data.page);
		});
	};

	const nsfwContent = (event) => {
		setNsfw(Boolean(event.target.checked));
	};

	const showImage = (url) => {
		window.open(url, '_blank');
	};

	useEffect(() => {
		if (sub) {
			setPosts([]);
			newSub(currentPage);
		}
	}, [nsfw]);
	useEffect(() => {
		setLoading(false);
	}, [posts]);

	return (
		<div id="App" className="App">
			<header>
				<Logo
					text="Reddiwall 2"
					logosize={!posts.length > 0 ? '100%' : '75%'}
					margin={!posts.length > 0 ? '24vh,5vh' : '10vh,5vh'}
				/>
			</header>
			<main className="center mb-100">
				<div className="control">
					{error && (
						<Alert severity="error" className="mb-100">
							{error}
						</Alert>
					)}
					<input
						onChange={(event) => setSub(event.target.value)}
						onKeyDown={handleKeyDown}
						id="message"
						name="message"
						className="mb-50"
						placeholder={sub}
					/>
					<br />
					<FormControlLabel
						control={<Switch />}
						checked={nsfw}
						label="Allow NSFW content"
						className="mb-100"
						onChange={nsfwContent}
					/>
				</div>
				<div className="masonry">
					<Masonry
						columns={{ xs: 2, sm: 3, md: 4, lg: 5 }}
						spacing={2}
						style={{ width: '100%' }}
					>
						{posts.map((item, index) => (
							<div key={index} onClick={() => showImage(item.url)}>
								<img
									srcSet={item.imageSet}
									src={item.image.replace(/&amp;/g, '&')}
									sizes="(max-width: 480px) 100px,
         300px"
									alt={item.title}
									loading="lazy"
									style={{
										borderBottomLeftRadius: 4,
										borderBottomRightRadius: 4,
										display: 'block',
										width: '100%',
										minHeight: 10,
									}}
								/>
							</div>
						))}
					</Masonry>
				</div>

				{showLoadMore && (
					<LoadingButton
						onClick={() => newSub(nextPage)}
						loading={loading}
						loadingIndicator="Loading…"
						variant="outlined"
					>
						<span>Load more..</span>
					</LoadingButton>
				)}
			</main>
			<footer>&copy; 2023 Henrik Danielsson</footer>
		</div>
	);
}

export default App;
