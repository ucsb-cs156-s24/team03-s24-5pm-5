import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UCSBDiningCommonsMenuItemsIndexPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { ucsbDiningCommonsMenuItemsFixtures } from "fixtures/ucsbDiningCommonsMenuItemsFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("UCSBDiningCommonsMenuItemsIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "UCSBDiningCommonsMenuItemsTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };


    const queryClient = new QueryClient();

    test("Renders with Create Button for admin user", async () => {
        setupAdminUser();
        axiosMock.onGet("/api/ucsbdiningcommonsmenuitems/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Create Menu Item/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create Menu Item/);
        expect(button).toHaveAttribute("href", "/diningcommonsmenuitems/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders three menu items correctly for regular user", async () => {
        setupUserOnly();
        axiosMock.onGet("/api/ucsbdiningcommonsmenuitems/all").reply(200, ucsbDiningCommonsMenuItemsFixtures.threeDiningCommonsMenuItems);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

        const createUCSBDiningCommonsMenuItemsButton = screen.queryByText("Create UCSBDiningCommonsMenuItems");
        expect(createUCSBDiningCommonsMenuItemsButton).not.toBeInTheDocument();

        const name = screen.getByText("Tofu Banh Mi Sandwich (v)");
        expect(name).toBeInTheDocument();

        const station = screen.getByText("Entree Specials");
        expect(station).toBeInTheDocument();

        // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
        expect(screen.queryByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
        expect(screen.queryByText(/Create Menu Item/)).not.toBeInTheDocument();

    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        axiosMock.onGet("/api/ucsbdiningcommonsmenuitems/all").timeout();

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/ucsbdiningcommonsmenuitems/all");
        restoreConsole();

    });

    test("what happens when you click delete, admin", async () => {
        setupAdminUser();

        axiosMock.onGet("/api/ucsbdiningcommonsmenuitems/all").reply(200, ucsbDiningCommonsMenuItemsFixtures.threeDiningCommonsMenuItems);
        axiosMock.onDelete("/api/ucsbdiningcommonsmenuitems").reply(200, "UCSBDiningCommonsMenuItems with id 1 was deleted");


        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");


        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("UCSBDiningCommonsMenuItems with id 1 was deleted") });

        await waitFor(() => { expect(axiosMock.history.delete.length).toBe(1); });
        expect(axiosMock.history.delete[0].url).toBe("/api/ucsbdiningcommonsmenuitems");
        expect(axiosMock.history.delete[0].url).toBe("/api/ucsbdiningcommonsmenuitems");
        expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
    });

});
