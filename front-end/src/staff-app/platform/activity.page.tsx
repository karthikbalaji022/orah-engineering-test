import React,{useEffect} from "react"
import { useNavigate,useLocation } from "react-router-dom"
import styled from "styled-components"
import {Roll} from '../../shared/models/roll'
import { Person, PersonHelper } from "shared/models/person"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { Images } from "assets/images"
import { Backdrop } from "@material-ui/core"
import { FaBlackberry } from "react-icons/fa"
import './activity.scss';


export const ActivityPage: React.FC = () => {
  useEffect(()=>{
    return ()=>{};
  },[]);
  const navigate=useNavigate();
  const location=useLocation();
  const studentsStates=location.state.states;
  const students=location.state.students;
  const present: Person[]=[];
  const absent: Person[]=[];
  const late: Person[]=[];
  studentsStates.forEach((element: any,index: number) => {
    if(element.roll_state==="present")
    {
      
      present.push(students[index]);
    }else if(element.roll_state==="absent")
    {
      absent.push(students[index]);
    }else if(element.roll_state==="late")
    {
      late.push(students[index]);
    }
  });
  return (
      <S.Container>
        <S.ButtonDashboard onClick={()=>{navigate(-1)}}>Go Back</S.ButtonDashboard>
        <S.StateContainer>
        <details >
          <summary className="present">Present -({present.length})</summary>
          {
            present.map((item)=>{
              return(
                <S.PersonContainer key={item.id}>

                <S.Avatar url={Images.avatar}></S.Avatar>
                <S.Content>
                  <div>{PersonHelper.getFullName(item)}</div>
                </S.Content>
              </S.PersonContainer>
              )
            })
          }
        </details>
        <details >
          <summary className="late" >Late -({late.length})</summary>
          {
            late.map((item)=>{
              return(
                <S.PersonContainer  key={item.id}>

                <S.Avatar url={Images.avatar}></S.Avatar>
                <S.Content>
                  <div>{PersonHelper.getFullName(item)}</div>
                </S.Content>
              </S.PersonContainer>
              )
            })
          }
        </details>
        <details>
          <summary className="absent" >Absent -({absent.length})</summary>
          {
            absent.map((item)=>{
              return(
                <S.PersonContainer  key={item.id}>

                <S.Avatar url={Images.avatar}></S.Avatar>
                <S.Content>
                  <div>{PersonHelper.getFullName(item)}</div>
                </S.Content>
              </S.PersonContainer>
              )
            })
          }
        </details>
        </S.StateContainer>
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
   min-height:100px;
 `
}
