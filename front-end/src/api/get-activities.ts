import { httpMock } from "shared/helpers/http-mock"
import { get, LocalStorageKey } from "shared/helpers/local-storage"
import { ApiResponse } from "shared/interfaces/http.interface"
import { ActivityRoll,ActivityPerson, status } from "shared/models/activity"
import { Roll, RollInput } from "shared/models/roll"
import { Person } from "shared/models/person"

export async function getActivities(): Promise<ApiResponse<{ activityRoll: ActivityRoll[],activityPerson:Person[] | undefined}>> {
  try {
    const rolls = get<Roll[]>(LocalStorageKey.rolls) || []
    const students=get<Person[]>(LocalStorageKey.students)

    await httpMock({ randomFailure: true })
    return {
      success: true,
      activityRoll: buildActivities(rolls),
      activityPerson:students || undefined
    }
  } catch (error) {
    return {
      success: false,
      error: {},
    }
  }
}

function buildActivities(inputs: Roll[]): ActivityRoll[] {
  return inputs.map((item) => ({
    type: "roll",
    entity: item,
    date: item.completed_at,
    status:getStatus(item)
  }))
}
function getStatus(input: Roll): status{
  var present:number[]=[],absent:number[]=[],late:number[]=[];
  input.student_roll_states.forEach((item)=>{
    if(item.roll_state=="present")
    {
      present.push(item.student_id);
    }else if(item.roll_state=="absent")
    {
      absent.push(item.student_id);
    }else if(item.roll_state=="late")
    {
      late.push(item.student_id);
    }
  })
  return {
    present:present,
    late:late,
    absent:absent
  }
}
// function buildPerson(input:Person[]):ActivityPerson[]{
// return input.map((item)=>{
// return {
//   type:"student",
//   entity:item
// }
// })
// }