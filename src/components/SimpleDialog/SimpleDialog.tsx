import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import { IDialogProps } from '../../interfaces/imovie';
import './SimpleDialog.css'


const SimpleDialog = (props:IDialogProps) => {

   return <Dialog  onClose={props.onClose} open={props.open}>
       <div className="dialog-container">

     <h2>Statistics</h2>
     <div className="statistic-row">
         <p>numer of correct guesses</p>
     <p>{props.correctGuesses}</p>
     </div>
     <div className="statistic-row">
    <p>numer of wrong guesses</p>
     <p>{props.wrongGuesses}</p>
     </div>
     <div className="statistic-row">
        <p>number of hints</p>
     <p>{props.numberOfHints}</p>
     </div>
       </div>
    </Dialog>
}

export default SimpleDialog;