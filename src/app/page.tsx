"use client";
import FlattenedCube from "./components/flattenedCube";

export default function Home() {
  return (
    <main className="flex">
      <div className="mx-auto">
        <h1 className="text-xl mt-10">Flattened Rubiks Cube</h1>
        <div className="mt-5">
          <FlattenedCube />
        </div>
      </div>
    </main>
  );
}
