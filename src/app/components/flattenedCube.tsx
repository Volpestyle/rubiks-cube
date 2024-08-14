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
};

export type FaceKey = keyof typeof CUBE_COLORS;

export type CubeCell = {
  color: FaceKey;
  originalCoord: string;
};

export type CubeState = {
  [key in FaceKey]: CubeCell[][];
};

// Helper function to generate a face
const generateFace = (faceKey: FaceKey): CubeCell[][] => {
  const face: CubeCell[][] = [];
  for (let i = 0; i < CUBE_SIZE; i++) {
    const row: CubeCell[] = [];
    for (let j = 0; j < CUBE_SIZE; j++) {
      row.push({
        color: faceKey,
        originalCoord: `${i},${j}`,
      });
    }
    face.push(row);
  }
  return face;
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
      setCubeState((prevState) => {
        const newState = structuredClone(prevState) as CubeState;
        const oldFace = prevState[face];
        let newFace;

        // Handle face rotation
        if (!isInverted) {
          newFace = oldFace[0].map((_, i) =>
            oldFace.map((row) => row[i]).reverse()
          );
        } else {
          newFace = oldFace[0].map((_, i) =>
            oldFace.map((row) => row[CUBE_SIZE - 1 - i])
          );
        }

        newState[face] = newFace;

        // Handle inverse edge rotations
        const rotateEdge = (faceRotation: () => void) => {
          if (!isInverted) {
            faceRotation();
          } else {
            // Apply the rotation three times for an inverse rotation
            faceRotation();
            faceRotation();
            faceRotation();
          }
        };

        // Handle edge rotations
        // See rotationTests in flattenedCube.test.tsx for edge rotation details
        if (face === "U") {
          rotateEdge(() => {
            // Saving the top edges of affected faces as temp var for readability
            const tempF = newState.F[0].map((cell) => ({ ...cell }));
            const tempR = newState.R[0].map((cell) => ({ ...cell }));
            const tempB = newState.B[0].map((cell) => ({ ...cell }));
            const tempL = newState.L[0].map((cell) => ({ ...cell }));

            // Rotate top edges (top row) of affected faces
            // Front becomes Right
            // Left becomes Front
            // Back becomes Left
            // Right becomes Back
            newState.F[0] = tempR;
            newState.L[0] = tempF;
            newState.B[0] = tempL;
            newState.R[0] = tempB;
          });
        } else if (face === "D") {
          rotateEdge(() => {
            // Bottom edge of affected faces
            const tempF = newState.F[2].map((cell) => ({ ...cell }));
            const tempR = newState.R[2].map((cell) => ({ ...cell }));
            const tempB = newState.B[2].map((cell) => ({ ...cell }));
            const tempL = newState.L[2].map((cell) => ({ ...cell }));

            // Rotate bottom edges
            newState.R[2] = tempF;
            newState.F[2] = tempL;
            newState.L[2] = tempB;
            newState.B[2] = tempR;
          });
        } else if (face === "L") {
          rotateEdge(() => {
            // Left edges (left columns)
            const tempU = newState.U.map((row) => ({ ...row[0] }));
            const tempF = newState.F.map((row) => ({ ...row[0] }));
            const tempD = newState.D.map((row) => ({ ...row[0] }));
            // Right edge of bottom face
            const tempB = newState.B.map((row) => row[CUBE_SIZE - 1]);

            // Rotate edges
            for (let i = 0; i < CUBE_SIZE; i++) {
              newState.F[i][0] = tempU[i];
              newState.D[i][0] = tempF[i];
              // Reverse order of copy to account for orientation of new edge
              newState.B[CUBE_SIZE - 1 - i][CUBE_SIZE - 1] = tempD[i];
              newState.U[i][0] = tempB[CUBE_SIZE - 1 - i];
            }
          });
        } else if (face === "R") {
          rotateEdge(() => {
            // Right edge of affected faces
            const tempU = newState.U.map((row) => ({ ...row[CUBE_SIZE - 1] }));
            const tempD = newState.D.map((row) => ({ ...row[CUBE_SIZE - 1] }));
            const tempF = newState.F.map((row) => ({ ...row[CUBE_SIZE - 1] }));
            // Left edge of Back face
            const tempB = newState.B.map((row) => ({ ...row[0] }));

            // Rotate edges
            for (let i = 0; i < CUBE_SIZE; i++) {
              newState.F[CUBE_SIZE - 1 - i][CUBE_SIZE - 1] =
                tempD[CUBE_SIZE - 1 - i];
              newState.D[CUBE_SIZE - 1 - i][CUBE_SIZE - 1] = tempB[i];
              newState.B[CUBE_SIZE - 1 - i][0] = tempU[i];
              newState.U[i][CUBE_SIZE - 1] = tempF[i];
            }
          });
        } else if (face === "F") {
          rotateEdge(() => {
            const tempU = newState.U[CUBE_SIZE - 1].map((cell) => ({
              ...cell,
            }));
            const tempR = newState.R.map((row) => ({ ...row[0] }));
            const tempD = newState.D[0].map((cell) => ({ ...cell }));
            const tempL = newState.L.map((row) => ({ ...row[CUBE_SIZE - 1] }));

            for (let i = 0; i < CUBE_SIZE; i++) {
              newState.R[i][0] = tempU[i];
              newState.D[0][CUBE_SIZE - 1 - i] = tempR[i];
              newState.L[i][CUBE_SIZE - 1] = tempD[i];
              newState.U[CUBE_SIZE - 1][CUBE_SIZE - i - 1] = tempL[i];
            }
          });
        } else if (face === "B") {
          rotateEdge(() => {
            const tempU = newState.U[0].map((cell) => ({ ...cell }));
            const tempL = newState.L.map((row) => ({ ...row[0] }));
            const tempD = newState.D[CUBE_SIZE - 1].map((cell) => ({
              ...cell,
            }));
            const tempR = newState.R.map((row) => ({ ...row[CUBE_SIZE - 1] }));

            for (let i = 0; i < CUBE_SIZE; i++) {
              newState.L[i][0] = tempU[CUBE_SIZE - 1 - i];
              newState.D[CUBE_SIZE - 1][i] = tempL[i];
              newState.R[CUBE_SIZE - 1 - i][CUBE_SIZE - 1] = tempD[i];
              newState.U[0][i] = tempR[i];
            }
          });
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
          className={`px-4 py-2 text-white ${
            isInverted
              ? "bg-red-600 hover:opacity-80"
              : "bg-green-600 hover:opacity-80"
          }`}
        >
          {isInverted ? "Inverted" : "Clockwise"}
        </button>
      </div>
    </div>
  );
};

export default FlattenedCube;
