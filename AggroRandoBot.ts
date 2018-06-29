import BaseBot, {MoveType} from "./BaseBot";

class AggroRandoBot extends BaseBot {

    setUpBot () {
        this.availableMoves = ['R', 'P', 'S', 'D']
    }

    getMove (gameState): MoveType {
        const randomMove = this.getRandomMove(this.availableMoves);
        return randomMove
    }
}

module.exports = new AggroRandoBot();
