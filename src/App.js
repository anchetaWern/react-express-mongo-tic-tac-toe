import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import Box from "./components/Box";
import "./App.css";

const BASE_URL = "http://localhost:5000";

const total_turns = 9;
const initial_box_data = new Array(total_turns).fill("", 0, 9);
const combinations = [
  [0, 3, 6],
  [1, 4, 7],
  [0, 1, 2],
  [3, 4, 5],
  [2, 5, 8],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const isInArray = (boxes, piece, el, index, array) => {
  return boxes[el] && boxes[el] == piece;
};

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [player_one, setPlayerOne] = useState("");
  const [player_two, setPlayerTwo] = useState("");
  const [current_piece, setCurrentPiece] = useState("X"); // X always goes first
  const [boxes, setBoxes] = useState(initial_box_data);
  const [turn_count, setTurnCount] = useState(0);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [highscores, setHighscores] = useState([]);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);

      // get highscores from the database
      axios.get(`${BASE_URL}/scores`).then(res => {
        if (res.data) {
          const sorted_scores = res.data.sort((a, b) => {
            return b.score - a.score;
          });
          setHighscores(sorted_scores);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      if (scores.X == scores.O) {
        alert("Its a draw!");
      } else {
        const name = scores.X > scores.O ? player_one : player_two;
        const score = scores.X > scores.O ? scores.X : scores.O;
        alert(`Game over! ${name} won with the score of ${score}`);

        // record the winner's score in the database
        axios.post(`${BASE_URL}/scores/create`, {
          name,
          score
        });
      }

      window.location.reload();
    }
  }, [scores]);

  useEffect(() => {
    if (isInitialized) {
      if (turn_count == total_turns) {
        // determine who won
        let score_X = 0;
        let score_O = 0;

        combinations.forEach(row => {
          if (row.every(isInArray.bind(null, boxes, "X"))) {
            score_X += 1;
          }

          if (row.every(isInArray.bind(null, boxes, "O"))) {
            score_O += 1;
          }
        });

        setScores({ X: score_X, O: score_O });
      }
    }
  }, [turn_count]);

  return (
    <div className="Container">
      <h1>Tic-tac-toe</h1>
      <input
        type="text"
        name="player_one"
        value={player_one}
        onChange={e => setPlayerOne(e.target.value)}
        placeholder="player one (X)"
      />
      <input
        type="text"
        name="player_two"
        value={player_two}
        onChange={e => setPlayerTwo(e.target.value)}
        placeholder="player two (O)"
      />

      {(!player_one || !player_two) && (
        <div className="Message">
          Enter player names to start playing the game..
        </div>
      )}

      {player_one && player_two && (
        <div className="BoxContainer">
          {boxes.map((item, index) => {
            return (
              <Box
                key={index}
                text={item}
                onClick={() => {
                  if (item == "") {
                    setBoxes(prevState => {
                      let newState = [...prevState];
                      newState[index] = current_piece;
                      return newState;
                    });

                    setCurrentPiece(prevState => {
                      return prevState == "X" ? "O" : "X";
                    });

                    setTurnCount(turn_count + 1);
                  } else {
                    alert("Dont me!");
                  }
                }}
              />
            );
          })}
        </div>
      )}

      {highscores.length === 0 && (
        <div className="Message">No highscores yet..</div>
      )}

      {highscores.length > 0 && (
        <div className="Highscores">
          <h4>Highscores</h4>
          {highscores.map(item => {
            return (
              <li key={item._id}>
                {item.name} - {item.score}
              </li>
            );
          })}
        </div>
      )}
    </div>
  );
}
//

export default App;
