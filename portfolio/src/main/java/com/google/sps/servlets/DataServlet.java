// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.gson.Gson;
import com.google.sps.models.Comment;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;
import java.text.SimpleDateFormat;

@WebServlet("/data")
public final class DataServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Query query = new Query("Comment").addSort("date", SortDirection.DESCENDING);
    PreparedQuery results = datastore.prepare(query);

    String numberOfCommentsString = request.getParameter("number-comments");
    // Set limit on number of comments in results (Default: Display all comments)
    int limit = getNumberOfComments(numberOfCommentsString);

    List<Entity> limitedResults = results.asList(FetchOptions.Builder.withLimit(limit));

    ArrayList<Comment> comments = new ArrayList<>();
    for (Entity entity: limitedResults) {

      long id = entity.getKey().getId();
      String author = (String) entity.getProperty("author");
      String email = (String) entity.getProperty("email");
      String date = (String) entity.getProperty("date");
      String commentText = (String) entity.getProperty("comment");

      Comment comment = new Comment(id, author, email, date, commentText);
      comments.add(comment);
    }

    String json = convertArrayListToJson(comments);
    response.setContentType("application/json");
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    String comment = request.getParameter("comment").trim();
    // Don't add blank comments to Datastore
    if (comment.isEmpty()) return;

    String author = request.getParameter("comment_author").trim();
    if (author.isEmpty()) author = "Anonymous";

    String email = request.getParameter("email").trim();
    if (email.isEmpty()) email = "@";

    SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");

    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("author", author);
    commentEntity.setProperty("email", email);
    commentEntity.setProperty("comment", comment);
    commentEntity.setProperty("date", formatter.format(new Date()));

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);

    // Refresh after comment is submitted
    response.sendRedirect("/comments.html");
  }

  /*
   * Gets the number of comments requested based on string parameter.
   * Defaults to MAX_VALUE if argument is null or empty.
   * @return requested number of comments.
   */
  private int getNumberOfComments(String numberOfCommentsString) {
    if (numberOfCommentsString == null || numberOfCommentsString.isEmpty()) {
      return Integer.MAX_VALUE;
    } else {
      return Integer.parseInt(numberOfCommentsString);
    }
  }

  private String convertArrayListToJson(ArrayList<Comment> comments) {
    Gson gson = new Gson();
    return gson.toJson(comments);
  }
}
