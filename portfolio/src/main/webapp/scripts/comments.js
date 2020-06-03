/*
 * Fetches data from java servlet and adds it to DOM tree
 */
async function fetchAndInsertDataIntoDOM() {
	const queryString = constructQueryString();

	const response = await fetch('/data' + queryString);
	const comments = await response.json();
	const commentsListElement = document.getElementById('comments-list');
	commentsListElement.innerHTML = '';
	comments.forEach(comment => {
		commentsListElement.appendChild(
			createCommentElement(comment)
		);
	});
}

/*
 * Gets query string parameters and constructs query string
 * to be appended to server calls
 */
function constructQueryString() {
	const urlParams = new URLSearchParams(window.location.search);
	let queryString = '?';
	for (const [key, value] of urlParams) {
		queryString += `${key}=${value}&`;
	}
	// Remove extra '&' at end of query string, or '?' if no url params
	queryString = queryString.slice(0, -1);
	return queryString;
}

/** Creates a comment element */
function createCommentElement(comment) {
	const el = document.createElement('div');
	el.setAttribute("class", "comment");
	el.setAttribute("id", comment.id);

	let children = [];

	const dateEl = document.createElement("span");
	dateEl.innerText = comment.date;
	dateEl.setAttribute("class", "date");
	children.push(dateEl);

	const authorEl = document.createElement("a");
	authorEl.innerText = comment.author;
	authorEl.setAttribute("href", `mailto:${comment.email}`);
	authorEl.setAttribute("class", "author");
	children.push(authorEl);

	const textEl = document.createElement("p");
	textEl.innerText = comment.comment;
	textEl.setAttribute("class", "comment-text");
	children.push(textEl);

	children.forEach(child => el.appendChild(child));
	return el;
}
