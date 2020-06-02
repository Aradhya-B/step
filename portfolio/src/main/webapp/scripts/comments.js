/*
 * Fetches data from java servlet and adds it to DOM tree
 */
async function fetchAndInsertDataIntoDOM() {
	const response = await fetch('/data');
	const comments = await response.json();
	const commentsListElement = document.getElementById('comments-list')
	commentsListElement.innerHTML = '';
	comments.forEach(comment => {
		commentsListElement.appendChild(
			createListElement(comment)
		);
	});
}

/** Creates an <li> element containing text */
function createListElement(text) {
	const liElement = document.createElement('li');
	liElement.innerHTML = text;
	return liElement;
}
