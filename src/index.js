import pg from 'pg';


export default {
  async fetch(req, env) {

    const pgClient = new pg.Client({connectionString: env.COCKROACH_CONN_STRING});
    await pgClient.connect();

    const res = await pgClient.query('SELECT CURRENT_TIMESTAMP AS db_date');
    const dbDate = res.rows[0].db_date;
    pgClient.end();

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

