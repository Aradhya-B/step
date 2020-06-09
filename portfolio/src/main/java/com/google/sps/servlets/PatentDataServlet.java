package com.google.sps.servlets;

import com.google.sps.models.PatentFiling;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Scanner;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Returns Patent data as a JSON array, e.g. [{"date": "2000-01-01", "lat": 38.40043, "lng": -122.23145}] */
@WebServlet("/patent-data")
public class PatentDataServlet extends HttpServlet {

  private Collection<PatentFiling> patentFilings;

  @Override
  public void init() {
    patentFilings = new ArrayList<>();

    Scanner scanner = new Scanner(getServletContext().getResourceAsStream("/WEB-INF/canadian_patents.csv"));
    // Go to next line to skip over column headings
    scanner.nextLine();

    while (scanner.hasNextLine()) {
      String line = scanner.nextLine();
      String[] cells = line.split(",");

      String date = cells[4];
      double lat = Double.parseDouble(cells[5]);
      double lng = Double.parseDouble(cells[6]);

      patentFilings.add(new PatentFiling(date, lat, lng));
    }
    scanner.close();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");
    Gson gson = new Gson();
    String json = gson.toJson(patentFilings);
    response.getWriter().println(json);
  }
}
