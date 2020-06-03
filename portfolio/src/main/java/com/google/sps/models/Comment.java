package com.google.sps.models;

import java.util.Date;

// Comment model
public class Comment {
  // Comment id
  private long id;
  // Comment author
  private String author;
  // Author email
  private String email;
  // Post date
  private String date;
  // Text content of comment
  private String comment;

  public Comment(long id, String author, String email, String date, String comment) {
    this.id = id;
    this.author = author;
    this.email = email;
    this.date = date;
    this.comment = comment;
  }
}
