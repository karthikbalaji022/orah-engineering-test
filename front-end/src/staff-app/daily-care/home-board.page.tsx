import React, { useState, useEffect, ReactElement } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
//kb edit search font icon
import { FaSearch } from "react-icons/fa";
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
//implemented debounce state for searching
  const [students,setStudents]=useState(data?.students) ;
  const [debounce,setDebounce]=useState("");
  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(()=>{
    setStudents(data?.students)
  },[data]);

  // debounce functionality
  useEffect(()=>{
    const time=setTimeout(searchData,500);
    return ()=>clearTimeout(time);
  },[debounce])
  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }
  //implemented the call from debounce to  search functionality
  const searchData= (e : React.ChangeEvent<HTMLInputElement>)=>{
    if(data )
    {
      const searchData=data.students.filter((item)=>{
        const name=item.first_name.toLowerCase()+" "+item.last_name.toLowerCase();
        return name.includes(debounce?debounce.toLowerCase():"");
      })
      setStudents(searchData);
    }
  }
  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} debounceFun={setDebounce}/>

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && (
          <>
            {students?.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void,
  debounceFun: (value: React.SetStateAction<string> )=> void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick,debounceFun } = props
  return (
    <S.ToolbarContainer>
      <div onClick={() => onItemClick("sort")}>First Name</div>
      <S.Search>
      <FaSearch/>
      <input type="text" 
             placeholder="Search"
            onChange={(e)=>debounceFun(e.target.value)}
             style={{width:"100%",height:"20px",borderRadius:"5px",border:"none",outline:"none"}}
      />
      </S.Search>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}


const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: grid;
    justify-content: space-evenly;
    align-items: center;
    grid-template-columns: 1fr 3fr 1fr;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
  Search: styled.div`
  display: flex;
  gap:5px;
  height:100%;
  width:100%;
  justify-content: center;
  align-items: center;
  padding:10px;
  `
}
