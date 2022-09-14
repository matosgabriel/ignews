import { screen, render } from "@testing-library/react";
import Home, { getStaticProps } from "../../pages";
import { stripe } from "../../services/stripe";

import { createMock } from "ts-jest-mock";

jest.mock("next/router");
jest.mock("next-auth/react", () => {
  return {
    useSession: () => {
      return {
        data: null,
        status: "unauthentincated",
      };
    },
  };
});
jest.mock("../../services/stripe");

describe("Home page", () => {
  it("renders correctly", () => {
    render(<Home product={{ priceId: "fake-price-id", amount: "R$10,00" }} />);

    expect(screen.getByText("R$10,00 month")).toBeInTheDocument();
  });

  it("loads inital data", async () => {
    const mockedStripePrices = createMock(stripe.prices.retrieve);

    mockedStripePrices.mockResolvedValueOnce({
      id: "fake-price-id",
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-price-id",
            amount: "$10.00",
          },
        },
      })
    );
  });
});
