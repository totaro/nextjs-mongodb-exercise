// import Layout from "../components/layout/Layout";
// import { useEffect, useState } from "react";
import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient } from 'mongodb';
import MeetupList from '../components/meetups/MeetupList';
// our-domain.com/

const DUMMY_MEETUPS = [
  {
    id: 'm1',
    title: 'The first Meetup',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg',
    address: ' Some address 5, 12345 Munich',
    description: 'This is a first meetup',
  },
  {
    id: 'm2',
    title: 'The second Meetup',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg',
    address: ' Some address 6, 54321 Munich',
    description: 'This is a second meetup',
  },
];

function HomePage(props) {
  //   return <h1>The Home Page</h1>;

  // no need because of getStaticProps
  // ************************
  // const [loadedMeetups, setLoadedMeetups] = useState([]);
  // useEffect(() => {
  //   // send a http request and fetch data
  //   setLoadedMeetups(DUMMY_MEETUPS);
  // }, []);

  return (
    // <MeetupList meetups={DUMMY_MEETUPS} />
    // <MeetupList meetups={loadedMeetups} />
    <Fragment>
      <Head>
        <title>React Meetups!</title>
        <meta
          name='description'
          content='Browse a huge list of highly active React meetups!'
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   // fetch data from API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     }
//   };
// }

export async function getStaticProps() {
  // fetch data from API
  // fetch('/api/meetups');
  const client = await MongoClient.connect(
    'mongodb+srv://Testing:wGgNttIL55RkP8G0@cluster0.ixose.mongodb.net/?retryWrites=true&w=majority'
  );

  const db = client.db();
  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      // meetups: DUMMY_MEETUPS,
      meetups: meetups,
      meetups: meetups.map((meetup) => ({
        title: meetup.data.title,
        address: meetup.data.address,
        image: meetup.data.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10, //re pre-generated page on server every 10 seconds
  };
}

export default HomePage;
