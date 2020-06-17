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

package com.google.sps;

import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.ArrayList;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    long requestDuration = request.getDuration();
    // If the requested duration is longer than a day or less than 0 minutes, there is no valid range to be returned
    if (requestDuration > TimeRange.WHOLE_DAY.duration() || requestDuration < 0) return new ArrayList<TimeRange>();

    List<String> requestAttendees = new ArrayList<>(request.getAttendees());
    List<Event> eventsList = new ArrayList<>(events);

    Collections.sort(eventsList, Event.ORDER_BY_START_TIME);

    // Create clone to iterate over
    List<Event> eventsListClone = new ArrayList<>(eventsList);

    for (Event event : eventsListClone) {
      ArrayList<String> eventAttendees = new ArrayList<String>(event.getAttendees());
      // Filter out events that don't have any people requested in the meeting in them
      if (!listsHaveCommonElements(requestAttendees, eventAttendees)) eventsList.remove(event);
    }

    List<TimeRange> availableTimes = new ArrayList<>();
    int currTime = 0;
    
    for (Event event : eventsList) {
      // If a a possible meeting time exceeds the end of the day, we're done
      if (currTime + requestDuration > TimeRange.END_OF_DAY) return availableTimes;

      TimeRange eventTimeRange = event.getWhen();
      int eventStartTime = eventTimeRange.start();
      int eventEndTime = eventTimeRange.end();
      int availableTimeDuration = eventStartTime - currTime;

      // For this to be a valid time block, the possible duration must be greater than or equal to the requested duration
      if (availableTimeDuration >= requestDuration) {
        availableTimes.add(TimeRange.fromStartDuration(currTime, availableTimeDuration));
        currTime = eventEndTime;
        continue;
      }

      // Move as far forward into the day as we can
      currTime = Math.max(currTime, eventEndTime);
    }

    // If there is any remaining time at the tail of the day that is longer than the requested meeting,
    // mark that time range as available
    if (TimeRange.END_OF_DAY - currTime >= requestDuration) {
      availableTimes.add(TimeRange.fromStartEnd(currTime, TimeRange.END_OF_DAY, true));
    }
    return availableTimes;
  }

  private boolean listsHaveCommonElements(List<String> first, List<String> second) {
    for (String el : second) {
      if (first.contains(el)) return true;
    }
    return false;
  }
}
