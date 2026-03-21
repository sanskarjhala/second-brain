import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SideBarItems } from "./SideBarItems";

export const SideBar = () => {
  return (
    <div className="mt-4 p-8 h-screen bg-white border-r  fixed left-0 top-0">


      <section className="pt-4">
        <SideBarItems title="Youtube" icon={<YoutubeIcon/>}/>
        <SideBarItems title="Twitter" icon={<TwitterIcon/>}/>
        <SideBarItems title="Twitter" icon={<TwitterIcon/>}/>
        <SideBarItems title="Twitter" icon={<TwitterIcon/>}/>
        <SideBarItems title="Twitter" icon={<TwitterIcon/>}/>
        <SideBarItems title="Twitter" icon={<TwitterIcon/>}/>
        <SideBarItems title="Twitter" icon={<TwitterIcon/>}/>
      </section>
    </div>
  );
};
