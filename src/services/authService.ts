import jwt from 'jsonwebtoken';

type TokenData = {
  id: string;
  email: string;
  staffCadre: ["admin"] | ["salesPerson"] | ["supervisor", "salesPerson" ];
  firstName: string;
  lastName: string;
  accountType: string;
}

const authService = (token: string, staffCadreList: string[]) =>{
  let isAuthorized = false;
  if(!token){
    return {isAuthorized: false}
  }
  let decoded = jwt.decode(token) as TokenData
  if(staffCadreList.includes(decoded?.staffCadre[0])){
    isAuthorized = true
  }
  return {isAuthorized}
}

export default authService;