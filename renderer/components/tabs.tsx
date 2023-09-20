import { Dispatch, SetStateAction } from "react";

interface TabList {
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
}

interface Tab {
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
  num: number;
  name: string;
}

 
export const TabList = ({ activeTab, setActiveTab }: TabList) => {
  return (
    <div className="tabs justify-center z-10 relative top-[1px]">
      <div className="tab tab-lifted cursor-default p-0"></div>
      <Tab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        num={1}
        name={"Shortener"}
      />
      <Tab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        num={2}
        name={"QR Code"}
      />
      <div className="tab tab-lifted cursor-default p-0"></div>
    </div>
  );
};

const Tab = ({ activeTab, setActiveTab, num, name }: Tab) => {
  return (
    <a
      onClick={() => setActiveTab(() => num)}
      className={`tab tab-lifted ${activeTab === num ? "tab-active" : ""}`}
    >
      {name}
    </a>
  );
};
