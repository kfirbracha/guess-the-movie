import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper'
import { ApiService } from './services/api.service';
import { IMovie } from './interfaces/imovie';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import SimpleDialog from './components/SimpleDialog/SimpleDialog';
import './App.css';
import GameOverDialog from './components/GameOverDialog/GameOverDialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Typography from '@material-ui/core/Typography';

function App() {
  const [currentMovie,setCurrentMovie] =useState<string>('');
  const [movieIndex,setMovieIndex] =useState<number>(0);
  const [movies,setMovies] = useState<IMovie[]>([]);
  const [movieGuessInput,setMovieGuessInput] = useState<string>('')
  const [movieHint,setMovieHint] = useState<string>('')
  const [isDialogOpen,setIsDialogOpen]=useState<boolean>(false);
  const [numberOfHints,setNumberOfHints]=useState<number>(0);
  const [lives,setLives]= useState<number>(3)
  const [numberOfCorrectGuessesForSession,setNumberOfCorrectGuessesForSession]=useState<number>(0)
  const [numberOfWrongGuessesForSession,setNumberOfWrongGuessesForSession]=useState<number>(0)
  const [numberOfCorrectGuessesForGame,setNumberOfCorrectGuessesForGame]=useState<number>(0)
  const [isPendingForNewGame ,setIsPendingForNewGame]=useState<boolean>(false);
  const [isGameOverDialogOpen,setIsGameOverDialogOpen] =useState<boolean>(false) 
  const [isInputError,setIsInputError]=useState<boolean>(false);
  const [isGuessWrong,setIsGuessWrong]=useState<boolean>(false);
  const [highScore,setHighScore]=useState<number>(0);
  useEffect(()=>{
    
    if(movies.length === 0){   
      const highScoreFromLocalStorage = localStorage.getItem('highScore')  
      const currentGuessesForSession = localStorage.getItem('correntGuesses')
      const wrongGuessesForSessoin = localStorage.getItem('wrongGuesses')
      if(highScoreFromLocalStorage !== null) setHighScore(+highScoreFromLocalStorage)
      if(currentGuessesForSession !== null) setNumberOfCorrectGuessesForSession(+currentGuessesForSession)
      if(wrongGuessesForSessoin !==null) setNumberOfWrongGuessesForSession(+wrongGuessesForSessoin) 
      
      getMoviesList()
      return;
    }
    changeMoviesNames(movies);
  },[movieIndex ])

const changeMoviesNames = (moviesList:IMovie[])=>{
  console.log(moviesList[movieIndex]?.name)
  const newMovieName = moviesList[movieIndex]?.name.split(' ').map((val,index)=>{
    //GENERATE RANDOM NUMBER FROM VAL LENGTH TO SET NUMBER OF LETTERS TO CHENGE
    const randomNumber:number = Math.floor(Math.random()*val.length);
    //GENERATE RANDOM NUMBERS ARRAY 
    const numbersToReplace =  Array.from(Array(randomNumber).keys()).map((number)=>Math.floor(Math.random()* val.length/2));
    //REPLACE VAL BY INDEX FROM RANDOM NUMBERS ARR
    const valArr = val.split('').map((val:string,index:number)=>numbersToReplace.includes(index) ?' _' :val);
    return valArr.join('').toLocaleLowerCase()
  })
  
  setCurrentMovie(newMovieName.join(' '))
  }

  const getMoviesList = async()=>{
    //GET MOVIES FROM API
    const moviesList =await new ApiService().getMovie();
    //SET CURRENT STATE MOVIES BY SHUFFLE
    setMovies(shuffleArray(moviesList.results))
    //CHANGE AND SET MOVIES NAMES WITH "_"
    changeMoviesNames(moviesList.results);
    return moviesList
  }
  const onCheckTheGuessClick = () => {
    if(movieGuessInput.length === 0){
      setIsInputError(true)
      return 
    }
    // GUESS IS GOOD - CLEAN FIELDS + INCREMENT CURRECY COUNTER
    if(movies[movieIndex].name.toLowerCase() === movieGuessInput.toLowerCase()){
      setNumberOfCorrectGuessesForGame(numberOfCorrectGuessesForGame+1);
      setMovieIndex(movieIndex+1)
      setMovieGuessInput('')
      setMovieHint('')
      setNumberOfCorrectGuessesForSession(numberOfCorrectGuessesForSession+1)
      localStorage.setItem('correntGuesses',(numberOfCorrectGuessesForSession+1).toString())
      setIsGuessWrong(false)
      // CHECK IF HIGH SCORE IS LOWER THEN GAME SCORE
      if(numberOfCorrectGuessesForGame+1> highScore){
        setHighScore(numberOfCorrectGuessesForGame+1);
        localStorage.setItem('highScore',(numberOfCorrectGuessesForGame+1).toString())
      }
      return;
    }
    if(lives !== 0){
      setLives(lives-1);
      setNumberOfWrongGuessesForSession(numberOfWrongGuessesForSession+1);
      localStorage.setItem('wrongGuesses',(numberOfWrongGuessesForSession+1).toString())
      setIsGuessWrong(true)
      // LIVES IS GOING TO CHANGE TO 0 - SET GAME OVER 
      if(lives === 1){
        setIsPendingForNewGame(true)
        setIsGameOverDialogOpen(true)
        setNumberOfCorrectGuessesForGame(0);
      }
    }
  }
  // SHOW HINT AND INCREMENT COUT+NTER
  const onHintClick = ()=> {
    setMovieHint(movies[movieIndex].overview);
    setNumberOfHints(numberOfHints+1)
  };
  // CLOSE STATISTICS DIALOG
  const onCloseDialog = () => setIsDialogOpen(false)

  // SHUFFLE ARAY
  const shuffleArray = (array:IMovie[]) : IMovie[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array
  }

  // START NEW GAME
  const onNewGame = () => {
    setMovieIndex(0)
    setMovies(shuffleArray(movies))
    changeMoviesNames(movies);
    setLives(3);
    setMovieHint('')
  }

  //CLOSE GAME OVER DIALOG
  const onCloseGameOverDialog = (startNewGame:boolean = false) =>{
    console.log({startNewGame})
    setMovieHint('')
    setIsGameOverDialogOpen(false)
    if(startNewGame){
      onNewGame()
      setIsPendingForNewGame(false)
      setIsGuessWrong(false)
      setMovieGuessInput('')
      return;
    }
    setIsPendingForNewGame(true)
  }

// CHANGE INPUT VALUE
  const onChangeInputValue = (e:any) =>{
      setMovieGuessInput(e.target.value);
      setIsInputError(false)
      setIsGuessWrong(false)
  }
  return (
    <div className="App">
      <AppBar position="static" className="app-bar">
  <Toolbar className="toolbar">
    <Typography variant="h6" className="app-bar-typography">
      MOVIE GUESS
    </Typography>
  </Toolbar>
</AppBar>

        <div className="current-statistic-container">
      <div className="lives-counter">
        Lives Left : <span className="lives-span"> {lives}</span>
      </div>
      <div className="high-score-cotnainer">
        High Score : <span className="high-score-span"> {highScore}</span>
      </div>
      <div className="currentScore">
        Current Score : <span className="number-of-guesses-span"> {numberOfCorrectGuessesForGame}</span>
      </div>
        </div>
      <Paper className='movie-name-container' elevation={4}>
        <div className="current-movie-div">{currentMovie}</div>
      </Paper>
      <div className="input-element">
      <TextField disabled={isPendingForNewGame}  id="outlined-basic" label="Guess The Movie" variant="outlined"
       onChange={onChangeInputValue}
        value={movieGuessInput}
      />
      {isInputError && <div className="input-error">
          no value was provided for movies guess
      </div>
      }
      {isGuessWrong && 
      <div className="input-error">
        Wrong Answer
      </div>
      }
      </div>
      <div className="buttons-container">
        <Button disabled={isPendingForNewGame} onClick={()=>onHintClick()} variant="outlined">hint</Button>
        <Button disabled={isPendingForNewGame} onClick={()=>onCheckTheGuessClick()} variant="outlined" color="primary">Check The Guess</Button>
        <Button disabled={isPendingForNewGame} className={isPendingForNewGame ? '':"statistic-button"} onClick={()=>setIsDialogOpen(true)} variant="outlined">Statistics</Button>
      </div>
      {isPendingForNewGame && <div>
        <Button onClick={()=>onCloseGameOverDialog(true)}>New Game</Button>
        </div>}
      <div>
        {movieHint}
      </div>
      <SimpleDialog open={isDialogOpen} onClose={()=>onCloseDialog() } 
      correctGuesses={numberOfCorrectGuessesForSession} 
      wrongGuesses={numberOfWrongGuessesForSession}
      numberOfHints={numberOfHints}/>

    <GameOverDialog
    open={isGameOverDialogOpen}
    onClose={()=>onCloseGameOverDialog(true)}
    currentScore={numberOfCorrectGuessesForGame}
    highScore={highScore}
    />
    </div>
  );
}

export default App;
