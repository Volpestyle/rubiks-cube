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
      setCubeState((prevState) => {
        const newState = JSON.parse(JSON.stringify(prevState)) as CubeState;
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
        if (face === "U") {
          rotateEdge(() => {
            // Saving the affected edges (top edge of faces) for readability
            // Using spread operator (...) to avoid creating reference copy (good practice).
            const tempF = newState.F[0].map((cell) => ({ ...cell }));
            const tempR = newState.R[0].map((cell) => ({ ...cell }));
            const tempB = newState.B[0].map((cell) => ({ ...cell }));
            const tempL = newState.L[0].map((cell) => ({ ...cell }));

            // Right edge becomes the previous Front edge
            // Left becomes Front
            // Back becomes Left
            // Right becomes Back
            for (let i = 0; i < CUBE_SIZE; i++) {
              newState.F[0][i] = tempR[i];
              newState.L[0][i] = tempF[i];
              newState.B[0][i] = tempL[i];
              newState.R[0][i] = tempB[i];
            }
          });
        } else if (face === "D") {
          rotateEdge(() => {
            // Bottom edge of faces
            const tempF = newState.F[2].map((cell) => ({ ...cell }));
            const tempR = newState.R[2].map((cell) => ({ ...cell }));
            const tempB = newState.B[2].map((cell) => ({ ...cell }));
            const tempL = newState.L[2].map((cell) => ({ ...cell }));

            // Opposite of Up rotation
            for (let i = 0; i < CUBE_SIZE; i++) {
              newState.R[2][i] = tempF[i];
              newState.F[2][i] = tempL[i];
              newState.L[2][i] = tempB[i];
              newState.B[2][i] = tempR[i];
            }
          });
        } else if (face === "L") {
          rotateEdge(() => {
            // Left edge of faces
            const tempU = newState.U.map((row) => ({ ...row[0] }));
            const tempF = newState.F.map((row) => ({ ...row[0] }));
            const tempD = newState.D.map((row) => ({ ...row[0] }));
            // Right edge of bottom face
            const tempB = newState.B.map((row) => row[CUBE_SIZE - 1]);

            // Front edge becomes the previous Up edge
            // Down becomes Front
            // Back becomes Down
            // Up becomes Back
            for (let i = 0; i < CUBE_SIZE; i++) {
              newState.F[i][0] = tempU[i];
              newState.D[i][0] = tempF[i];
              newState.B[CUBE_SIZE - 1 - i][CUBE_SIZE - 1] = tempD[i];
              newState.U[i][0] = tempB[CUBE_SIZE - 1 - i];
            }
          });
        } else if (face === "R") {
          rotateEdge(() => {
            // Right edge of faces
            const tempU = newState.U.map((row) => ({ ...row[CUBE_SIZE - 1] }));
            const tempD = newState.D.map((row) => ({ ...row[CUBE_SIZE - 1] }));
            const tempF = newState.F.map((row) => ({ ...row[CUBE_SIZE - 1] }));
            // Left edge of Back face
            const tempB = newState.B.map((row) => ({ ...row[0] }));

            // Front edge becomes the previous Down edge
            // Down becomes Back
            // Back becomes Up
            // Up becomes Front
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
            // Bottom edge of Up face
            const tempU = newState.U[CUBE_SIZE - 1].map((cell) => ({
              ...cell,
            }));
            // Left edge of Right face
            const tempR = newState.R.map((row) => ({ ...row[0] }));
            // Top edge of Down face
            const tempD = newState.D[0].map((cell) => ({ ...cell }));
            // Right edge of Left face
            const tempL = newState.L.map((row) => ({ ...row[CUBE_SIZE - 1] }));

            // Right becomes Up
            // Down becomes Right
            // Left becomes Down
            // Up becomes Left
            for (let i = 0; i < CUBE_SIZE; i++) {
              newState.R[i][0] = tempU[i];
              newState.D[0][CUBE_SIZE - 1 - i] = tempR[i];
              newState.L[i][CUBE_SIZE - 1] = tempD[i];
              newState.U[CUBE_SIZE - 1][CUBE_SIZE - i - 1] = tempL[i];
            }
          });
        } else if (face === "B") {
          rotateEdge(() => {
            // Top edge of Up face
            const tempU = newState.U[0].map((cell) => ({ ...cell }));
            // Left edge of Left face
            const tempL = newState.L.map((row) => ({ ...row[0] }));
            // Bottom edge of Down face
            const tempD = newState.D[CUBE_SIZE - 1].map((cell) => ({
              ...cell,
            }));
            // Right edge of Right face
            const tempR = newState.R.map((row) => ({ ...row[CUBE_SIZE - 1] }));

            // Left becomes Up
            // Down becomes Left
            // Right becomes Down
            // Up becomes Right
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
