# Rubiks Cube State Management

Live at: https://volpestyle.github.io/rubiks-cube/

A [Next.js](https://nextjs.org/) Typescript & Tailwind CSS app to manage the state of a Rubik's cube in a 2D representation.

## Overview

This is a dynamic representation of a flattened Rubik's cube, where each square/cell is labeled with either U (up), L (left), F (front), R (right), B (back), or D (Down), as well as the coordinates relative to the face it's on. These coordinates do not change as the squares move around the cube, since this is helpful during debugging to keep track of how each square is being rotated.

## Testing

```bash
npm run test
```

I used Jest for testing. Test coverage includes checking that for every face rotation the affected cells of the cube have moved to the correct location. There is also a test for an inverted rotation of the U face.
The tests are found under `components/__tests__`.

## Running development server

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
