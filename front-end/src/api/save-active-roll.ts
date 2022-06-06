import { httpMock } from "shared/helpers/http-mock"
import { get, add, LocalStorageKey,addIfNotExist } from "shared/helpers/local-storage"
import { ApiResponse } from "shared/interfaces/http.interface"
import { Roll, RollInput } from "shared/models/roll"
export async function saveActiveRoll(roll: RollInput): Promise<ApiResponse<{rolls: Roll | undefined}>> {
  try {
    const rollsInStorage = get<Roll[]>(LocalStorageKey.rolls)
    const newRollId = rollsInStorage !== undefined ? rollsInStorage[rollsInStorage.length - 1].id + 1 : 1
   //if params is passed then add the new roll to last of localstorage
    if(roll){
      const rollsToSave = rollsInStorage !== undefined ? [...rollsInStorage, createRoll(newRollId, roll)] : [createRoll(newRollId, roll)]
    add(LocalStorageKey.rolls, rollsToSave)
  }
  await httpMock({ randomFailure: true })
  //get the last index of localstorage and pass it as rolls result value
  const storageRoll=get<Roll[]>(LocalStorageKey.rolls);
  const cur: Roll | undefined=storageRoll?storageRoll[storageRoll.length-1]:undefined;
    return {
      success: true,
      rolls:cur
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      error: {},
    }
  }
}

export function getRoll():  Roll[] | undefined {
  const rolls = get<Roll[]>(LocalStorageKey.rolls);
  console.log(rolls," in get roll");
  return rolls;

}

function createRoll(id: number, input: RollInput) {
  return {
    id,
    name: `Roll ${id}`,
    student_roll_states: input.student_roll_states,
    completed_at: new Date(),
  }
}
