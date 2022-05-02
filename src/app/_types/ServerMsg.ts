export class ServerMsg {
  type: string;
  sender: string;
  receiver: string;
  v1:string;
  v2:string;
  v3:string;
  v4:string;
  authdata?:string;
};
export class NamedServerMsg extends ServerMsg {

  msg:string;
  msgh:string;
  time:string;
  val:string;
};

export class NamedServerMsgA {
  msg:string;
  msgh:string;
  time:string;
  val:string;
  type: string;
  sender: string;
  receiver: string;
  authdata?:string;
};

