package com.google.sps.models;

/** Represents a patent filing at a specifc longitude and latitude and on a specific date. */
public class PatentFiling {
  private String date;
  private double lat;
  private double lng;

  public PatentFiling(String date, double lat, double lng) {
    this.date = date;
    this.lat = lat;
    this.lng = lng;
  }
}
