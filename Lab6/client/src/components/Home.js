import { Link } from "react-router-dom";

export default function Home() {
  console.log("in HOme");
  return (
    <div>
      <h1 className="Home">About our website</h1>
      <br></br>
      <p className="about">
        This is website which has data about all the marvel characters and lets
        you select you favourite characters. It utilizes marvel API to display
        all the data.
      </p>
    </div>
  );
}
