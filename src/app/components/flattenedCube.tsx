import React from "react";
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

// Temp solution for getting proper grid layout
const CUBE_LAYOUT: (FaceKey | " ")[][] = [
  [" ", "U", " ", " ", " "],
  ["L", "F", "R", "B"],
  [" ", "D", " ", " ", " "],
];

const FlattenedCube: React.FC = () => {
  return (
    <div
      className="inline-block ml-8 mt-8 mb-8 p-8 bg-black"
      style={{ marginRight: "-1rem" }}
    >
      {CUBE_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((faceKey, colIndex) => (
            <div key={colIndex} className="m-2">
              {faceKey !== " " ? (
                <CubeFace faceKey={faceKey} />
              ) : (
                <div className="w-48 h-48" />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FlattenedCube;
