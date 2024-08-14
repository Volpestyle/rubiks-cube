import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FlattenedCube, { CUBE_SIZE, FaceKey } from "../flattenedCube";
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

describe("FlattenedCube", () => {
  // Get the state of a face by iterating through all its cells and saving their textContent (coordinates/identifiers) in a new matrix
  const getState = (face: FaceKey) => {
    const cells = screen.getAllByTestId(`cell-${face}`);
    const state: string[][] = [];
    for (let i = 0; i < CUBE_SIZE; i++) {
      const row: string[] = [];
      for (let j = 0; j < CUBE_SIZE; j++) {
        const index = i * CUBE_SIZE + j;
        row.push(cells[index].textContent || "");
      }
      state.push(row);
    }
    return state;
  };

  const getAllFaces = () => ({
    U: getState("U"),
    L: getState("L"),
    F: getState("F"),
    R: getState("R"),
    B: getState("B"),
    D: getState("D"),
  });

  // Expected data based on a single rotation for each face. The 'reverse' boolean is necessary to determine when an edge is transferred between faces in a way that changes its orientation.
  const rotationTests = [
    {
      face: "F",
      affectedFaces: ["U", "R", "D", "L"],
      expectations: [
        {
          from: { face: "U", edge: "bottom" },
          to: { face: "R", edge: "left" },
        },
        {
          from: { face: "R", edge: "left" },
          to: { face: "D", edge: "top" },
          reverse: true,
        },
        {
          from: { face: "D", edge: "top" },
          to: { face: "L", edge: "right" },
        },
        {
          from: { face: "L", edge: "right" },
          to: { face: "U", edge: "bottom" },
          reverse: true,
        },
      ],
    },
    {
      face: "B",
      affectedFaces: ["U", "L", "D", "R"],
      expectations: [
        {
          from: { face: "U", edge: "top" },
          to: { face: "L", edge: "left" },
          reverse: true,
        },
        {
          from: { face: "L", edge: "left" },
          to: { face: "D", edge: "bottom" },
        },
        {
          from: { face: "D", edge: "bottom" },
          to: { face: "R", edge: "right" },
          reverse: true,
        },
        { from: { face: "R", edge: "right" }, to: { face: "U", edge: "top" } },
      ],
    },
    {
      face: "U",
      affectedFaces: ["B", "R", "F", "L"],
      expectations: [
        { from: { face: "B", edge: "top" }, to: { face: "R", edge: "top" } },
        { from: { face: "R", edge: "top" }, to: { face: "F", edge: "top" } },
        { from: { face: "F", edge: "top" }, to: { face: "L", edge: "top" } },
        { from: { face: "L", edge: "top" }, to: { face: "B", edge: "top" } },
      ],
    },
    {
      face: "D",
      affectedFaces: ["F", "R", "B", "L"],
      expectations: [
        {
          from: { face: "F", edge: "bottom" },
          to: { face: "R", edge: "bottom" },
        },
        {
          from: { face: "R", edge: "bottom" },
          to: { face: "B", edge: "bottom" },
        },
        {
          from: { face: "B", edge: "bottom" },
          to: { face: "L", edge: "bottom" },
        },
        {
          from: { face: "L", edge: "bottom" },
          to: { face: "F", edge: "bottom" },
        },
      ],
    },
    {
      face: "L",
      affectedFaces: ["U", "F", "D", "B"],
      expectations: [
        {
          from: { face: "U", edge: "left" },
          to: { face: "F", edge: "left" },
        },
        {
          from: { face: "F", edge: "left" },
          to: { face: "D", edge: "left" },
        },
        {
          from: { face: "D", edge: "left" },
          to: { face: "B", edge: "right" },
          reverse: true,
        },
        {
          from: { face: "B", edge: "right" },
          to: { face: "U", edge: "left" },
          reverse: true,
        },
      ],
    },
    {
      face: "R",
      affectedFaces: ["U", "B", "D", "F"],
      expectations: [
        {
          from: { face: "U", edge: "right" },
          to: { face: "B", edge: "left" },
          reverse: true,
        },
        {
          from: { face: "B", edge: "left" },
          to: { face: "D", edge: "right" },
          reverse: true,
        },
        {
          from: { face: "D", edge: "right" },
          to: { face: "F", edge: "right" },
        },
        {
          from: { face: "F", edge: "right" },
          to: { face: "U", edge: "right" },
        },
      ],
    },
  ];

  const getEdge = (
    face: string[][],
    edge: string,
    reverse: boolean = false
  ): string[] => {
    let result: string[];
    switch (edge) {
      case "top":
        result = face[0];
        break;
      case "bottom":
        result = face[2];
        break;
      case "left":
        result = face.map((row) => row[0]);
        break;
      case "right":
        result = face.map((row) => row[2]);
        break;
      default:
        throw new Error(`Invalid edge: ${edge}`);
    }
    return reverse ? result.reverse() : result;
  };

  rotationTests.forEach(({ face, affectedFaces, expectations }) => {
    it(`correctly rotates the ${face} face and adjacent edges`, () => {
      render(<FlattenedCube />);

      const initialState = getAllFaces();

      fireEvent.click(screen.getByText(`Rotate ${face}`));

      const rotatedState = getAllFaces();

      // Check that the rotated face has rotated clockwise
      const rotatedFace = rotatedState[face as FaceKey];
      const initialFace = initialState[face as FaceKey];
      expect(rotatedFace[0][0]).toBe(initialFace[2][0]);
      expect(rotatedFace[0][1]).toBe(initialFace[1][0]);
      expect(rotatedFace[0][2]).toBe(initialFace[0][0]);
      expect(rotatedFace[1][0]).toBe(initialFace[2][1]);
      expect(rotatedFace[1][2]).toBe(initialFace[0][1]);
      expect(rotatedFace[2][0]).toBe(initialFace[2][2]);
      expect(rotatedFace[2][1]).toBe(initialFace[1][2]);
      expect(rotatedFace[2][2]).toBe(initialFace[0][2]);

      // Check that the edges of adjacent faces have moved correctly
      expectations.forEach(({ from, to, reverse }) => {
        const fromEdge = getEdge(
          initialState[from.face as FaceKey],
          from.edge,
          reverse
        );
        const toEdge = getEdge(rotatedState[to.face as FaceKey], to.edge);
        expect(toEdge).toEqual(fromEdge);
      });
    });
  });

  it("rotates the U face counter-clockwise when inverted", () => {
    render(<FlattenedCube />);

    const initialState = getAllFaces();

    // Click the invert button
    fireEvent.click(screen.getByText("Clockwise"));

    // Now rotate the U face
    fireEvent.click(screen.getByText("Rotate U"));

    const rotatedState = getAllFaces();

    // Check that the U face has rotated counter-clockwise
    const rotatedFace = rotatedState.U;
    const initialFace = initialState.U;
    expect(rotatedFace[0][0]).toBe(initialFace[0][2]);
    expect(rotatedFace[0][1]).toBe(initialFace[1][2]);
    expect(rotatedFace[0][2]).toBe(initialFace[2][2]);
    expect(rotatedFace[1][0]).toBe(initialFace[0][1]);
    expect(rotatedFace[1][2]).toBe(initialFace[2][1]);
    expect(rotatedFace[2][0]).toBe(initialFace[0][0]);
    expect(rotatedFace[2][1]).toBe(initialFace[1][0]);
    expect(rotatedFace[2][2]).toBe(initialFace[2][0]);

    // Check that the edges of adjacent faces have moved correctly
    const expectations = [
      { from: { face: "B", edge: "top" }, to: { face: "L", edge: "top" } },
      { from: { face: "L", edge: "top" }, to: { face: "F", edge: "top" } },
      { from: { face: "F", edge: "top" }, to: { face: "R", edge: "top" } },
      { from: { face: "R", edge: "top" }, to: { face: "B", edge: "top" } },
    ];

    expectations.forEach(({ from, to }) => {
      const fromEdge = getEdge(initialState[from.face as FaceKey], from.edge);
      const toEdge = getEdge(rotatedState[to.face as FaceKey], to.edge);
      expect(toEdge).toEqual(fromEdge);
    });
  });
});
