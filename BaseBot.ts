export type MoveType = 'R' | 'P' | 'S' | 'D' | 'W'
export type RoundInfo = { p1: MoveType, p2: MoveType }


export const moveWinners: { [s: MoveType]: MoveType[] } = {
    'R': ['P', 'D'],
    'P': ['S', 'D'],
    'S': ['R', 'D'],
    'D': ['W'],
    'W': ['R', 'P', 'S'],
};


export default class BaseBot {
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

