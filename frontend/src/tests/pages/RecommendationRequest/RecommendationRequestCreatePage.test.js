import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RecommendationRequest tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /RecommendationRequest", async () => {

        const queryClient = new QueryClient();
        const request = {
            id: 1,
            requesterEmail: "student1@gmail.com",
            professorEmail: "professor1@gmail.com",
            explanation: "please",
            dateRequested: "2022-02-02T00:00",
            dateNeeded: "2022-02-02T00:00",
            done: true
        };

        axiosMock.onPost("/api/RecommendationRequest/post").reply(202, request);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
        });

        const requesterEmail = screen.getByLabelText("Requester Email");
        expect(requesterEmail).toBeInTheDocument();

        const professorEmail = screen.getByLabelText("Professor Email");
        expect(professorEmail).toBeInTheDocument();

        const explanation = screen.getByLabelText("Explanation");
        expect(explanation).toBeInTheDocument();

        const dateRequested = screen.getByLabelText("Date Requested");
        expect(dateRequested).toBeInTheDocument();

        const dateNeeded = screen.getByLabelText("Date Needed");
        expect(dateNeeded).toBeInTheDocument();

        const done = screen.getByLabelText("Is Done");
        expect(done).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(requesterEmail, { target: { value: 'student1@gmail.com' } })
        fireEvent.change(professorEmail, { target: { value: 'professor1@gmail.com' } })
        fireEvent.change(explanation, { target: { value: 'please' } })
        fireEvent.change(dateRequested, { target: { value: '2022-02-02T00:00' } })
        fireEvent.change(dateNeeded, { target: { value: '2022-02-02T00:00' } })
        fireEvent.change(done, { target: { value: true} })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            requesterEmail: "student1@gmail.com",
            professorEmail: "professor1@gmail.com",
            explanation: "please",
            dateRequested: "2022-02-02T00:00",
            dateNeeded: "2022-02-02T00:00",
            done: undefined
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New RecommendationRequest Created - id: 1 requestEmail: student1@gmail.com professorEmail:professor1@gmail.com explanation: professorEmail:please");
        expect(mockNavigate).toBeCalledWith({ "to": "/RecommendationRequest"});

    });
});


