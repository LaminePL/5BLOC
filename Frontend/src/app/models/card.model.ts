export interface Card{
    name: string,
    description:string,
    price:number,
    reduction:number,
    image_url:string
}


export interface CardNFT{
  id:string;
  card:Card;
}
