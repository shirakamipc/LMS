export class AuthResponseDto {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    fullName: string | null;
    role: string;
  };
}
