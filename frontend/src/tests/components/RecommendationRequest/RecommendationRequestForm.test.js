import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("Recommendation Request tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Requester Email", "Professor Email", "Explanation", "Date Requested", "Date Needed", "Is Done"];
    const testId = "RecommendationRequestForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RecommendationRequestForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RecommendationRequestForm initialContents={recommendationRequestFixtures.oneRecommendationRequest[0]} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        await screen.findByTestId(`${testId}-id`)
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-id`)).toHaveValue('1')
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RecommendationRequestForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RecommendationRequestForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Requester Email/);
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    });

    test("Correct Error messsages on bad input", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RecommendationRequestForm />
                </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId("RecommendationRequestForm-requesterEmail");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        // fireEvent.change(dateRequested, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);
        
        await waitFor(()=> {
            expect(screen.getByText(/Student email is required./)).toBeInTheDocument();
        });

        await screen.findByTestId("RecommendationRequestForm-professorEmail");
        fireEvent.click(submitButton);
        
        await waitFor(()=> {
            expect(screen.getByText(/Professor email is required./)).toBeInTheDocument();
        });

        await screen.findByTestId("RecommendationRequestForm-explanation");
        fireEvent.click(submitButton);
        
        await waitFor(()=> {
            expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        });

        await screen.findByTestId("RecommendationRequestForm-dateRequested");
        fireEvent.click(submitButton);
        
        await waitFor(()=> {
            expect(screen.getByText(/Starting date is required./)).toBeInTheDocument();
        });

        await screen.findByTestId("RecommendationRequestForm-dateNeeded");
        fireEvent.click(submitButton);
        
        await waitFor(()=> {
            expect(screen.getByText(/End date is required./)).toBeInTheDocument();
        });

        await screen.findByTestId("RecommendationRequestForm-done");
        fireEvent.click(submitButton);
    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();
        render(
            <Router  >
                <RecommendationRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-dateRequested");

        const requesterEmail = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const professorEmail = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const explanation = screen.getByTestId("RecommendationRequestForm-explanation");
        const dateNeeded = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const dateRequested = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const done = screen.getByTestId("RecommendationRequestForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(requesterEmail, { target: { value: 'student@gmail.com' } });
        fireEvent.change(professorEmail, { target: { value: 'professor@gmail.com' } });
        fireEvent.change(explanation, { target: { value: 'I need it'} });
        fireEvent.change(dateNeeded, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(dateRequested, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(done, { target: { value: true } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
        expect(screen.queryByText(/dateRequested must be in ISO format/)).not.toBeInTheDocument();
    });


});

