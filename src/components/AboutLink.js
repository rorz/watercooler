import React, { useEffect, useState } from "react";
import styled from "styled-components";

import gitHubLogo from "../assets/images/github-logo.png";

const LinkContainer = styled.div`
  position: fixed;
  width: 100%;
  bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LinkText = styled.a`
  color: ${({ darkMode }) => (darkMode ? "black" : "white")};
  font-size: ${({ darkMode }) => (darkMode ? 1.1 : 1.4)}rem;
  font-weight: 800;
  font-style: italic;
  text-decoration: ${({ darkMode }) =>
      darkMode ? "rgba(0,0,0,0.2)" : "rgba(255, 255, 255, 0.2)"}
    solid underline;
  cursor: pointer;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  background: #fefefe;
  z-index: 1337;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalInner = styled.div`
  max-width: 400px;
  padding: 6rem 2rem 0;
  height: calc(100% - 4rem);
  overflow-y: scroll;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
`;

const Divider = styled.hr`
  width: 20%;
  border: 1px solid #ddd;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 1rem;
  background: #444;
  border-radius: 10rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 2rem;
    font-weight: bold;
    color: white;
  }

  cursor: pointer;
`;

const GitHubButton = styled.div`
  background: #111;
  color: white;
  padding: 0.4rem 0.8rem 0.4rem 0.6rem;
  border-radius: 10rem;
  color: width;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    margin-right: 0.6rem;
    width: 1rem;
    height: 1rem;
    object-fit: contain;
  }
  cursor: pointer;
`;

const AboutLink = ({ darkMode = false }) => {
  const [open, setOpen] = useState(false);

  return open ? (
    <ModalBackground>
      <ModalInner>
        <h1>What is this?</h1>
        <p>
          After joining the King's20 Accelerator in September 2020, I was really
          interested to see how ~60 people would meet each other for the fist
          time, and interact, in a purely online environment.
        </p>
        <p>
          One of the things that I miss from meeting new co-workers and peers in
          a physical space is the{" "}
          <a
            href="https://www.inverse.com/innovation/how-companies-have-optimized-the-humble-office-water-cooler"
            target="_blank"
          >
            "watercooler effect".
          </a>{" "}
          Spontaneous interaction with people you (initially don't know very
          well) is really great at spawning new ideas and collaboration
          opportunities. It can also be a great outlet for just having a chat.
        </p>
        <p>
          I wanted to see if I could throw together a digital version of this
          concept in a weekend or two. The result is this website, for fellow
          K20 members to come and spend a few minutes chatting to others in the
          cohort (if and when they feel like it). The video is powered by{" "}
          <a href="https://daily.co/" target="_blank">
            Daily.co
          </a>
          , and if someone visits this website and nobody else is here, our MS
          Teams chat gets a ping to nudge anyone else that fancies saying hello.
        </p>
        <p>Thanks for stopping by!</p>
        <p>
          <i>Rory from Verdn</i>
        </p>
        <Divider />
        <p>
          P.S. This is very much a work in progress. It might break or behave in
          unexpected ways. Send me a message if something doesn't work right, or
          you have ideas on how to improve this!
        </p>
        <p>
          P.P.S. If you're interested in reading the code for the watercooler, I
          have made it open source:
        </p>
        <GitHubButton onClick={() => window.open("https://github.com/rorz")}>
          <img src={gitHubLogo} />
          View on GitHub
        </GitHubButton>
      </ModalInner>
      <CloseButton onClick={() => setOpen(false)}>
        <span>X</span>
      </CloseButton>
    </ModalBackground>
  ) : (
    <LinkContainer>
      <LinkText darkMode={darkMode} onClick={() => setOpen(true)}>
        What is this? 🤔
      </LinkText>
    </LinkContainer>
  );
};

export default AboutLink;
