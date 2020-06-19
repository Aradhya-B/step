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

    const dateEl = createDateElement(comment.time);
    const authorEl = createAuthorElement(comment.email, comment.author);
    const deleteEl = createDeleteElement(comment.id);
    const scoreEl = createScoreElement(comment.score.toFixed(2));
    const container = createDivContainerAndAppendElements(authorEl, deleteEl, dateEl, scoreEl);
    children.push(container);

    const textEl = createTextElement(comment.comment);
    children.push(textEl);

    const lineBreak = document.createElement("hr");
    children.push(lineBreak);

    children.forEach(child => el.appendChild(child));
    return el;
}

/** Creates a container for all passed children elements */
function createDivContainerAndAppendElements(...children) {
    const container = document.createElement("div");
    children.forEach(child => {
        container.appendChild(child);
    });
    return container;
}

/** Creates a text element */
function createTextElement(text) {
    const textEl = document.createElement("p");
    textEl.innerText = text;
    textEl.setAttribute("class", "comment-text");
    return textEl;
}

/** Creates a date element */
function createDateElement(time) {
    const dateEl = document.createElement("span");
    const date = new Date(0);
    date.setUTCSeconds(parseInt(time));
    dateEl.innerText = date;
    dateEl.setAttribute("class", "date");
    return dateEl;
}

/** Creates an author element */
function createAuthorElement(email, author) {
    const authorEl = document.createElement("a");
    authorEl.innerText = author;
    authorEl.setAttribute("href", `mailto:${email}`);
    authorEl.setAttribute("class", "author");
    return authorEl;
}

/** Creates a delete element */
function createDeleteElement(id) {
    const deleteEl = document.createElement("img");
    deleteEl.setAttribute("class", "trash");
    deleteEl.setAttribute("onclick", `deleteCommentFromStorageById(${id})`);
    deleteEl.setAttribute("src", "images/icons/trash.svg");
    return deleteEl;
}

/** Creates a score element */
function createScoreElement(score) {
    const scoreEl = document.createElement("span");
    scoreEl.innerText = `Sentiment: ${score}`;
    // Set class based on score -> The higher, the more "positive"
    if (score >= 0.33) scoreEl.setAttribute("class", "score positive")
    else if (score >= -0.33) scoreEl.setAttribute("class", "score neutral")
    else scoreEl.setAttribute("class", "score negative");
    return scoreEl;
}
