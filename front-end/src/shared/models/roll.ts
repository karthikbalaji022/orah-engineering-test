export interface Roll {
  id: number
  name: string
  completed_at: Date
  student_roll_states: RollData[]
}

export interface RollInput {
  student_roll_states: RollData[]
}
export interface RollData{
  student_id: number; roll_state: RolllStateType
}
export type RolllStateType = "unmark" | "present" | "absent" | "late"
