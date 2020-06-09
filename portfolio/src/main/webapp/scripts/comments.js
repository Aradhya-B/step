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
 * Deletes all comments from Datastore and 
 * calls function to refresh comment page view
 */
function deleteAllCommentsFromStorage() {
	fetch('delete-data', {
		method: 'POST'
	}).then(() => this.fetchAndInsertDataIntoDOM());
}

/*
 * Deletes a single comment from Datastore by id
 */
function deleteCommentFromStorageById(id) {
	fetch(`delete-data?id=${id}`, {
		method: 'POST'
	}).then(() => this.fetchAndInsertDataIntoDOM());
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
	const date = new Date(0);
	date.setUTCSeconds(parseInt(comment.time));
	dateEl.innerText = date;
	dateEl.setAttribute("class", "date");

	const authorEl = document.createElement("a");
	authorEl.innerText = comment.author;
	authorEl.setAttribute("href", `mailto:${comment.email}`);
	authorEl.setAttribute("class", "author");

	const deleteEl = document.createElement("img");
	deleteEl.setAttribute("class", "trash");
	deleteEl.setAttribute("onclick", `deleteCommentFromStorageById(${comment.id})`);
	deleteEl.setAttribute("src", "images/icons/trash.svg");

	const scoreEl = document.createElement("span");
	const score = comment.score.toFixed(2);
	scoreEl.innerText = `Sentiment: ${score}`;

	const authorDateDeleteScoreContainer = document.createElement("div");
	authorDateDeleteScoreContainer.appendChild(authorEl);
	authorDateDeleteScoreContainer.appendChild(deleteEl);
	authorDateDeleteScoreContainer.appendChild(dateEl);
	authorDateDeleteScoreContainer.appendChild(scoreEl);
	children.push(authorDateDeleteScoreContainer);

	const textEl = document.createElement("p");
	textEl.innerText = comment.comment;
	textEl.setAttribute("class", "comment-text");
	children.push(textEl);

	const lineBreak = document.createElement("hr");
	children.push(lineBreak);

	children.forEach(child => el.appendChild(child));
	return el;
}
