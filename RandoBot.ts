import BaseBot, {MoveType} from "./BaseBot";

class RandoBot extends BaseBot {

    getMove(gameState): MoveType {
        const randomMove = this.getRandomMove(this.availableMoves);
        return randomMove
    }
}

module.exports = new RandoBot();
