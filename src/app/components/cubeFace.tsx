import { CUBE_COLORS, CubeState, FaceKey } from "./flattenedCube";

interface CubeFaceProps {
  cubeState: CubeState;
  faceKey: FaceKey;
}

const CubeFace: React.FC<CubeFaceProps> = ({
  cubeState,
  faceKey,
}: CubeFaceProps) => {
  return (
    <div
      className={`w-48 h-48 grid grid-cols-3 grid-rows-3 ${CUBE_COLORS[faceKey]}`}
    >
      {cubeState[faceKey].map((row, i) =>
        row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            data-testid={`cell-${faceKey}`}
            className={`w-16 h-16 border border-black flex items-center justify-center text-sm font-semibold ${
              CUBE_COLORS[cell.color]
            }`}
          >
            {cell.color}
            {cell.originalCoord}
          </div>
        ))
      )}
    </div>
  );
};

export default CubeFace;
