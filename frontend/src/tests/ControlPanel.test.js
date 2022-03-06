import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import {getByTestId} from "@testing-library/react";
import ControlPanel from "../components/ControlPanel";

let container = null;

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it("Checks presence of the control panel", () => {
    act(() => {
        render(<ControlPanel />, container);
    });
    expect(getByTestId(container,'control-panel')).toBeInTheDocument();
});