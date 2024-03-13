export interface Users {
    userID:     number;
    username:   string;
    image:      string;
    createDate: string;
    bio:        string;
    type:       string;
    password:   string;
  }

  export interface SignupData {
    username: string;
    password: string;
    type:     string;
    image:    string;
  }
