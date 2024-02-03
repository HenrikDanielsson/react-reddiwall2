export default async function get(sub, page, toload, nsfw) {
	let posts = [];
	let after = '';
	let prefix = '';
	let next = '';
	let err = '';
	let response;
	let data;
	let reddit_data;
	let nsfwcontentcount = 0;
	if (sub.indexOf('user') === -1 && sub.indexOf('r/') === -1) prefix = 'r/';

	const apiUrl =
		'https://www.reddit.com/' +
		prefix +
		sub +
		'/.json?limit=' +
		toload +
		'&after=' +
		page;

	try {
		response = await fetch(apiUrl);
		data = await response.json();
		reddit_data = data.data.children;
		next = data.data.after;
	} catch (e) {
		err =
			'There was a problem fetching the data. Check the subreddit name and try again.';
	}

	if (err) return { posts, after, err };
	try {
		reddit_data.map((post) => {
			if (post.data.hasOwnProperty('media_metadata')) {
				try {
					Object.keys(post.data.media_metadata).forEach((key) => {
						if (post.data.media_metadata[key].m === 'image/jpg') {
							let imageSet = [];
							post.data.media_metadata[key].p.map((images, index) => {
								imageSet.push(
									`${images.u.replace(/&amp;/g, '&')}  ${images.x}w`
								);
							});

							let image = post.data.media_metadata[key].s.u.replace(
								/&amp;/g,
								'&'
							);
							let title = post.data.title;
							let url = post.data.media_metadata[key].s.u.replace(
								/&amp;/g,
								'&'
							);
							let over18 = post.data.over_18;

							if (over18 && !nsfw) {
								nsfwcontentcount++;
								return;
							}

							posts.push({ image, imageSet, title, url, over18 });
						}
					});
				} catch (e) {
					console.error(e);
				}
			} else if (post.data.hasOwnProperty('preview')) {
				try {
					let imageSet = [];
					post.data.preview.images[0].resolutions.map((images, index) => {
						imageSet.push(
							`${images.url.replace(/&amp;/g, '&')} ${images.width}w`
						);
					});

					let image = post.data.preview.images[0].source.url.replace(
						/&amp;/g,
						'&'
					);
					let title = post.data.title;
					let url = post.data.url.replace(/&amp;/g, '&');
					let over18 = post.data.over_18;

					if (over18 && !nsfw) {
						nsfwcontentcount++;
						return;
					}
					posts.push({ image, imageSet, title, url, over18 });
				} catch (e) {
					console.error(e);
				}
			}
		});
	} catch (e) {
		err = e;
	}
	if (posts.length === 0) {
		if (nsfwcontentcount > 0) err = 'NSFW content has been hidden.';
		else if (nsfw) err = 'No images found in this subreddit.';
		else if (nsfwcontentcount === 0) err = 'No images found in this subreddit.';
	}
	return { posts, next, err };
}
