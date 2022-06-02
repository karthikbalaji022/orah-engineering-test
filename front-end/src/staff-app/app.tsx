import React,{createContext,useState} from "react"
import { Routes, Route } from "react-router-dom"
import "shared/helpers/load-icons"
import { Header } from "staff-app/components/header/header.component"
import { HomeBoardPage } from "staff-app/daily-care/home-board.page"
import { ActivityPage } from "staff-app/platform/activity.page"
export const globalStudent:React.Context<{}>=createContext({});
function App() {
const [globalStudents,setGlobalStudents]=useState<[]>();
const [globalRoll,setGlobalRoll]=useState<[]>();
  return (
    <globalStudent.Provider value={{globalStudents,setGlobalStudents,globalRoll,setGlobalRoll}}>
      <Header />
      <Routes>
        <Route path="daily-care" element={<HomeBoardPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="*" element={<div>No Match</div>} />
      </Routes>
    </globalStudent.Provider>
  )
}

export default App
