package app.sportahub.eventservice.model.event;



import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder(setterPrefix = "with")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Location {

    @NotBlank(message = "Location name must be provided")
    private String name;

    private String streetNumber;
    private String streetName;

    @NotBlank(message = "City must be provided")
    private String city;

    @NotBlank(message = "Province must be provided")
    private String province;

    @NotBlank(message = "Country must be provided")
    private String country;

    private String postalCode;
    private String addressLine2;
    private String phoneNumber;

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    @NotBlank(message = "Location type must be provided")
    private GeoJsonPoint coordinates;

}
