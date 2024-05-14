import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

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

describe("RecommendationRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/RecommendationRequest", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit RecommendationRequest");
            expect(screen.queryByTestId("RecommendationRequest-requesterEmail")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/RecommendationRequest", { params: { id: 17 } }).reply(200, {
                id: 17,
                requesterEmail: "student1@gmail.com",
                professorEmail: "professor1@gmail.com",
                explanation: "please",
                dateRequested: "2022-02-02T00:00",
                dateNeeded: "2022-02-02T00:00",
                done: true
            });
            axiosMock.onPut('/api/RecommendationRequest').reply(200, {
                id: 17,
                requesterEmail: "student1@gmail.com",
                professorEmail: "professor1@gmail.com",
                explanation: "please",
                dateRequested: "2022-02-02T00:00",
                dateNeeded: "2022-02-02T00:00",
                done: true
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RecommendationRequestForm-id");

            const idField = screen.getByTestId("RecommendationRequestForm-id");
            const requesterEmail = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            const professorEmail= screen.getByTestId("RecommendationRequestForm-professorEmail");
            const explanation = screen.getByTestId("RecommendationRequestForm-explanation");
            const dateRequested = screen.getByTestId("RecommendationRequestForm-dateRequested");
            const dateNeeded = screen.getByTestId("RecommendationRequestForm-dateNeeded");
            const done = screen.getByTestId("RecommendationRequestForm-done");
            const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(requesterEmail).toHaveValue("student1@gmail.com");
            expect(professorEmail).toHaveValue("professor1@gmail.com");
            expect(explanation).toHaveValue("please");
            expect(dateRequested).toHaveValue("2022-02-02T00:00");
            expect(dateNeeded).toHaveValue("2022-02-02T00:00");
            expect(done).toHaveValue("true");
            expect(submitButton).toBeInTheDocument();

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(requesterEmail, { target: { value: 'student1@gmail.com' } });
            fireEvent.change(professorEmail, { target: { value: 'professor1@gmail.com' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("RecommendationRequest Updated - id: 17 requesterEmail: student1@gmail.com professorEmail:professor1@gmail.com explanation: professorEmail:please");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequest" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                id: 17,
                requesterEmail: "student1@gmail.com",
                professorEmail: "professor1@gmail.com",
                explanation: "please",
                dateRequested: "2022-02-02T00:00",
                dateNeeded: "2022-02-02T00:00",
                done: true
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecommendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RecommendationRequestForm-id");

            const idField = screen.getByTestId("RecommendationRequestForm-id");
            const requesterEmail = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            const professorEmail = screen.getByTestId("RecommendationRequestForm-professorEmail");
            const explanation = screen.getByTestId("RecommendationRequestForm-explanation");
            const dateRequested = screen.getByTestId("RecommendationRequestForm-dateRequested");
            const dateNeeded = screen.getByTestId("RecommendationRequestForm-dateNeeded");
            const done = screen.getByTestId("RecommendationRequestForm-done");
            const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

            expect(idField).toHaveValue("17");
            expect(requesterEmail).toHaveValue("student1@gmail.com");
            expect(professorEmail).toHaveValue("professor1@gmail.com");
            expect(explanation).toHaveValue("please");
            expect(dateRequested).toHaveValue("2022-02-02T00:00");
            expect(dateNeeded).toHaveValue("2022-02-02T00:00");
            expect(done).toHaveValue("true");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(requesterEmail, { target: { value: 'student1@gmail.com' } })
            fireEvent.change(professorEmail, { target: { value: 'professor1@gmail.com' } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("RecommendationRequest Updated - id: 17 requesterEmail: student1@gmail.com professorEmail:professor1@gmail.com explanation: professorEmail:please");
            expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequest" });
        });

       
    });
});
