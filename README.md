# Connect4
Connect 4 with minimax AI using alpha beta pruning

To play, you must click one of the button options (e.g. play vs. AI or play vs. human). The board is disabled until you choose an option.

The minimax algorithm has slightly been modified so that if one side is guaranteed to lose, it tries to survive as long as possible (regular minimax would just have the losing side play random moves because all moves evaluate to a loss evantually) Futhermore, it also incentivizes the winning player to win faster, when with the normal minimax, it would play random moves that don't lose its advantage, but don't necessarily win.

Futhermore, it also incentivizes the winning player to win faster, when with the normal minimax, it would play random moves that don't lose its advantage, but don't necessarily win.

Since connect 4 is a pretty complex game, alpha beta pruning is used to reduce the time complexity. Nevertheless, a search depth over 10 would crash my browser, so I wouldn't suggest it.
