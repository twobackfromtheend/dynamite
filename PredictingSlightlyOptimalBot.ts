type MoveType = 'R' | 'P' | 'S' | 'D' | 'W'
type RoundInfo = { p1: MoveType, p2: MoveType }


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

const moveWinners: { [s: MoveType]: MoveType[] } = {
    'R': ['P', 'D'],
    'P': ['S', 'D'],
    'S': ['R', 'D'],
    'D': ['W'],
    'W': ['R', 'P', 'S'],
};

class MoveCount {
    R: number = 0;
    P: number = 0;
    S: number = 0;
    W: number = 0;
    D: number = 0;
}

class PlayStyle {
    moveCounts: {[roundPoints: number]: MoveCount} = {};
    playedDynamite: number = 0;

    constructor() {
        this.moveCounts[0] = new MoveCount();
    }

    updatePlayStyle(move: MoveType, roundPoints: number) {
        if (!this.moveCounts.hasOwnProperty(roundPoints.toString())) {
            this.moveCounts[roundPoints] = new MoveCount();
        }
        this.moveCounts[roundPoints][move]++;
        if (move == 'D') {
            this.playedDynamite++;
        }
        if (this.playedDynamite >= 100) {
            Object.keys(this.moveCounts).forEach(move => {
                this.moveCounts[move]['D'] = 0;
            })
        }
    }

    isRandom(roundPoints): boolean {
        if (!this.moveCounts.hasOwnProperty(roundPoints)) {
            return true
        }
        const moveCount = this.moveCounts[roundPoints];
        const nonZeroMoves: MoveType[] = Object.keys(moveCount).filter(key => moveCount[key] != 0);
        const totalMoves: number = Object.values(moveCount).reduce(function (acc, val) {
            return acc + val;
        }, 0);

        const expectationValue = totalMoves / nonZeroMoves.length;

        let chiSquared = 0;
        nonZeroMoves.forEach(move => {
            chiSquared = chiSquared + Math.pow(moveCount[move] - expectationValue, 2) / expectationValue
        });
        return chiSquared < nonZeroMoves.length
    }

    getOptimalResponse(roundPoints: number, availableMoves: MoveType[]): MoveType {
        // console.log('getOptimalResponse for roundPoints: ' + roundPoints.toString());
        const moveCount = this.moveCounts[roundPoints];
        const nonZeroMoves: MoveType[] = Object.keys(moveCount).filter(key => moveCount[key] != 0);
        const totalMoves: number = Object.values(moveCount).reduce(function (acc, val) {
            return acc + val;
        }, 0);

        let winningChances: { [move: MoveType]: number } = {};
        availableMoves.forEach(move => {
            let winningChance = 0;

            nonZeroMoves.forEach(opponentMove => {
                if (moveWinners[opponentMove].indexOf(move) > -1) {
                    winningChance += moveCount[opponentMove] / totalMoves
                }
            });
            winningChances[move] = winningChance;
        });
        const optimalMove = Object.keys(winningChances).reduce((a, b) => winningChances[a] > winningChances[b] ? a : b);
        // console.log('Calculated winning chances for moves: ');
        // console.log(JSON.stringify(winningChances));
        // console.log(JSON.stringify(moveCount));
        // console.log(optimalMove);
        return optimalMove
    }
}


class MaybeSlightlyOptimalBot extends BaseBot {
    currentRoundPoints: number = 1;
    lastRoundPoints: number = 1;
    opponentPlayStyle: PlayStyle;
    turnCount: number = 0;

    setUpBot() {
        this.availableMoves = ['R', 'P', 'S', 'D', 'W'];
        this.opponentPlayStyle = new PlayStyle();
    }

    getFirstMove(gameState): MoveType {
        const startingMoves: MoveType[] = ['R', 'P', 'S'];
        return startingMoves[Math.floor(Math.random() * startingMoves.length)];
    }

    getMove(gameState): MoveType {
        this.turnCount++;
        const lastRound: RoundInfo = gameState.rounds.slice(-1)[0];
        this.updateCurrentRoundPoints(lastRound);
        this.updateOpponentPlayStyle(lastRound);

        if (this.currentRoundPoints == 1) {
            return this.getRandomMove(['R', 'P', 'S'])
        } else {
            return this.getImportantRoundMove()
        }
    }

    updateOpponentPlayStyle(lastRound) {
        this.opponentPlayStyle.updatePlayStyle(lastRound.p2, this.lastRoundPoints);
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
        // console.log('IMPTTT')
        if (this.opponentPlayStyle.isRandom(this.currentRoundPoints)) {
            if (this.turnCount < 200) {
                return this.getRandomMove(['R', 'P', 'S']);
            } else {
                return this.getRandomRPSD()
            }
        } else {
            // console.log('NOT RANDOMMMM')
            return this.opponentPlayStyle.getOptimalResponse(this.currentRoundPoints, this.availableMoves)
        }
    }

    getRandomRPSD(): MoveType {
        if (this.availableMoves.indexOf('D') > -1) {
            return this.getRandomMove(['R', 'P', 'S', 'D'])
        } else {
            return this.getRandomMove(['R', 'P', 'S'])
        }
    }
}

module.exports = new MaybeSlightlyOptimalBot();
