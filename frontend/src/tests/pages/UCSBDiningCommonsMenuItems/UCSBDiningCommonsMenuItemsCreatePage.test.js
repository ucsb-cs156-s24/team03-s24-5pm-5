import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemsCreatePage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsCreatePage";
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

describe("UCSBDiningCommonsMenuItemsCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders without crashing", () => {
      const queryClient = new QueryClient();
      render(
          <QueryClientProvider client={queryClient}>
              <MemoryRouter>
                  <UCSBDiningCommonsMenuItemsCreatePage />
              </MemoryRouter>
          </QueryClientProvider>
      );
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

      const queryClient = new QueryClient();
      const ucsbDiningCommonsMenuItems = {
          id: 5,
          diningCommonsCode: "ortega",
          name: "Caesar Salad",
          station: "Entrees"
      };

      axiosMock.onPost("/api/ucsbdiningcommonsmenuitems/post").reply( 202, ucsbDiningCommonsMenuItems );

      render(
          <QueryClientProvider client={queryClient}>
              <MemoryRouter>
                  <UCSBDiningCommonsMenuItemsCreatePage />
              </MemoryRouter>
          </QueryClientProvider>
      );

      await waitFor(() => {
          expect(screen.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode")).toBeInTheDocument();
      });

      const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");
      const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-name");
      const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-station");
      const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

      fireEvent.change(diningCommonsCodeField, { target: { value: 'ortega' } });
      fireEvent.change(nameField, { target: { value: 'Caesar Salad' } });
      fireEvent.change(stationField, { target: { value: 'Entrees' } });

      expect(submitButton).toBeInTheDocument();

      fireEvent.click(submitButton);

      await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

      expect(axiosMock.history.post[0].params).toEqual(
          {
          "station": "Entrees",
          "name": "Caesar Salad",
          "diningCommonsCode": "ortega"
      });

      expect(mockToast).toBeCalledWith("New ucsbDiningCommonsMenuItems Created - id: 5 name: Caesar Salad");
      expect(mockNavigate).toBeCalledWith({ "to": "/ucsbdiningcommonsmenuitems" });
  });


});
