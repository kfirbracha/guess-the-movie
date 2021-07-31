import axios, { AxiosResponse, ResponseType } from "axios";

export class ApiService{
    BASE_URL:string = 'https://api.themoviedb.org/3/tv/top_rated'; 
    async getMovie(){
        const url = new URL(this.BASE_URL);
        url.searchParams.append('api_key' , 'afbbe265e4769df5173f9181230e43a3')
      const response : AxiosResponse=  await axios.get(url.toString())
      return response.data
    }

}