/*
 * Fetch header content from file and 
 * insert into header element on page
 */
fetch("./header.html")
    .then(res => res.text())
    .then(data => document.querySelector("header").innerHTML = data)
