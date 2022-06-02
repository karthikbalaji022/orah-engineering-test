import React, { useState,useContext, useEffect } from "react"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { useApi } from "shared/hooks/use-api";
import { get, add, LocalStorageKey,addIfNotExist } from "shared/helpers/local-storage"
import { Roll, RollInput } from "shared/models/roll"

interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void,
  id:number,
  rolls:React.Dispatch<React.SetStateAction<{}[]>>
}
export const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange,id ,rolls}) => {
  const [rollState, setRollState] = useState(initialState)
 
  // const contextInfo=useContext(studentList);
  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = () => {
    const next = nextState()
    setRollState(next)
    rolls((prev)=>{
      const tempRoll=[...prev];
      tempRoll[id-1]={
        ...tempRoll[id-1],
        roll_state:next
      }
      // console.log(tempRoll," tempRoll")
      return [...tempRoll]
    });
    if (onStateChange) {
      onStateChange(next)
    }
   
    // rollsInStorage?[0].student_roll_states.roll_state=rollState;
  }

  return <RollStateIcon type={rollState} size={size} onClick={onClick} />
}
