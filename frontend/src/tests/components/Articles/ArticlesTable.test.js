import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { articlesFixtures } from "fixtures/articlesFixtures";
import ArticlesTable from "main/components/Articles/ArticlesTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content for ordinary user", () => {

    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable dates={articlesFixtures.threeArticles} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id", "title", "url", "explanation", "email", "dateAdded"];
    const expectedFields = ["id", "title", "url", "explanation", "email", "dateAdded"];
    const testId = "ArticlesTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Cristino's Bakery");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("https://www.cristinosbakery.com/");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("burritos and tacos");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("crist@gmail.com")
    expect(screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`)).toHaveTextContent("2024-05-03T00:12:53.905Z");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("Mcdonalds");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-url`)).toHaveTextContent("mcD.com/");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-explanation`)).toHaveTextContent("Burgers");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-email`)).toHaveTextContent("mcD@gmail.com");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-dateAdded`)).toHaveTextContent("2024-05-03T00:12:53.905Z");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");

    const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).not.toBeInTheDocument();

  });

  test("Has the expected colum headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable dates={articlesFixtures.threeArticles} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["title", "url", "explanation", "email", "dateAdded"];
    const expectedFields = ["title", "url", "explanation", "email", "dateAdded"];
    const testId = "ArticlesTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("Cristino's Bakery");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("https://www.cristinosbakery.com/");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("burritos and tacos");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("crist@gmail.com")
    expect(screen.getByTestId(`${testId}-cell-row-0-col-dateAdded`)).toHaveTextContent("2024-05-03T00:12:53.905Z");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("Mcdonalds");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-url`)).toHaveTextContent("mcD.com/");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-explanation`)).toHaveTextContent("Burgers");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-email`)).toHaveTextContent("mcD@gmail.com");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-dateAdded`)).toHaveTextContent("2024-05-03T00:12:53.905Z");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Edit button navigates to the edit page for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable dates={articlesFixtures.threeArticles} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(screen.getByTestId(`ArticlesTable-cell-row-0-col-id`)).toHaveTextContent("2"); });

    const editButton = screen.getByTestId(`ArticlesTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    
    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/articles/edit/2'));

  });

  // test("Delete button calls the delete mutation for admin user", async () => {
    
  //       const currentUser = currentUserFixtures.adminUser;
    
  //       render(
  //       <QueryClientProvider client={queryClient}>
  //           <MemoryRouter>
  //           <ArticlesTable dates={articlesFixtures.threeArticles} currentUser={currentUser} />
  //           </MemoryRouter>
  //       </QueryClientProvider>
    
  //       );
    
  //       await waitFor(() => { expect(screen.getByTestId(`ArticlesTable-cell-row-0-col-id`)).toHaveTextContent("2"); });
    
  //       const deleteButton = screen.getByTestId(`ArticlesTable-cell-row-0-col-Delete-button`);
  //       expect(deleteButton).toBeInTheDocument();
        
  //       fireEvent.click(deleteButton);
    
  //       await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/api/delete/2'));
    
  //   });

});

