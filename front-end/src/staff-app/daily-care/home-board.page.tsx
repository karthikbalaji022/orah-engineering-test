import React, { useState, useEffect, ReactElement, createContext,useContext } from "react";
import {useNavigate} from 'react-router-dom'
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
import { Person,PersonHelper } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
//import sass file
import "./index.scss";
import { Roll } from "shared/models/roll"
import { globalStudent } from "staff-app/app";
interface Context{
  globalStudents:Person[],
  setGlobalStudents:React.Dispatch<React.SetStateAction<Person[] | undefined>>,
  globalRoll:Roll[],
  setGlobalRoll:React.Dispatch<React.SetStateAction<{}[]>>
}
//useContext being used for state management
export const studentContext :React.Context<{}>=createContext({});

export const HomeBoardPage: React.FC = () => {
  const {globalStudents,setGlobalStudents,globalRoll,setGlobalRoll}=useContext(globalStudent) as Context;
  const navigate=useNavigate();
  const [isRollMode, setIsRollMode] = useState(false)
  //get student api
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  // get roll api
  const [getRolls, rolldata, rollloadState] = useApi<{ rolls: Roll[] }>({ url: "save-roll" })
  //current roll type all || present || absent || late
  const [rollCurType,setRollType]=useState("all");
//storing roll states
const [student_roll_states,setRollStates]=useState([{}]);
  //sort order state
  const [ascending,setOrder]=useState(true);
  const [firstName,setFirstName]=useState(false);
  const [lastName,setLastName]=useState(false);
//implemented debounce state for searching
  const [students,setStudents]=useState(data?.students) ;
  //student iterator to take values from parent student and process data
  const [studentIterator,setIterator]=useState([] as Person[]);
  //debounce state for optimizing search
  const [debounce,setDebounce]=useState("");
  //set iterator for students data to work on
  useEffect(()=>{
    if(students && rollCurType=="all"){
      const pass=[...students]
     setIterator(pass);
    }else if(students){
      const filter=students.filter((item)=>{
        return student_roll_states[item.id-1].roll_state===rollCurType;
      })
      setIterator(filter);
    }
    return ()=>{};
  },[rollCurType,students])
  //invoke getstudents function from useApi
  useEffect(() => {
    getStudents()
    return ()=>{};
  }, [getStudents])

  //get the roll state and roll data
useEffect(()=>{
  getRolls();
},[getRolls])

  // setting the data in student state
  useEffect(()=>{
    if(data ){
    setStudents(data.students);
    //if local storage has no values stored then create a roll state record with unmark as default value
    if(data.students && rolldata?.rolls===undefined){

    const rollItems=data.students.map((item,index)=>{
      return {
        student_id:item.id,
        roll_state:"unmark"
      }
    });
    setRollStates(rollItems);
  }else if(rolldata){
    const rollStruct =rolldata.rolls;
    //to-do roll state is defined find out why the error is occuring
    const rollItems=rollStruct?.student_roll_states.map((item:any)=>{

      return {
        ...item
      }
    });
    setRollStates(rollItems);
  }
  
    }
    return ()=>{};

  },[data,rolldata]);

  //sorting the data based on the toggle states
  useEffect(()=>{
    if(studentIterator)
    {
      const studentSort=[...studentIterator];
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
          //if descending
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
      setIterator(studentSort);
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
    if (action === "exit" || action==="complete") {
      setIsRollMode(false);
      getRolls({student_roll_states:student_roll_states});
      setRollType("all");
      if(action==="complete"){
        setGlobalRoll(student_roll_states);
        setGlobalStudents(students);
      const timer= setTimeout(()=>{
        if(student_roll_states && students)
        navigate("/staff/activity",{state:{states:[...student_roll_states],students:[...students]}});
        clearTimeout(timer);
      },0);
      
    }
    }
  }
  //implemented the call from debounce to  search functionality
  const searchData= (e : React.ChangeEvent<HTMLInputElement>)=>{
    // item.first_name.toLowerCase()+" "+item.last_name.toLowerCase();
    if(data )
    {
      const searchData=data.students.filter((item)=>{
        const name= PersonHelper.getFullName(item).toLowerCase();
        return name.includes(debounce?debounce.toLowerCase():"");
      })
      setStudents(searchData);
    }
  }
  return (
    <studentContext.Provider value={{rollCurType,setRollType}}>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} debounceFun={setDebounce} asc={ascending} order={setOrder} fname={firstName} lname={lastName} setFname={setFirstName} setLname={setLastName}/>

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && (
          <>
            {studentIterator?.map((s,index) => {

              return(
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} rolls={student_roll_states} setRoll={setRollStates}/>
            )})}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>

      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} studentRoll={student_roll_states}/>
    </studentContext.Provider>
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
    // nav bar search and sort functionality
    <S.ToolbarContainer>
      <div onClick={() => onItemClick("sort")} >
          <S.SortHead onClick={()=>setHam(prev=>!prev)} >
                {
                  hamburger==true?(<AiOutlineClose/>):(<GiHamburgerMenu/>)
                }
                <span>Sort By:</span>

          </S.SortHead>
        {hamburger===true &&(
          <div className="hamburger" style={{position:"absolute"}}>
            <S.sortTitle>Sort options: </S.sortTitle>
            <>
            {/* ascending and descending sort toggle functionality */}
          <S.ToggleAsc>
            <button className="ascButton" style={asc===true ?{...selected}:{}} onClick={()=>order((prev)=>!prev)}>Ascending</button>
            <button className="dscButton" style={asc===false ?{...selected}:{}} onClick={()=>order((prev)=>!prev)} >Descending</button>
          </S.ToggleAsc>
          {/* first name and last name sort toggle function */}
          <S.ToggleAsc>
            <button className="fButton" style={fname===true ?{...selected}:{}} onClick={()=>setFname((prev)=>!prev)} >First Name</button>
            <button className="lButton" style={lname===true ?{...selected}:{}} onClick={()=>setLname((prev)=>!prev)}>Last Name</button>
            </S.ToggleAsc>
            </>
          </div>)
          }
      </div>
      {/* implemented the search function */}
      <S.Search>
        {/* search icon */}
      <FaSearch/>
      <input type="text" 
             placeholder="Search"
            onChange={(e)=>debounceFun(e.target.value)}
             style={{width:"100%",height:"20px",borderRadius:"5px",border:"none",outline:"none"}}
      />
      </S.Search>

      <S.Button onClick={() => onItemClick("roll")}><span style={{ border:"1px solid white",padding:"5px"}}>Start Roll</span></S.Button>
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
  SortHead: styled.div`
    cursor:pointer;
    display:flex;
    justify-content:center;
    align-items:center;
    gap:5px;
    transition:all 300ms ease-in-out;
    &:hover{
      color:#a6f7c1;
      font-size: 15px;
    }
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
      transition: all 300ms ease-in-out;
      &:hover{
        font-size: 14px;
      }

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
