import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("MenuItemReviewForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByText(/ItemId/);
        await screen.findByText(/Reviewer Email/);
        await screen.findByText(/Stars/);
        await screen.findByText(/Date Reviewed/);
        await screen.findByText(/Comments/);

    });


    test("renders correctly when passing in a MenuItemReview", async () => {

        render(
            <Router  >
                <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneMenuItemReview[0]} />
            </Router>
        );
        await screen.findByTestId(/MenuItemReviewForm-id/);
        expect(screen.getByText(/Stars/)).toBeInTheDocument();
        expect(screen.getByTestId(/MenuItemReviewForm-stars/)).toHaveValue("5");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-dateReviewed");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(dateReviewedField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Review Date must be entered in ISO date time format/);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-submit");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/itemId is required./);
        //expect(screen.getByText(/Reviewer Email is required./)).toBeInTheDocument();
        //expect(screen.getByText(/Star Rating is required./)).toBeInTheDocument();
        //expect(screen.getByText(/Review Date is required./)).toBeInTheDocument();
        //expect(screen.getByText(/Comments are required./)).toBeInTheDocument();


    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <MenuItemReviewForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-id");

        const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemIdField, { target: { value: '1' } });
        fireEvent.change(reviewerEmailField, { target: { value: 'joegaucho@gmail.com' } });
        fireEvent.change(starsField , { target: { value: '5' } });
        fireEvent.change(dateReviewedField, { target: { value: '2024-05-03T05:06:02' } });
        fireEvent.change(commentsField, { target: { value: 'very good' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Review Date must be entered in ISO date time format/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Maximum Rating is 5 stars/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Minimum Rating is 0 stars/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-cancel");
        const cancelButton = screen.getByTestId("MenuItemReviewForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


