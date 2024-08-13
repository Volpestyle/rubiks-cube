import { CUBE_COLORS, CUBE_SIZE, FaceKey } from "./flattenedCube";

const CubeFace = ({ faceKey }: { faceKey: FaceKey }) => {
  return (
    <div className={`w-48 h-48 ${CUBE_COLORS[faceKey]}`}>
      {[...Array(CUBE_SIZE)].map((_, i) => (
        <div key={i} className="flex">
          {[...Array(CUBE_SIZE)].map((_, j) => (
            <div
              key={j}
              className="w-16 h-16 border border-black flex items-center justify-center text-sm font-semibold"
            >
              {`${faceKey}${i},${j}`}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CubeFace;
