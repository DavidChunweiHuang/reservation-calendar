import React, { useState, useEffect, useRef } from "react";
import './App.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

function App() {

  // let remainedTime
  const options = ["🟡 15:00", "🟠 16:00", "🔴 17:00", "⚫️ 19:30"]
  const [value, setValue] = useState(dayjs())
  const [availableTime, setAvailableTime] = useState([]);

  const fetchData = async (queryDate) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Basic RGx5SWtwRHJtbHd3Q3lUQ0FLNXpSbitNNDFCTzBoS050ODN4OS9yVm8vclNLRmxDOTRTYURicmdyczdUa2t5b0xyUjlrM0UzUlVFPQ==");
      myHeaders.append("Cookie", "JSESSIONID=node0baq2q3668zvejyqjpz47x2y59128.node0");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      const response = await fetch(`https://ap11.ragic.com/thesunalley/for-testing/7?PAGEID=V0C&where=${queryDate}`, requestOptions)
      const result = await response.json();

      const restockTime = Object.values(result)
        .map(item => item["進貨時段"])
        .filter(Boolean); // 過濾掉 undefined

      console.log(`進貨時間：${restockTime}`)

      const remained = options.filter(time => !restockTime.includes(time))
      setAvailableTime(remained)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    const currentDate = value.format("YYYY/MM/DD")
    const queryDate = `1000327,eq,${currentDate}`
    fetchData(queryDate)

  }, [value]); // 每次 value 被重新選擇時

  const disabledDays = (date) => {
    const dayOfWeek = date.day(); // day() 返回 0 (週日) 到 6 (週六)
    return dayOfWeek === 1 || dayOfWeek === 2;
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* <div className="parent-container"> */}
      <div className="container">
        <DateCalendar
          value={value}
          onChange={(newValue) => {
            setValue(newValue)
          }}
          shouldDisableDate={disabledDays}
        />
        {/* 動態顯示可選時段 */}
        <div className="time-container">
          <div id="time-title">當日可預約時段</div>
          {/* <div id="time-subtitle">👇👇 在下面的<b>「進貨時段」</b>欄位選擇 👇👇</div> */}
          <div className="subTime-container">
            {availableTime.length > 0 ? (
              availableTime.map((time, index) => (
                <div key={index} className="time-box">
                  {time}
                </div>
              ))
            ) : (
              <p className="no-time">該日時段已額滿</p>
            )}
          </div>

        </div>

        {/* </div> */}
        {/* <div className="iframe-container">
          <iframe
            src="https://ap11.ragic.com/thesunalley/for-testing/7?PAGEID=JGt&embed"
            sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin allow-downloads"
          // style={{ border: "none", overflowX: "hidden", overflowY: "hidden", height: "600px", width: "100%" }}
          ></iframe>
        </div> */}
      </div>


    </LocalizationProvider>
  );
}

export default App;

