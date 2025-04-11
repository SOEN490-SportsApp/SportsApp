package app.sportahub.eventservice.model.user;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import app.sportahub.eventservice.enums.SkillLevelEnum;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserProfile {

    @JsonProperty("profile")
    private Profile profile;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Profile {
        @JsonProperty("sportsOfPreference")
        private List<SportPreferences> sportsOfPreference;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SportPreferences {
        @JsonProperty("name")
        private String sport;
        
        @JsonProperty("ranking")
        private SkillLevelEnum ranking;

        public void setRanking(String ranking) {
            try {
                this.ranking = SkillLevelEnum.valueOf(ranking.toUpperCase());
            } catch (IllegalArgumentException | NullPointerException e) {
                this.ranking = SkillLevelEnum.BEGINNER;  
            }
        }
    }
}