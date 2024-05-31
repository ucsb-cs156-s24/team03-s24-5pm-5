package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.microsoft.playwright.Page;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBDiningCommonsMenuItemsWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_ucsbDiningCommonsMenuItems() throws Exception {
        setupUser(true);

        page.getByText("Menu Item", new Page.GetByTextOptions().setExact(true)).click();

        page.getByText("Create Menu Item").click();
        assertThat(page.getByText("Create New UCSBDiningCommonsMenuItems")).isVisible();
        page.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode").fill("Ortega");
        page.getByTestId("UCSBDiningCommonsMenuItemsForm-name").fill("Soda");
        page.getByTestId("UCSBDiningCommonsMenuItemsForm-station").fill("Beverages");
        page.getByTestId("UCSBDiningCommonsMenuItemsForm-submit").click();

        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-station"))
                .hasText("Beverages");

        page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit UCSBDiningCommonsMenuItems")).isVisible();
        page.getByTestId("UCSBDiningCommonsMenuItemsForm-station").fill("Snacks");
        page.getByTestId("UCSBDiningCommonsMenuItemsForm-submit").click();

        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-station")).hasText("Snacks");

        page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_ucsbDiningCommonsMenuItems() throws Exception {
        setupUser(false);

        page.getByText("Menu Item", new Page.GetByTextOptions().setExact(true)).click();

        assertThat(page.getByText("Create New UCSBDiningCommonsMenuItems")).not().isVisible();
        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-name")).not().isVisible();
    }
}
