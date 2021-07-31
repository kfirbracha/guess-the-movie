import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import { IDialogProps } from '../../interfaces/imovie';
// import './SimpleDialog.css'
import Button from '@material-ui/core/Button'

const GameOverDialog = (props:IDialogProps) => {

   return <Dialog  onClose={props.onClose} open={props.open}>
       <div className="dialog-container">
        <h2>GAME OVER</h2>
        <div className="actions-container">
            <div>Game Score : {props.currentScore}</div>
            <div>High Score : {props.highScore}</div>
            <Button onClick={()=>props.onClose(true)} variant="outlined" color="primary">New Game</Button>
        </div>
       </div>
    </Dialog>
}

export default GameOverDialog;