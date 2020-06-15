/*
 * Fetch footer content from file and 
 * insert into footer element on page
 */
fetch("./footer.html")
    .then(res => res.text())
    .then(data => document.querySelector("footer").innerHTML = data)
