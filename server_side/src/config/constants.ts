import { Request } from "express"
export enum ROLE {
 admin='admin',
 user='user'
}

export interface CustomRequest extends Request {
    payload?:{
        statusCode: number,
        error: boolean ,
        message: string,
        userId:string | null ,
        role:string | null
    }
  }

  export function generateOTP(){
    const length = 6;
    let otp = ""

    for(let i = 0; i< length; i++){
        otp += Math.floor(Math.random() * 10)
    }
    return otp;
  }
