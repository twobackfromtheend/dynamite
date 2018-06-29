import {MoveType, RoundInfo} from "./BaseBot";

export type MoveCount = { R: number, P: number, S: number, W: number, D: number }


export default class SimplePredictor {
    R: number;
    P: number;
    S: number;
    W: number;
    D: number;

    constructor(gameState, previousRoundLimit: number=10) {
        let rounds = gameState.rounds;
        if (rounds.length > previousRoundLimit) {
            rounds = gameState.rounds.splice(-previousRoundLimit)
        }
        const moveCount: MoveCount = this.generateCounts(rounds);
        this.createProbabilityDistributionPredictor(rounds.length, moveCount)
    }

    generateCounts(rounds: RoundInfo[]): MoveCount {
        let opponentCounts = {R: 0, P: 0, S: 0, W: 0, D: 0};
        rounds.forEach((round: RoundInfo) => {
            opponentCounts[round.p2]++;
        });
        return opponentCounts
    }

    createProbabilityDistributionPredictor(numberOfRounds: number, moveCount: MoveCount): void {
        this.R = moveCount.R / numberOfRounds;
        this.P = moveCount.P / numberOfRounds;
        this.S = moveCount.S / numberOfRounds;
        this.W = moveCount.W / numberOfRounds;
        this.D = moveCount.D / numberOfRounds;
    }
}
