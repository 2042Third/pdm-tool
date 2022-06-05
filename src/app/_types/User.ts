export class User {
  type: string;
  sender: string;
  receiver: string;
  v1:string;
  v2:string;
  v3:string;
  v4:string;
  authdata?:string;
}

export class NotesMsg{
  content: String;
  email:String;
  note_id:String;
  session:String;
  ntype:String; // 0 update, 1 new, 2 heads, 3 retrieve
  sess:String;
  h:String;
  username:String;
  status:String;

}

export class NoteHead{
  head:String;
  note_id:String;
  id:number;
}
