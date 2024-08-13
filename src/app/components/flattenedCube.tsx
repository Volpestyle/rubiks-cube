import React, { useCallback, useState } from "react";
import CubeFace from "./cubeFace";

export const CUBE_SIZE = 3; // 3x3 Rubik's Cube

export const CUBE_COLORS = {
  U: "bg-yellow-300", // Up
  L: "bg-orange-400", // Left
  F: "bg-green-400", // Front
  R: "bg-red-400", // Right
  B: "bg-blue-400", // Back
  D: "bg-gray-300", // Down
} as const;

export type FaceKey = keyof typeof CUBE_COLORS;

export type CubeCell = {
  color: FaceKey;
  originalCoord: string;
};

export type CubeState = {
  [key in FaceKey]: CubeCell[][];
};

/*
Initial cube state will look like this

const initialCubeState: CubeState = {
  U: [
    [{ color: "U", originalCoord: "U0,0" }, { color: "U", originalCoord: "U0,1" }, { color: "U", originalCoord: "U0,2" }],
    [{ color: "U", originalCoord: "U1,0" }, { color: "U", originalCoord: "U1,1" }, { color: "U", originalCoord: "U1,2" }],
    [{ color: "U", originalCoord: "U2,0" }, { color: "U", originalCoord: "U2,1" }, { color: "U", originalCoord: "U2,2" }],
  ],
  // Repeat for other faces (L, F, R, B, D)
};
*/

// Helper function to generate a face
const generateFace = (faceKey: FaceKey): CubeCell[][] => {
  return Array.from({ length: CUBE_SIZE }, (_, i) =>
    Array.from({ length: CUBE_SIZE }, (_, j) => ({
      color: faceKey,
      originalCoord: `${faceKey}${i},${j}`,
    }))
  );
};

// Generate initial cube state
const initialCubeState: CubeState = (
  Object.keys(CUBE_COLORS) as FaceKey[]
).reduce((acc, face) => {
  acc[face] = generateFace(face);
  return acc;
}, {} as CubeState);

const FlattenedCube: React.FC = () => {
  const [cubeState, setCubeState] = useState<CubeState>(initialCubeState);
  const [isInverted, setIsInverted] = useState(false);

  const rotateFace = useCallback(
    (face: FaceKey) => {
      // Avoiding stale state
      setCubeState((prevState) => {
        const newState = JSON.parse(JSON.stringify(prevState)) as CubeState;
        const oldFace = prevState[face];
        let newFace;

        // Handle face rotation
        if (isInverted) {
          newFace = oldFace[0].map((_, i) =>
            oldFace.map((row) => row[CUBE_SIZE - 1 - i])
          );
        } else {
          newFace = oldFace[0].map((_, i) =>
            oldFace.map((row) => row[i]).reverse()
          );
        }

        newState[face] = newFace;

        // Handle edge rotations
        // TODO: Handle inverse edge rotations
        if (face === "U") {
          // todo
        } else if (face === "D") {
          // todo
        } else if (face === "L") {
          // todo
        } else if (face === "R") {
          // todo
        } else if (face === "F") {
          // todo
        } else if (face === "B") {
          // todo
        }
        return newState;
      });
    },
    [isInverted]
  );

  return (
    <div className="flex flex-col">
      <div className="ml-52 mb-4">
        <CubeFace faceKey={"U"} cubeState={cubeState} />
      </div>
      <div className="flex space-x-4">
        <CubeFace faceKey={"L"} cubeState={cubeState} />
        <CubeFace faceKey={"F"} cubeState={cubeState} />
        <CubeFace faceKey={"R"} cubeState={cubeState} />
        <CubeFace faceKey={"B"} cubeState={cubeState} />
      </div>
      <div className="ml-52 mt-4">
        <CubeFace faceKey={"D"} cubeState={cubeState} />
      </div>
      <div className="space-x-4 mt-8 mb-4">
        {Object.keys(CUBE_COLORS).map((face) => (
          <button
            key={face}
            onClick={() => rotateFace(face as FaceKey)}
            className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black"
          >
            Rotate {face}
          </button>
        ))}
        <button
          onClick={() => setIsInverted(!isInverted)}
          className={`px-4 py-2 border text-green-600 ${
            isInverted
              ? "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              : "border-green-600 hover:bg-green-600 hover:text-white"
          }`}
        >
          {isInverted ? "Inverted" : "Clockwise"}
        </button>
      </div>
    </div>
  );
};

export default FlattenedCube;
