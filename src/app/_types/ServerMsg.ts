// export class ServerMsg {
//   type: string="";
//   sender: string="";
//   receiver: string="";
//   v1:string="";
//   v2:string="";
//   v3:string="";
//   v4:string="";
//   authdata?:string="";
// };
// export class NamedServerMsg extends ServerMsg {

//   msg:string;
//   msgh:string;
//   time:string;
//   val:string;
// };

export class ServerMsg {
  msg:string="";
  username:String="";
  msgh:String="";
  email:String="";
  val:String="";
  type: String="";
  h="";
  sender: String="";
  sess:String = '';
  status:String = "fail";
  receiver: String="";
  authdata?:String="";
  time:Number;
  update_time:Number;
  utime:String;
  pdmSecurityVersion=0.1;
  checker:"";
  ctime:String;
};

export class pdmSecurityStore{
  secure:string = '';
  email:String = "";
  pnonce_status:Boolean = false;
  pdmSecureityVersion = 0.1;
  checker:string = "";
};
