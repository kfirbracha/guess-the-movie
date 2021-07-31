export interface IMovie{
first_air_date: string;
id: number;
name: string;
original_language: string;
original_name: string;
overview: string;
popularity: number;
poster_path: "/qG59J1Q7rpBc1dvku4azbzcqo8h.jpg"
vote_average: number;
vote_count: number;
};

export interface IDialogProps{
    open: boolean;
  onClose: (value: string |boolean) => void;
  correctGuesses?:number;
  wrongGuesses?:number;
  numberOfHints?:number;
  currentScore?:number;
  highScore?:number;
}