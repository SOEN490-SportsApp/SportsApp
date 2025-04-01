package app.sportahub.eventservice.mapper.user;

import com.fasterxml.jackson.databind.ObjectMapper;

import app.sportahub.eventservice.model.user.UserProfile;

public class UserProfileMapper {

    public UserProfile userStringToUserProfile(String user) {
        ObjectMapper objectMapper = new ObjectMapper();
        UserProfile userProfile;
        try {
            userProfile = objectMapper.readValue(user, UserProfile.class);
        } catch (Exception e) {
            throw new RuntimeException("Error processing JSON for user data");
        }
        return userProfile;
    }
}