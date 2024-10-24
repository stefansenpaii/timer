import Button from "../components/Button";
import '../../style.css'
import { useEffect } from "react";
import PropTypes from "prop-types";

let amount = 1; // how many times progress bar moved by specific angle
let timerSec; // how many seconds are currently on the timer
let timerMin; // how many minutes are currently on the timer
let timerLeftSec; // how many seconds are left until the end
let timerLeftMin; // how many minutes are left until the end
let fullTime; // how much time will timer take to reach the end, in seconds
let elTime; //how much time has already passed, in seconds
let menu; //refers to a DOM element that has id="menu".
let semis; //refers to a list of DOM element that contains all elements that have a className of "semi"
let resetButton; //refers to a reset button
let startButton; //refers to a start button
let pauseButton; //refers to a pause button
let angle; // current angle of the progress circle bar
let cTime; // refers to a p element which is used to show current time on timer
let eTime; // refers to a p element which is used to show current left time on timer

function reset(minEnd, secEnd) {
    cTime.textContent = "00:00";
    eTime.textContent =`${minEnd < 10 ? '0' + minEnd : minEnd}:${secEnd < 10 ? '0' + secEnd : secEnd} left`;
    timerSec = 0;
    timerMin = 0;
    timerLeftMin = minEnd;
    timerLeftSec = secEnd;
    semis.forEach(semi => {
        semi.style.transition = "none";
        semi.style.animationName = "";
    });
    semis[0].style.transform = `rotate(0deg)`
    semis[1].style.transform = `rotate(0deg)`
    semis[2].style.opacity = '1'
    amount = 1
    pause()
    resetButton.style.pointerEvents = "none";
    resetButton.style.opacity = '0.5';
}
let loop;
function start(endTime, elapsedTime) {
    startButton.style.pointerEvents = "none";
    startButton.style.opacity = '0.5';
    pauseButton = menu.querySelector(":nth-child(2)");
    pauseButton.style.pointerEvents = "auto";
    pauseButton.style.opacity = '1';
    resetButton.style.pointerEvents = "auto";
    resetButton.style.opacity = '1';
    count(endTime, elapsedTime)
    semis.forEach(semi => {
        semi.style.transition = "0.5s linear";
    });
    loop = setInterval(function () { count(endTime, elapsedTime) }, 500);
}

function pause() {
    clearInterval(loop)
    pauseButton.style.pointerEvents = "none";
    pauseButton.style.opacity = '0.5';
    startButton.style.pointerEvents = "auto";
    startButton.style.opacity = '1';
}

function count() {
    
    angle = 360 / fullTime / 2 * amount;
    if (angle <= 180) {
        semis[0].style.transform = `rotate(${angle}deg)`;
        semis[1].style.transform = `rotate(${angle}deg)`;
    }
    else {
        semis[2].style.transition = "none";
        semis[2].style.opacity = '0';
        semis[1].style.transform = `rotate(${angle}deg)`;
    }
    if (amount % 2 == 0) {
        timerSec++;
        timerLeftSec--;
        let lTime = document.querySelector("#eTime");
        if (timerLeftSec == -1) {
            timerLeftSec = 59;
            timerLeftMin--;
        }
        lTime.textContent = `${timerLeftMin < 10 ? '0' + timerLeftMin : timerLeftMin}:${timerLeftSec < 10 ? '0' + timerLeftSec : timerLeftSec} left`;
        let crTime = document.querySelector(".currTime");
        if (timerSec == 60) {
            timerSec = 0;
            timerMin++;
        }
        crTime.textContent = `${timerMin < 10 ? '0' + timerMin : timerMin}:${timerSec < 10 ? '0' + timerSec : timerSec}`;
        if (timerLeftMin == 0 && timerLeftSec == 0) {
            clearInterval(loop);
            startButton.style.pointerEvents = "none";
            startButton.style.opacity = '0.5';
            pauseButton.style.pointerEvents = "none";
            pauseButton.style.opacity = '0.5';
            semis[0].style.animationName = "finish";
            semis[1].style.animationName = "finish";
            semis[2].style.animationName = "finish";
        }
    }
    amount++;
}

function startPosition(elapsedTime) {
    resetButton.style.pointerEvents = "auto";
    resetButton.style.opacity = '1';
    angle = 360 / fullTime * elapsedTime;
    amount = elapsedTime * 2 + 1;
    semis[0].style.transition = "none";
    semis[1].style.transition = "none";
    semis[2].style.transition = "none";
    if (angle <= 180) {
        semis[0].style.transform = `rotate(${angle}deg)`;
        semis[1].style.transform = `rotate(${angle}deg)`;

    }
    else {
        semis[0].style.transform = `rotate(180deg)`;
        semis[2].style.opacity = '0';
        semis[1].style.transform = `rotate(${angle}deg)`;
    }

}

function checkForErrors()
{
    if(fullTime>3599)
        throw "Error:\nendTime must be less than 3600 seconds (1 hour)";
    if(elTime>fullTime)
        throw "Error:\nelapsedTime cannot be higher than endTime";
    if(fullTime<0)
        throw "Error:\nendTime cannot be a negative number";
    if(elTime<0)
        throw "Error:\nelapsedTime cannot be a negative number";
    if(fullTime==0)
        throw "Error:\nendTime cannot be 0";
}


function init() {
    try {
        checkForErrors()
    } catch (error) {
        let e = document.getElementById("storybook-root");
        e.style.display = "none";
        alert(error)
        
    }
    cTime = document.querySelector(".currTime");
    eTime = document.querySelector("#eTime");
    semis = document.querySelectorAll(".semi");
    menu = document.querySelector("#menu");
    resetButton = menu.querySelector(":nth-child(3)");
    startButton = menu.querySelector(":first-child");
    pauseButton = menu.querySelector(":nth-child(2)");
    pauseButton.style.pointerEvents = "none";
    pauseButton.style.opacity = '0.5';
    resetButton.style.pointerEvents = "none";
    resetButton.style.opacity = '0.5';
    if(elTime == fullTime)
    {
        startButton.style.pointerEvents = "none";
        startButton.style.opacity = '0.5';
        semis[0].style.animationName = "finish";
        semis[1].style.animationName = "finish";
        semis[2].style.animationName = "finish";
    }
}

function Timer({ title, endTime, elapsedTime = 0 }) {
    //title - name of our timer, that is displayed above timer MM:SS
    //endTime - how much time will timer take to reach the end, in seconds
    //elapsedTime - how much time has already passed, in seconds
    timerSec = Math.floor(elapsedTime % 60);
    timerMin = Math.floor(elapsedTime / 60);
    timerLeftSec = Math.floor((endTime - elapsedTime) % 60);
    timerLeftMin = Math.floor((endTime - elapsedTime) / 60);
    fullTime = endTime;
    elTime = elapsedTime;
    useEffect(() => { init(); }, []);
    if (elapsedTime)
        useEffect(() => { startPosition(elapsedTime); }, []);
    return (
        <div className="screen">
            <div className="progress">
                <div className="semi"></div>
                <div className="semi"></div>
                <div className="semi"></div>
                <div className="clock">
                    <p className="title">{title}</p>
                    <p className="currTime">{timerMin < 10 ? '0' + timerMin : timerMin}:{timerSec < 10 ? '0' + timerSec : timerSec}</p>
                    <p className="title" id="eTime">{timerLeftMin < 10 ? '0' + timerLeftMin : timerLeftMin}:{timerLeftSec < 10 ? '0' + timerLeftSec : timerLeftSec} left</p>
                </div>
            </div>
            <div id="menu">
                <Button title="Start" onClickFunction={() => { start(endTime, elapsedTime) }} />
                <Button title="Pause" onClickFunction={() => { pause() }} />
                <Button title="Reset" onClickFunction={() => { reset(Math.floor((endTime) / 60), Math.floor((endTime) % 60)) }} />
            </div>
        </div>

    );

}

Timer.propTypes ={
    title: PropTypes.string,
    endTime: PropTypes.number,
    elapsedTime: PropTypes.number,
}


export default Timer