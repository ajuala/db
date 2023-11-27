import pg from 'pg';


export default {
  async fetch(req, env) {

    const pgClient = new pg.Client({connectionString: env.COCKROACH_CONN_STRING});
    await pgClient.connect();

    const res = await pgClient.queru('SELECT CURRENT_TIMESTAMP AS db_date');
    const dbDate = res.row[0].db_date;

    const data = {
      hello: "world",
      dbDate,
      serverDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);

    return new Response(json, {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  },
};

