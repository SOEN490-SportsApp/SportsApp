package app.sportahub.eventservice.utils;

import app.sportahub.eventservice.model.event.Event;

public class Haversine {

    private static final double EARTH_RADIUS = 6371;
    private static final double DEG_TO_RAD = Math.PI / 180.0;

    public static double EventHaversineDistance(Event event1, Event event2) {
            double longitude1 = event1.getLocation().getCoordinates().getX() * DEG_TO_RAD;
            double latitude1 = event1.getLocation().getCoordinates().getY() * DEG_TO_RAD;
            double longitude2 = event2.getLocation().getCoordinates().getX() * DEG_TO_RAD;
            double latitude2 = event2.getLocation().getCoordinates().getY() * DEG_TO_RAD;
            
            double dlat = latitude2 - latitude1;
            double dlon = longitude2 - longitude1;
            
            double a = Math.pow(Math.sin(dlat / 2), 2) + 
            Math.pow(Math.sin(dlon / 2), 2) * 
            Math.cos(latitude1) * 
            Math.cos(latitude2);
            
            double distance = EARTH_RADIUS * 2 * Math.asin(Math.sqrt(a));
            return distance; 
        }
}
