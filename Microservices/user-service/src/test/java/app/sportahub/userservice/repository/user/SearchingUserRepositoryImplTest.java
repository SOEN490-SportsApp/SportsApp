package app.sportahub.userservice.repository.user;

import app.sportahub.userservice.model.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SearchingUserRepositoryImplTest {

    @Mock
    private MongoTemplate mongoTemplate;
    private SearchingUserRepositoryImpl searchingUserRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        searchingUserRepository = new SearchingUserRepositoryImpl(mongoTemplate);
    }

    @Test
    void testSearchUsersByFirstName() {
        Pageable pageable = PageRequest.of(0, 10);
        when(mongoTemplate.count(any(Query.class), eq(User.class))).thenReturn(1L);
        when(mongoTemplate.find(any(Query.class), eq(User.class))).thenReturn(Collections.singletonList(new User()));

        Page<User> result = searchingUserRepository.searchUsers("John", null, null, null, null, null, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(mongoTemplate, times(1)).count(any(Query.class), eq(User.class));
        verify(mongoTemplate, times(1)).find(any(Query.class), eq(User.class));
    }

    @Test
    void testSearchUsersByLastName() {
        Pageable pageable = PageRequest.of(0, 10);
        when(mongoTemplate.count(any(Query.class), eq(User.class))).thenReturn(1L);
        when(mongoTemplate.find(any(Query.class), eq(User.class))).thenReturn(Collections.singletonList(new User()));

        Page<User> result = searchingUserRepository.searchUsers(null, "Doe", null, null, null, null, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testSearchUsersBySports() {
        Pageable pageable = PageRequest.of(0, 10);
        when(mongoTemplate.count(any(Query.class), eq(User.class))).thenReturn(1L);
        when(mongoTemplate.find(any(Query.class), eq(User.class))).thenReturn(Collections.singletonList(new User()));

        Page<User> result = searchingUserRepository.searchUsers(null, null, Arrays.asList("Soccer", "Basketball"), null, null, null, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testSearchUsersByGender() {
        Pageable pageable = PageRequest.of(0, 10);
        when(mongoTemplate.count(any(Query.class), eq(User.class))).thenReturn(1L);
        when(mongoTemplate.find(any(Query.class), eq(User.class))).thenReturn(Collections.singletonList(new User()));

        Page<User> result = searchingUserRepository.searchUsers(null, null, null, null, "male", null, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testSearchUsersByAgeRange() {
        Pageable pageable = PageRequest.of(0, 10);
        when(mongoTemplate.count(any(Query.class), eq(User.class))).thenReturn(1L);
        when(mongoTemplate.find(any(Query.class), eq(User.class))).thenReturn(Collections.singletonList(new User()));

        Page<User> result = searchingUserRepository.searchUsers(null, null, null, null, null, "25-30", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testSearchUsersByAgeComparison() {
        Pageable pageable = PageRequest.of(0, 10);
        when(mongoTemplate.count(any(Query.class), eq(User.class))).thenReturn(1L);
        when(mongoTemplate.find(any(Query.class), eq(User.class))).thenReturn(Collections.singletonList(new User()));

        Page<User> result = searchingUserRepository.searchUsers(null, null, null, null, null, ">30", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testSearchUsersByAgeComparison1() {
        Pageable pageable = PageRequest.of(0, 10);
        when(mongoTemplate.count(any(Query.class), eq(User.class))).thenReturn(1L);
        when(mongoTemplate.find(any(Query.class), eq(User.class))).thenReturn(Collections.singletonList(new User()));

        Page<User> result = searchingUserRepository.searchUsers(null, null, null, null, null, "<15", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testSearchUsersByAgeComparison2() {
        Pageable pageable = PageRequest.of(0, 10);
        when(mongoTemplate.count(any(Query.class), eq(User.class))).thenReturn(1L);
        when(mongoTemplate.find(any(Query.class), eq(User.class))).thenReturn(Collections.singletonList(new User()));

        Page<User> result = searchingUserRepository.searchUsers(null, null, null, null, null, ">=30", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testSearchUsersByAgeComparison3() {
        Pageable pageable = PageRequest.of(0, 10);
        when(mongoTemplate.count(any(Query.class), eq(User.class))).thenReturn(1L);
        when(mongoTemplate.find(any(Query.class), eq(User.class))).thenReturn(Collections.singletonList(new User()));

        Page<User> result = searchingUserRepository.searchUsers(null, null, null, null, null, "<=30", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testSearchUsersByAgeComparison4() {
        Pageable pageable = PageRequest.of(0, 10);
        when(mongoTemplate.count(any(Query.class), eq(User.class))).thenReturn(1L);
        when(mongoTemplate.find(any(Query.class), eq(User.class))).thenReturn(Collections.singletonList(new User()));

        Page<User> result = searchingUserRepository.searchUsers(null, null, null, null, null, "=30", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testInvalidAgeFormat() {
        Pageable pageable = PageRequest.of(0, 10);
        assertThrows(IllegalArgumentException.class, () ->
                searchingUserRepository.searchUsers(null, null, null, null, null, "invalid-age", pageable));
    }

    @Test
    void testPagination() {
        Pageable pageable = PageRequest.of(1, 5);
        when(mongoTemplate.count(any(Query.class), eq(User.class))).thenReturn(15L);
        when(mongoTemplate.find(any(Query.class), eq(User.class))).thenReturn(Arrays.asList(new User(), new User()));

        Page<User> result = searchingUserRepository.searchUsers(null, null, null, null, null, null, pageable);

        assertNotNull(result);
        assertEquals(15, result.getTotalElements());
        assertEquals(2, result.getContent().size());
    }
}
