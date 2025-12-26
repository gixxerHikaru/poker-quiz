import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "../../app/routes/home";
import { createRoutesStub } from "react-router";

test("renders the home page", () => {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: Home,
    },
  ]);
  render(<Stub initialEntries={["/"]} />);

  expect(screen.getByText("Poker Quiz"));
});
