export interface AuthResponse {
  success: boolean; 
  message: string; 
  token?: string;   
  user?: {          
    id: string;
    username: string;
    email: string;
  };
}