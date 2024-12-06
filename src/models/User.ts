// Basic User Interface assuming you need minimal user info
export interface User {
    id: number;  // typically, the user's unique ID
    username: string;  // inherited from AbstractUser
    first_name?: string;  // optional due to blank=True
    last_name?: string;   // optional due to blank=True
    email: string;  // unique email
    password: string;  // stored password (hashed if appropriate)
}