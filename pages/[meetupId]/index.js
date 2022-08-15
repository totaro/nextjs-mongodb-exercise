// import { Fragment } from "react";
import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient, ObjectId } from 'mongodb';
import MeetupDetail from '../../components/meetups/MeetupDetail';

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupdata.title}</title>
        <meta name='description' content={props.meetupdata.description} />
      </Head>
      <MeetupDetail
        image={props.meetupdata.image}
        title={props.meetupdata.title}
        address={props.meetupdata.address}
        description={props.meetupdata.description}
        // image='https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg'
        // title='A First Meetup'
        // address='Some address 5, 12345 Munich'
        // description='The meetup description'
      />
    </Fragment>
    // <Fragment>
    //   <img
    //     src="https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg"
    //     alt="A First Meetup"
    //   />
    //   <h1>A First Meetup</h1>
    //   <address>Some address 5, 12345 Munich</address>
    //   <p>The meetup description</p>
    // </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    'mongodb+srv://Testing:wGgNttIL55RkP8G0@cluster0.ixose.mongodb.net/?retryWrites=true&w=majority'
  );

  // console.log('client: ' + client);
  const db = client.db();
  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    // fallback: false,
    fallback: 'blocking',

    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),

    // [
    //   {
    //     params: {
    //       meetupId: 'm1',
    //     },
    //   },

    //   {
    //     params: {
    //       meetupId: 'm2',
    //     },
    //   },
    // ],
  };
}

export async function getStaticProps(context) {
  // fetch data for a single meetup
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    'mongodb+srv://Testing:wGgNttIL55RkP8G0@cluster0.ixose.mongodb.net/?retryWrites=true&w=majority'
  );

  const db = client.db();
  const meetupsCollection = db.collection('meetups');

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });
  // const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  console.log(meetupId);
  return {
    props: {
      meetupdata: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.data.title,
        address: selectedMeetup.data.address,
        image: selectedMeetup.data.image,
        description: selectedMeetup.data.description,
      },
      // meetupData: {
      //   image:
      //     'https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg',
      //   id: meetupId,
      //   title: 'A First Meetup',
      //   address: 'Some address 5, 12345 Munich',
      //   description: 'The meetup description',
      // },
    },
    revalidate: 10, //re pre-generated page on server every 10 seconds
  };
}

export default MeetupDetails;
