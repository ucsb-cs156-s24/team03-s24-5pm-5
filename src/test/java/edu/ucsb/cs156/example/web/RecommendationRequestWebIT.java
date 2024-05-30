package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_RecommendationRequest() throws Exception {
        setupUser(true);

        page.getByText("Recommendation Request").click();
        page.getByText("Create RecommendationRequest").click();
        assertThat(page.getByText("Create New RecommendationRequest")).isVisible();
        page.getByTestId("RecommendationRequestForm-requesterEmail").fill("a");
        page.getByTestId("RecommendationRequestForm-professorEmail").fill("b");
        page.getByTestId("RecommendationRequestForm-explanation").fill("c");
        page.getByTestId("RecommendationRequestForm-dateRequested").fill("2024-05-03T00:12");
        page.getByTestId("RecommendationRequestForm-dateNeeded").fill("2024-05-03T00:12");
        // page.getByLabel("dateAdded").fill("2024-05-03T00:12");
        page.getByTestId("RecommendationRequestForm-submit").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation"))
                .hasText("c");

        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit RecommendationRequest")).isVisible();
        page.getByTestId("RecommendationRequestForm-explanation").fill("THE BEST");
        page.getByTestId("RecommendationRequestForm-submit").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation")).hasText("THE BEST");

        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_RecommendationRequest() throws Exception {
        setupUser(false);

        page.getByText("Recommendation Request").click();

        assertThat(page.getByText("Create RecommendationRequest")).not().isVisible();
        assertThat(page.getByTestId("RecommendationRequestform-cell-row-0-col-title")).not().isVisible();
    }
}