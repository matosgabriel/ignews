import { render, screen } from "@testing-library/react";
import { SignInButton } from ".";
import { createMock } from "ts-jest-mock";
import { useSession } from "next-auth/react";

jest.mock("next-auth/react");

describe("SignInButton component", () => {
  it("renders correctly when user is authenticated", () => {
    const mockeSession = createMock(useSession);

    mockeSession.mockReturnValueOnce({
      data: {
        expires: "expires",
        user: { name: "John Doe", email: "johndoe@example.com" },
      },
      status: "authenticated",
    });

    render(<SignInButton />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders correctly when user is not authenticated", () => {
    const mockeSession = createMock(useSession);

    mockeSession.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    render(<SignInButton />);

    expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
  });
});
