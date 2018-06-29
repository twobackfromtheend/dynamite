import BaseBot, {MoveType, moveWinners} from "./BaseBot";
import SimplePredictor from "./SimplePredictor";


class SimplePredictorBot extends BaseBot {


    getFirstMove(gameState): MoveType {
        return 'R'
    }

    getMove(gameState): MoveType {
        const simplePrediction = new SimplePredictor(gameState);
        const predictedMove = Object.keys(simplePrediction).reduce((a, b) => simplePrediction[a] > simplePrediction[b] ? a : b);
        // console.log('Predicted Move: ' + predictedMove);

        return moveWinners[predictedMove][0]
    }
}

module.exports = new SimplePredictorBot();
