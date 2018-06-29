import BaseBot, {MoveType, RoundInfo} from "./BaseBot";


class MaybeSlightlyOptimalBot extends BaseBot {
    currentRoundPoints: number = 1;

    setUpBot () {
        this.availableMoves = ['R', 'P', 'S', 'D']
    }

    getFirstMove(gameState): MoveType {
        const startingMoves: MoveType[] = ['R', 'P', 'S'];
        return startingMoves[Math.floor(Math.random() * startingMoves.length)];
    }

    getMove(gameState): MoveType {
        const lastRound: RoundInfo = gameState.rounds.slice(-1)[0];
        this.updateCurrentRoundPoints(lastRound);

        if (this.currentRoundPoints == 1) {
            return this.getRandomMove(this.availableMoves)
        } else {
            return this.getImportantRoundMove()
        }
    }

    updateCurrentRoundPoints (lastRound: RoundInfo) {
        if (lastRound.p1 === lastRound.p2) {
            this.currentRoundPoints++
        } else {
            this.currentRoundPoints = 1
        }
    }


    getImportantRoundMove (): MoveType {
        if (this.availableMoves.indexOf('D') > -1) {
            return 'D'
        } else {
            return this.getRandomMove(this.availableMoves)
        }
    }
}

module.exports = new MaybeSlightlyOptimalBot();
