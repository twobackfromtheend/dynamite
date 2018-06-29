import BaseBot, {MoveType, RoundInfo} from "./BaseBot";
import {MoveCount} from "./SimplePredictor";

export type MoveCount = { R: number, P: number, S: number, W: number, D: number }
type PlayStyle = { [roundPoints: number]: MoveCount }


function getEmptyMoveCount (): MoveCount {
    return {R: 0, P: 0, S: 0, W: 0, D: 0}
}


class MaybeSlightlyOptimalBot extends BaseBot {
    currentRoundPoints: number = 1;
    lastRoundPoints: number = 1;
    opponentPlayStyle: PlayStyle;

    setUpBot() {
        this.availableMoves = ['R', 'P', 'S', 'D'];
        this.opponentPlayStyle = {0: getEmptyMoveCount()};
    }

    getFirstMove(gameState): MoveType {
        const startingMoves: MoveType[] = ['R', 'P', 'S'];
        return startingMoves[Math.floor(Math.random() * startingMoves.length)];
    }

    getMove(gameState): MoveType {
        const lastRound: RoundInfo = gameState.rounds.slice(-1)[0];
        this.updateCurrentRoundPoints(lastRound);
        this.updateOpponentPlayStyle(lastRound);

        if (this.currentRoundPoints == 1) {
            return this.getRandomMove(this.availableMoves)
        } else {
            return this.getImportantRoundMove()
        }
    }

    updateOpponentPlayStyle(lastRound) {
        if (!this.opponentPlayStyle.hasOwnProperty(this.lastRoundPoints.toString())) {
            this.opponentPlayStyle[this.lastRoundPoints] = getEmptyMoveCount();
        }

        this.opponentPlayStyle
    }

    updateCurrentRoundPoints(lastRound: RoundInfo) {
        this.lastRoundPoints = this.currentRoundPoints;

        if (lastRound.p1 === lastRound.p2) {
            this.currentRoundPoints++
        } else {
            this.currentRoundPoints = 1
        }
    }


    getImportantRoundMove(): MoveType {
        if (this.availableMoves.indexOf('D') > -1) {
            return 'D'
        } else {
            return this.getRandomMove(this.availableMoves)
        }
    }
}

module.exports = new MaybeSlightlyOptimalBot();
