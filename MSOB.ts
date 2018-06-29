
type MoveType = 'R' | 'P' | 'S' | 'D' | 'W'
type RoundInfo = { p1: MoveType, p2: MoveType }


const moveWinners: { [s: MoveType]: MoveType[] } = {
    'R': ['P', 'D'],
    'P': ['S', 'D'],
    'S': ['R', 'D'],
    'D': ['W'],
    'W': ['R', 'P', 'S'],
};


class BaseBot {
    availableMoves: MoveType[] = ['R', 'P', 'S', 'D', 'W'];
    dynamitesPlayed: { p1: number, p2: number } = {p1: 0, p2: 0};

    setUpBot() {
        // runs on first round
        console.log('(INFO) setUpBot method that runs on first round is unimplemented (optional).')
    }

    getFirstMove(gameState): MoveType {
        console.log('(INFO) getFirstMove method that runs on first round is unimplemented (optional).');
        return this.getMove(gameState)
    }

    getMove(gameState): MoveType {
        throw "getMove has to be implemented in bot class."
    }

    updateDynamitesPlayed(lastRound: RoundInfo): void {
        if (lastRound.p1 == 'D') {
            this.dynamitesPlayed.p1++
        }
        if (lastRound.p2 == 'D') {
            this.dynamitesPlayed.p2++
        }

    }

    updateAvailableMoves(): void {
        if (this.dynamitesPlayed.p1 == 100) {
            this.availableMoves = this.availableMoves.filter(move => move !== 'D')
        }
    }

    makeMove(gameState): MoveType {
        const lastRound: RoundInfo = gameState.rounds.slice(-1)[0];

        if (lastRound === undefined) {
            this.setUpBot();
            return this.getFirstMove(gameState);
        } else {
            this.updateDynamitesPlayed(lastRound);
            this.updateAvailableMoves();
            const newMove: MoveType = this.getMove(gameState);
            // console.log(gameState.rounds.slice(-1)[0]);
            // console.log(newMove);
            return newMove
        }
    }

    getRandomMove(moves: MoveType[]): MoveType {
        return moves[Math.floor(Math.random() * moves.length)];
    }

}


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
