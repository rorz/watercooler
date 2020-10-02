import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import DailyFrame from "@daily-co/daily-js";

const Page = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DailyContainer = styled.iframe`
  width: 100vw;
  height: 100vh;
`;

const App = () => {
  const dailyRef = useRef(null);

  useEffect(() => {
    const daily = DailyFrame.wrap(dailyRef.current);
    daily.join({
      url: "https://k20-watercooler.daily.co/3CMWllZZnVZCUXqq65sL",
    });
  }, []);

  return (
    <Page>
      <DailyContainer ref={dailyRef} />
    </Page>
  );
};

export default App;
