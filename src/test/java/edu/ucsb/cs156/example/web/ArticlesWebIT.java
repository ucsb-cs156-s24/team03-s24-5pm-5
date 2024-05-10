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
public class ArticlesWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_article() throws Exception {
        setupUser(true);

        page.getByText("Articles").click();

        page.getByText("Create Article").click();
        assertThat(page.getByText("Create New Article")).isVisible();
        page.getByTestId("ArticlesForm-title").fill("Cristino's Bakery");
        page.getByTestId("ArticlesForm-url").fill("https://www.cristinosbakery.com/");
        page.getByTestId("ArticlesForm-explanation").fill("burritos and tacos");
        page.getByTestId("ArticlesForm-email").fill("crist@gmail.com");
        page.getByTestId("ArticlesForm-dateAdded").fill("2024-05-03T00:12");
        // page.getByLabel("dateAdded").fill("2024-05-03T00:12");
        page.getByTestId("ArticlesForm-submit").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-explanation"))
                .hasText("burritos and tacos");

        page.getByTestId("ArticlesTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Article")).isVisible();
        page.getByTestId("ArticlesForm-explanation").fill("THE BEST");
        page.getByTestId("ArticlesForm-submit").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-explanation")).hasText("THE BEST");

        page.getByTestId("ArticlesTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_restaurant() throws Exception {
        setupUser(false);

        page.getByText("Articles").click();

        assertThat(page.getByText("Create Article")).not().isVisible();
        assertThat(page.getByTestId("Articlesform-cell-row-0-col-title")).not().isVisible();
    }
}