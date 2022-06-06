import React,{ useEffect,useState} from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import {Roll} from '../../shared/models/roll'
import { ActivityRoll } from "shared/models/activity"
import { Person, PersonHelper } from "shared/models/person"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { Images } from "assets/images"
import './activity.scss';
import {useApi} from '../../shared/hooks/use-api'
interface Context{
  globalStudents:Person[],
  setGlobalStudents:React.Dispatch<React.SetStateAction<Person[] | undefined>>,
  globalRoll:Roll[],
  setGlobalRoll:React.Dispatch<React.SetStateAction<[]>>
}
interface dataType{
  success: boolean,
  activityRoll: ActivityRoll[],
  activityPerson:Person[] | undefined
}
export const ActivityPage: React.FC = () => {
  // const {globalStudents,setGlobalStudents,globalRoll,setGlobalRoll}=useContext(globalStudent) as Context;
  const [getActivity,data,loadState] = useApi<dataType>({ url: "get-activities" })
  const [studentActivity,setStudent]=useState<Person[] | undefined>([]);
  const [rollActivity,setRoll]=useState<ActivityRoll[] | undefined>([]);
  //get the activity state for students and rolls
  useEffect(()=>{
    getActivity();
    return ()=>{};
  },[getActivity]);
  //store student data and roll data in usestate hook
  useEffect(()=>{
    setStudent(data?.activityPerson);
    setRoll(data?.activityRoll);
  },[data,loadState])
  
  const navigate=useNavigate();
  //if loading return fetch jsx
  if(!studentActivity || !rollActivity)
  {
    return(
        <h1>Fetching data...</h1>
      )
    }

    //destructure the states for mapping
  const studentsStates=[...rollActivity];
  const studentData=[...studentActivity];
 
  return (
      <S.Container>
        <S.ButtonDashboard onClick={()=>{navigate(-1)}}>Go Back</S.ButtonDashboard>
        <details className="mainDetail">
          <summary className="mainSum">Get roll info</summary>
        {studentsStates.map((item,index)=>{
          return(
            <div key={index} style={{margin:"30px",width:"100%"}}>
              <details style={{width:"100%"}} >

            <summary className="mainSum">Rolled on - {
            String(item.entity.completed_at).split('T')[0]+" "+String(item.entity.completed_at).split('T')[1].split('.')[0]
            }</summary>
            <S.StateContainer>
              <details style={{width:"100%"}}>
                <summary className="present">Present -({item.status?.present.length})</summary>
                <S.studentContainer>

                {
                  item.status.present.map((item)=>{
                    return(
                      <S.PersonContainer key={item}>

                      <S.Avatar url={Images.avatar}></S.Avatar>
                      <S.Content>
                        <div>{PersonHelper.getFullName(studentData[item-1])}</div>
                      </S.Content>
                    </S.PersonContainer>
                    )
                  })
                }
                </S.studentContainer>
              </details>
              <details style={{width:"100%"}}>
                <summary className="late">Late -({item.status?.late.length})</summary>
                <S.studentContainer>
                {
                  item.status.late.map((item)=>{
                    return(
                      <S.PersonContainer key={item}>

                      <S.Avatar url={Images.avatar}></S.Avatar>
                      <S.Content>
                        <div>{PersonHelper.getFullName(studentData[item-1])}</div>
                      </S.Content>
                    </S.PersonContainer>
                    )
                  })
                }
                </S.studentContainer>
              </details>
              <details style={{width:"100%"}}>
                <summary className="absent">Absent -({item.status?.absent.length})</summary>
                <S.studentContainer>

                {
                  item.status.absent.map((item)=>{
                    return(
                      <S.PersonContainer key={item}>

                      <S.Avatar url={Images.avatar}></S.Avatar>
                      <S.Content>
                        <div>{PersonHelper.getFullName(studentData[item-1])}</div>
                      </S.Content>
                    </S.PersonContainer>
                    )
                  })
                }
                </S.studentContainer>
              </details>
        </S.StateContainer>
        </details>

              </div>
              )}
              )}
              </details>
       
      </S.Container>
  )
}

var S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
  ButtonDashboard: styled.button`
    outline:none;
    border:none;
    background-color: #343f64;
    border-radius: 5px;
    width:80px;
    height:40px;
    color:white;
    font-weight: 700;
    transition: all 300ms ease-in-out;
    cursor: pointer;
    &:hover{
      font-size: .8rem;
    }
  `,
   PersonContainer: styled.div`
   margin-top: ${Spacing.u3};
   padding-right: ${Spacing.u2};
   display: flex;
   align-items: center;
   height: 60px;
   border-radius: ${BorderRadius.default};
   background-color: #fff;
   box-shadow: 0 2px 7px rgba(5, 66, 145, 0.13);
   transition: all 0.3s ease-in-out;

   &:hover {
     box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
     background-color: rgba(5, 66, 145, 0.26);
   }
 `,
 Avatar: styled.div<{ url: string }>`
   width: 60px;
   background-image: url(${({ url }) => url});
   border-top-left-radius: ${BorderRadius.default};
   border-bottom-left-radius: ${BorderRadius.default};
   background-size: cover;
   background-position: 50%;
   align-self: stretch;
 `,
 Content: styled.div`
   flex-grow: 1;
   padding: ${Spacing.u2};
   color: ${Colors.dark.base};
   font-weight: ${FontWeight.strong};
 `,
 StateContainer: styled.div`
   margin-top:30px;
   width:100%;
   display:flex;
   flex-direction:column;
   justify-content: center;
   align-items: center;
   min-height:100px;
 `,
 studentContainer: styled.div`
   border-radius: 5px;
   padding:5px;
   box-shadow: 0 0 5px 2px rgba(0,0,0,.5);
 `
}
