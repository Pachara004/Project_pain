export interface GetImg {
    imageID:  number;
    imageURL: string;
    uid : number;
    name : string;
    score:  number;
    isWinner: boolean;
    isLoser: boolean;
}
export interface GetRankToDay {
    imageID:            number;
    imageURL:           string;
    name:             string;
    score:            number;
    uid:              number;
    RankingYesterDay : number;
    RankingToDay :     number;
    RankDifferent : number;
    ownerName: string;
}
export interface VoteImg {
    voteDate: string;
    totalScore: string;
    imageID: number;
    name : string;
    imageURL : string;
}
