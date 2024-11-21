package app.sportahub.eventservice.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mongodb.lang.Nullable;
import jakarta.validation.constraints.NotBlank;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record LocationRequest(@NotBlank(message = "Location name must be provided")
                              String name,

                              @NotBlank(message = "Street number must be provided")
                              String streetNumber,

                              @NotBlank(message = "Street name must be provided")
                              String streetName,

                              @NotBlank(message = "City must be provided")
                              String city,

                              @NotBlank(message = "Province must be provided")
                              String province,

                              @NotBlank(message = "Country must be provided")
                              String country,

                              @NotBlank(message = "Postal code must be provided")
                              String postalCode,

                              @Nullable
                              String adressLine2,

                              @Nullable
                              String phoneNumber,

                              @Nullable
                              String latitude,

                              @Nullable
                              String longitude) {
}
