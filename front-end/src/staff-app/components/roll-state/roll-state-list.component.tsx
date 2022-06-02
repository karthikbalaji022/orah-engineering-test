import React,{useContext} from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { Spacing, FontWeight } from "shared/styles/styles"
import { RolllStateType } from "shared/models/roll"
import {studentContext} from '../../daily-care/home-board.page'

interface Props {
  stateList: StateList[]
  onItemClick?: (type: ItemType) => void
  size?: number
}
interface Context{
  rollCurType:string,
  setRollType:(item?:string)=>void
}
export const RollStateList: React.FC<Props> = ({ stateList, size = 14, onItemClick }) => {
  const {rollCurType,setRollType}=useContext(studentContext) as Context;
  const onClick = (type: ItemType) => {
    setRollType(type);
    if (onItemClick) {
      onItemClick(type)
    }
  }

  return (
    <S.ListContainer>
      {stateList.map((s, i) => {
        if (s.type === "all") {
          return (
            <S.ListItem key={i}>
              <div style={rollCurType==s.type?{display:"flex",width:"fit-content",border:"2px solid white",padding:"3px"}:{display:"flex",width:"fit-content"}} >
              <FontAwesomeIcon icon="users" size="sm" style={{ cursor: "pointer" }} onClick={() => onClick(s.type)} />
              <span>{s.count}</span>
              </div>
            </S.ListItem>
          )
        }

        return (
          <S.ListItem key={i}>
            <div style={rollCurType==s.type?{display:"flex",width:"fit-content",border:"2px solid white",padding:"3px"}:{display:"flex",width:"fit-content"}}>
            <RollStateIcon type={s.type} size={size}  onClick={() => onClick(s.type)} />
            <span>{s.count}</span>
            </div>
          </S.ListItem>
        )
      })}
    </S.ListContainer>
  )
}

const S = {
  ListContainer: styled.div`
    display: flex;
    align-items: center;
  `,
  ListItem: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u2};

    span {
      font-weight: ${FontWeight.strong};
      margin-left: ${Spacing.u2};
    }
  `,
  Highlight: styled.div`
    border-radius:100%;
    box-shadow: 0 0 5px 2px #fc0202;
  `
}

interface StateList {
  type: ItemType
  count: number
}

type ItemType = RolllStateType | "all"
