import { NavLink } from "react-router-dom"

const Header = () => {
    return(
        <header className="header">
          <div className="aa">
        <img src="https://img.freepik.com/premium-vector/gym-center-logo-logo-design-gym-center_1152818-25.jpg" alt="logo"></img>
        <h3>GYM <br></br>Management System</h3>
        </div>
        <div className="gymp">
        <img src="https://png.pngtree.com/thumb_back/fh260/background/20240329/pngtree-rows-of-dumbbells-in-the-gym-image_15662386.jpg"></img>
        </div>
        <div className="links">
          <NavLink to={"/"}>Home<br></br></NavLink>
          <NavLink to={"/attendance"}>Attendance<br></br></NavLink>
          <NavLink to={"/about"}>About<br></br></NavLink>  
          <NavLink to={"/login"}>Login</NavLink>
          <NavLink to={"/gymForm"}>gymform</NavLink>
        </div>
      </header>
      
    );
}
export default Header;