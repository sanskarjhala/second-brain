import { Route, Routes } from "react-router-dom";
import { HomeLayout } from "./layout/HomeLayout";
import { DashboardLayout } from "./layout/DashboardLayout";
import { Notes } from "./pages/Notes";

function App() {
  return (
    <div>

      <Routes>

        <Route element={<HomeLayout/>}>
          <Route/>
          <Route/>
          <Route/>
          <Route/>
        </Route>

        <Route element={<DashboardLayout/>}>
            <Route path="/dashboard/all-notes" element={<Notes/>}/>
        </Route>  

      </Routes>
    </div>
  );
}

export default App;
