"use client";
import { useState } from "react";
import { Result } from "../Types/solve";

import CompetitionStyles from "./Competitions.module.css";
import Round from "./Round";
import ShowAndHide from "../components/Competitions/showAndHide";

export default function Group({
  group,
  groupNumber,
}: {
  group: Result[][];
  groupNumber: number;
}) {
  const [areGroupResultsShown, setGroupResultsVisibility] = useState(true);

  // Initialize an array of visibility states, one for each round
  const [roundVisibilities, setRoundVisibilities] = useState<boolean[]>(
    group.map(() => false), // Default to false (hidden) for each round
  );

  function toggleGroupResultsVisibility() {
    setGroupResultsVisibility(!areGroupResultsShown);
  }

  function toggleRoundVisibility(index: number) {
    setRoundVisibilities((prevVisibilities) => {
      const newVisibilities = [...prevVisibilities];
      newVisibilities[index] = !newVisibilities[index];
      return newVisibilities;
    });
  }

  const groupIndex = groupNumber - 1;

  return (
    <div className={CompetitionStyles["group"]} id={`group-${groupIndex}`}>
      <div className={CompetitionStyles["group-title-container"]}>
        <h4 className={CompetitionStyles["group-title"]}>
          Grupa {groupNumber}
        </h4>
        <ShowAndHide
          show={areGroupResultsShown}
          toggleVisibility={toggleGroupResultsVisibility}
        />
      </div>
      <div
        className={`${CompetitionStyles["group-results"]} ${
          areGroupResultsShown ? "" : CompetitionStyles["hidden"]
        }`}
      >
        {group.map((round, index) => {
          return (
            <Round
              round={round}
              show={roundVisibilities[index]}
              toggleRoundVisibility={() => toggleRoundVisibility(index)}
              key={index}
              roundIndex={index}
            />
          );
        })}
      </div>
    </div>
  );
}
