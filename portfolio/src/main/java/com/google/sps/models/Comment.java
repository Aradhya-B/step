package com.google.sps.models;

import java.util.Date;

// Comment model
public class Comment {
  // Comment id
  private long id;
  // Comment score
  private double score;
  // Comment author
  private String author;
  // Author email
  private String email;
  // Post time
  private long time;
  // Text content of comment
  private String comment;

  public Comment(long id, double score, String author, String email, long time, String comment) {
    this.id = id;
    this.score = score;
    this.author = author;
    this.email = email;
    this.time = time;
    this.comment = comment;
  }
}
