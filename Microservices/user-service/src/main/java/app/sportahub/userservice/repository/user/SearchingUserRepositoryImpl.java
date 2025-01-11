package app.sportahub.userservice.repository.user;

import app.sportahub.userservice.model.user.User;
import com.mongodb.BasicDBObject;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Implementation of the {@link SearchingUserRepository} interface, providing custom
 * methods for searching and filtering user data stored in a MongoDB database.
 * <p>
 * This class utilizes {@link MongoTemplate} for querying the database
 * and supports complex criteria such as first name, last name, sports preferences,
 * ranking, gender, and age.
 */
@RequiredArgsConstructor
public class SearchingUserRepositoryImpl implements SearchingUserRepository {
    private final MongoTemplate mongoTemplate;

    /**
     * Searches for users in the database based on the provided criteria.
     *
     * @param firstName the first name of the user (supports case-insensitive partial matching)
     * @param lastName the last name of the user (supports case-insensitive partial matching)
     * @param sports a list of sports preferences (case-insensitive matching)
     * @param rankings the ranking of the user * @param gender the gender of the user
     * @param age the age or age range of the user (e.g., "25", "<30", "20-40")
     * @param pageable the {@link Pageable} object specifying pagination information
     * @return a {@link Page} of {@link User} objects matching the search criteria
     */
    @Override
    public Page<User> searchUsers(String firstName, String lastName, List<String> sports, List<String> rankings, String gender, String age, Pageable pageable) {
        Query query = new Query();
        if (firstName != null) {
            query.addCriteria(Criteria.where("profile.firstName").regex(firstName, "i"));
        }
        if (lastName != null) {
            query.addCriteria(Criteria.where("profile.lastName").regex(lastName, "i"));
        }
        if (sports != null && !sports.isEmpty()) {
            for (int i = 0; i < sports.size(); i++) {
                String sport = sports.get(i);
                sport = sport.substring(0, 1).toUpperCase() + sport.substring(1).toLowerCase();
                sports.set(i, sport);
            }
            query.addCriteria(Criteria.where("profile.sportsOfPreference.name").in(sports));
        }
        if (rankings != null && !rankings.isEmpty()) {
            for (int i = 0; i < rankings.size(); i++) {
                String ranking = rankings.get(i);
                ranking = ranking.substring(0, 1).toUpperCase() + ranking.substring(1).toLowerCase();
                rankings.set(i, ranking);
            }
            query.addCriteria(Criteria.where("profile.sportsOfPreference.ranking").in(rankings));
        }
        if (gender != null) {
            gender = gender.substring(0, 1).toUpperCase() + gender.substring(1).toLowerCase();
            query.addCriteria(Criteria.where("profile.gender").is(gender));
        }
        if (age != null) {
            applyAgeCriteria(query, age);
        }
        long total = mongoTemplate.count(query, User.class);
        query.with(pageable);
        List<User> users = mongoTemplate.find(query, User.class);
        return new PageImpl<>(users, pageable, total);
    }

    /**
     * Applies age-related filtering to the provided query.
     * <p>
     * Supports filtering by a specific age, a range of ages (e.g., "20-30"),
     * or operator-based comparisons (e.g., "<25", ">=30").
     *
     * @param query the {@link Query} object to which age criteria will be added
     * @param age the age or age range filter
     * @throws IllegalArgumentException if the age format is invalid
     */
    private void applyAgeCriteria(Query query, String age) {
        // Check if the age parameter is a range (e.g., "20-30")
        Pattern rangePattern = Pattern.compile("(\\d+)-(\\d+)");
        Matcher rangeMatcher = rangePattern.matcher(age);
        if (rangeMatcher.matches()) { // Age range logic
            int startAge = Integer.parseInt(rangeMatcher.group(1));
            int endAge = Integer.parseInt(rangeMatcher.group(2));
            int currentYear = LocalDate.now().getYear();
            int startYear = currentYear - endAge; // Earlier year for the older age
            int endYear = currentYear - startAge; // Later year for the younger age
            query.addCriteria(Criteria.where("profile.dateOfBirth").gte(LocalDate.of(startYear, 1, 1)).lte(LocalDate.of(endYear, 12, 31)));
        } else { // Single age or operator-based age logic
            Pattern pattern = Pattern.compile("([<>=]{1,2})?(\\d+)");
            Matcher matcher = pattern.matcher(age);
            if (matcher.find()) {
                String operator = matcher.group(1) != null ? matcher.group(1) : "=";
                int ageValue = Integer.parseInt(matcher.group(2));
                int cutoffYear = LocalDate.now().getYear() - ageValue;
                switch (operator) {
                    case "<":
                        query.addCriteria(Criteria.where("$expr").gt(Arrays.asList(new BasicDBObject("$year", "$profile.dateOfBirth"), cutoffYear)));
                        break;
                    case ">":
                        query.addCriteria(Criteria.where("$expr").lt(Arrays.asList(new BasicDBObject("$year", "$profile.dateOfBirth"), cutoffYear)));
                        break;
                    case "<=":
                        query.addCriteria(Criteria.where("$expr").gte(Arrays.asList(new BasicDBObject("$year", "$profile.dateOfBirth"), cutoffYear)));
                        break;
                    case ">=":
                        query.addCriteria(Criteria.where("$expr").lte(Arrays.asList(new BasicDBObject("$year", "$profile.dateOfBirth"), cutoffYear)));
                        break;
                    case "=":
                        query.addCriteria(Criteria.where("$expr").is(new BasicDBObject("$eq", Arrays.asList(new BasicDBObject("$year", "$profile.dateOfBirth"), cutoffYear))));
                        break;
                    default:
                        throw new IllegalArgumentException("Unsupported operator in age filter: " + operator);
                }
            } else {
                throw new IllegalArgumentException("Invalid age format: " + age);
            }
        }
    }
}