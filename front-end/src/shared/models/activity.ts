import { Roll,RollInput } from "shared/models/roll"
import { Person } from "./person"

export interface ActivityRoll {
  type: "roll"
  date: Date
  entity: Roll 
  status:status
}
export interface status{
  present:number[]
 absent:number[]
 late:number[]
}
export interface ActivityPerson{
  type:"student",
  entity:Person
}