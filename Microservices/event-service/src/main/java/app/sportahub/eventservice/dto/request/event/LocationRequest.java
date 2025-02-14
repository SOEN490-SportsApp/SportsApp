package app.sportahub.eventservice.dto.request.event;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mongodb.lang.Nullable;
import jakarta.validation.constraints.NotBlank;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record LocationRequest(@NotBlank(message = "Location name must be provided")
                              String name,

                              @Nullable
                              String streetNumber,

                              @Nullable
                              String streetName,

                              @NotBlank(message = "City must be provided")
                              String city,

                              @NotBlank(message = "Province must be provided")
                              String province,

                              @NotBlank(message = "Country must be provided")
                              String country,

                              @Nullable
                              String postalCode,

                              @Nullable
                              String addressLine2,

                              @Nullable
                              String phoneNumber,

                              @Nullable
                              String latitude,

                              @Nullable
                              String longitude) {
}
