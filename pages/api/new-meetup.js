import { MongoClient } from 'mongodb';

//  /api/new-meetup
//  POST /api/new-neetup

async function handler(req, res) {
  if (req.method === 'POST') {
    // REQUEST--------------------
    const data = req.body;
    // const { title, image, address, description } = data;

    const client = await MongoClient.connect(
      'mongodb+srv://Testing:wGgNttIL55RkP8G0@cluster0.ixose.mongodb.net/?retryWrites=true&w=majority'
    );

    // console.log('client: ' + client);
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const result = await meetupsCollection.insertOne({ data });
    console.log(result);

    client.close();

    // RESPONSE -----------------
    res.status(201).json({ message: 'Meetup inserted!' });
  }
}

export default handler;
