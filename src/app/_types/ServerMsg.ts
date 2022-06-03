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
  time:String="";
  email:String="";
  val:String="";
  type: String="";
  h="";
  sender: String="";
  sess:String = '';
  status:String = "fail";
  receiver: String="";
  authdata?:String="";
};

