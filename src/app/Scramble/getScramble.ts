import * as Scrambler from "sr-scrambler";
export default function getScramble(): string {
    const cubeScramble = Scrambler.cube(3, 20); // 3x3, 20 moves
    return cubeScramble.toString(); // cubeScramble is a String(), so make it string
}
