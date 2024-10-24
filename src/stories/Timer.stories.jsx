import Timer from "../components/Timer";


export default{
    title: "Timer",
    component: Timer,
}

export const MyTimer = () => <Timer title={"My Timer"} endTime={152} elapsedTime={13} />

