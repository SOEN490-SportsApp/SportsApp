package app.sportahub.eventservice.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record LocationResponse(String name, String streetNumber, String streetName, String city, String province,
                               String country, String postalCode, String addressLine2, String phoneNumber,
                               String latitude, String longitude) {
}
