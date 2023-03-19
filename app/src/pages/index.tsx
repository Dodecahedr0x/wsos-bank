import Head from "next/head";
import { HomeView } from "../views";
import type { NextPage } from "next";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>WSoS Banks</title>
        <meta
          name="description"
          content="Banks"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
