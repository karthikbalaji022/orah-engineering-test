import React, { useState, useEffect, ReactElement } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
//kb edit search font icon
import { FaSearch,FaCross} from "react-icons/fa";
import { GiHamburgerMenu} from "react-icons/gi";
import { AiOutlineClose} from "react-icons/ai";
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
//import sass file
import "./index.scss";

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  //sort order state
  const [ascending,setOrder]=useState(true);
  const [firstName,setFirstName]=useState(false);
  const [lastName,setLastName]=useState(false);
//implemented debounce state for searching
  const [students,setStudents]=useState(data?.students) ;
  const [debounce,setDebounce]=useState("");
  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(()=>{
    setStudents(data?.students)
  },[data]);

  useEffect(()=>{
    if(students)
    {
      const studentSort=[...students];
      if(ascending){
          studentSort.sort((a,b)=>{
            if(firstName && lastName )
            {
              if(a.first_name===b.first_name)
              return a.last_name.localeCompare(b.last_name);

              return a.first_name.localeCompare(b.first_name);
            }else if(lastName)
            {
              return a.last_name.localeCompare(b.last_name);
            }else{
              return a.first_name.localeCompare(b.first_name);

            }
          });
        }else{
          studentSort.sort((a,b)=>{
            if(firstName && lastName )
            {
              if(a.first_name===b.first_name)
              return b.last_name.localeCompare(a.last_name);

              return b.first_name.localeCompare(a.first_name);
            }else if(lastName)
            {
              return b.last_name.localeCompare(a.last_name);
            }else{
              return b.first_name.localeCompare(a.first_name);

            }
          });
        }
      setStudents(studentSort);
    }
  },[ascending,firstName,lastName])
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
        <Toolbar onItemClick={onToolbarAction} debounceFun={setDebounce} asc={ascending} order={setOrder} fname={firstName} lname={lastName} setFname={setFirstName} setLname={setLastName}/>

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
  debounceFun: (value: React.SetStateAction<string> )=> void,
  asc: boolean,
  order: (value: React.SetStateAction<boolean> )=> void,
  fname:boolean,
  lname:boolean,
  setFname:(value: React.SetStateAction<boolean> )=> void,
  setLname:(value: React.SetStateAction<boolean> )=> void,
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick,debounceFun,asc,order,fname,lname,setFname,setLname } = props
  const [hamburger,setHam]=useState(false);
  const selected={
    backgroundColor:"#54e495",
    color:"black"
  };
  return (
    <S.ToolbarContainer>
      <div onClick={() => onItemClick("sort")} >
        <div className="nav" >          
          <div onClick={()=>setHam(prev=>!prev)} style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"10px"}}>
                {
                  hamburger==true?(<AiOutlineClose/>):(<GiHamburgerMenu/>)
                }
                <span>Sort By:</span>

          </div>
        </div>
        {hamburger===true &&(
          <div className="hamburger" style={{position:"absolute"}}>
            <S.sortTitle>Sort options: </S.sortTitle>
            <>
          <S.ToggleAsc>
            <button className="ascButton" style={asc===true ?{...selected}:{}} onClick={()=>order((prev)=>!prev)}>Ascending</button>
            <button className="dscButton" style={asc===false ?{...selected}:{}} onClick={()=>order((prev)=>!prev)} >Descending</button>
          </S.ToggleAsc>
          
          <S.ToggleAsc>

            <button className="fButton" style={fname===true ?{...selected}:{}} onClick={()=>setFname((prev)=>!prev)} >First Name</button>
            <button className="lButton" style={lname===true ?{...selected}:{}} onClick={()=>setLname((prev)=>!prev)}>Last Name</button>
            </S.ToggleAsc>
            </>
          </div>)
          }


      {/* <div onClick={() => onItemClick("sort")}>Filter</div> */}
      </div>
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
    position: relative;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
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
  `,
  ToggleAsc: styled.div`  
    display: flex;
    
  `,
  sortTitle: styled.div`
    width:100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: 900;
    border-bottom: 3px solid white;
    margin-bottom: 20px;
  `

}
