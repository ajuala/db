import pg from 'pg';
import {Client, fql} from 'fauna';


export default {
  async fetch(req, env) {
    const serverDate = new Date().toISOString();

    const pgClient = new pg.Client({connectionString: env.COCKROACH_CONN_STRING});
    await pgClient.connect();

    let res = await pgClient.query('SELECT CURRENT_TIMESTAMP AS db_date');
    const dbDate = res.rows[0].db_date;
    pgClient.end();

    let faunaClient = new Client({secret: env.FAUNA_SECRET});
    res = await faunaClient.query(fql`Time.now()`);
    let D1Time = (await env.DB.prepare('SELECT current_timestamp ctime').first()).ctime;

    const data = {
      hello: "world",
      serverDate,
      dbDate,
      faunaDate: res.data.isoString,
      D1Time,
      serverDate2: new Date().toISOString(),
    };

    const json = JSON.stringify(data, null, 2);

    return new Response(json, {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  },
};

