/*
 * Fetches data from java servlet and adds it to DOM tree
 */
async function fetchAndInsertDataIntoDOM() {
	const response = await fetch('/data');
	const comments = await response.json();
	const commentsListElement = document.getElementById('comments-list');
	commentsListElement.innerHTML = '';
	comments.forEach(comment => {
		commentsListElement.appendChild(
			createCommentElement(comment)
		);
	});
}

/** Creates a comment element containing */
function createCommentElement(comment) {
	const el = document.createElement('div');
	el.setAttribute("class", "comment");

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
