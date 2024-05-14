import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreview", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Menu Item Review");
            expect(screen.queryByTestId("MenuItemReview-itemId")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreview", { params: { id: 17 } }).reply(200, {
                id: 17,
                itemId: 88,
                reviewerEmail: "d@c.com",
                stars: 5,
                dateReviewed: "2024-05-03T05:06:02",
                comments: "phenomenal",
            });
            axiosMock.onPut('/api/menuitemreview').reply(200, {
                id: "17",
                itemId: "88",
                reviewerEmail: "d@c.com",
                stars: "5",
                dateReviewed: "2024-05-03T05:06:02",
                comments: "phenomenal",
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-id");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(itemIdField).toBeInTheDocument();
            expect(itemIdField).toHaveValue("88");
            expect(reviewerEmailField).toBeInTheDocument();
            expect(reviewerEmailField).toHaveValue("d@c.com");
            expect(starsField).toBeInTheDocument();
            expect(starsField).toHaveValue("5");
            expect(dateReviewedField).toBeInTheDocument();
            expect(dateReviewedField).toHaveValue("2024-05-03T05:06:02");
            expect(commentsField).toBeInTheDocument();
            expect(commentsField).toHaveValue("phenomenal");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(itemIdField, { target: { value: '88' } });
            fireEvent.change(reviewerEmailField, { target: { value: 'd@c.com' } });
            fireEvent.change(starsField, { target: { value: '5' } });
            fireEvent.change(dateReviewedField, { target: { value: '2024-05-03T05:06:02' } });
            fireEvent.change(commentsField, { target: { value: 'phenomenal' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Menu Item Review Updated - id: 17 itemId: 88");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                itemId: 88,
                reviewerEmail: "d@c.com",
                stars: 5,
                dateReviewed: "2024-05-03T05:06:02",
                comments: "phenomenal"
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-id");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");

            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(idField).toHaveValue("17");
            expect(itemIdField).toHaveValue("88");
            expect(reviewerEmailField).toHaveValue("d@c.com");
            expect(starsField).toHaveValue("5");
            expect(dateReviewedField).toHaveValue("2024-05-03T05:06:02");
            expect(commentsField).toHaveValue("phenomenal");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(itemIdField, { target: { value: '88' } });
            fireEvent.change(reviewerEmailField, { target: { value: 'd@c.com' } });
            fireEvent.change(starsField, { target: { value: '5' } });
            fireEvent.change(dateReviewedField, { target: { value: '2024-05-03T05:06:02' } });
            fireEvent.change(commentsField, { target: { value: 'phenomenal' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Menu Item Review Updated - id: 17 itemId: 88");
            expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });
        });

       
    });
});
