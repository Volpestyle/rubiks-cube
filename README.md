# Rubiks Cube State Management

[Live here](https://volpestyle.github.io/rubiks-cube/)

A React Typescript & TailwindCSS app to manage the state of a Rubik's cube in a 2D representation.

## Overview

This is a dynamic representation of a flattened Rubik's cube where each square/cell is labeled with either U (up), L (left), F (front), R (right), B (back), or D (Down) as well as the coordinates relative to the face it's on. These coordinates do not change as the squares move around the cube since this is helpful during debugging to keep track of how each square is being rotated.

#### Cube State

Initial cube state is created using loops and a helper function, the output looks like this:

```
const initialCubeState: CubeState = {
  U: [
    [{ color: "U", originalCoord: "0,0" }, { color: "U", originalCoord: "0,1" }, { color: "U", originalCoord: "0,2" }],
    [{ color: "U", originalCoord: "1,0" }, { color: "U", originalCoord: "1,1" }, { color: "U", originalCoord: "1,2" }],
    [{ color: "U", originalCoord: "2,0" }, { color: "U", originalCoord: "2,1" }, { color: "U", originalCoord: "2,2" }],
  ],
  // Repeat for other faces (L, F, R, B, D)
};
```

Each object in the array represents a square and each key a face of the cube.

#### Rotation Logic

The majority of rotation logic is handled in one `if elseif` statement (if face is 'U', handle accordingly) since each face rotation requires unique transformations to the cubeState data structure. This logic could be refactored to be less redudant and more modular, similar to how parts of the tests are structured.

## Testing

```bash
npm run test
```

I used Jest for testing. There is test coverage for a single rotation of all faces, and for an inverted rotation.
The tests are found under `components/__tests__`.

#### Manual testing

Can be proofed using https://rubikscu.be/#simulator

## Running development server

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build static files and deploy to Github pages

```bash
npm run build && npm run deploy
```
