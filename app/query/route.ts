// import postgres from 'postgres';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// async function listInvoices() {
// 	const data = await sql`
//     SELECT invoices.amount, customers.name
//     FROM invoices
//     JOIN customers ON invoices.customer_id = customers.id
//     WHERE invoices.amount = 666;
//   `;

// 	return data;
// }

// export async function GET() {
//   return Response.json({
//     message:
//       'Uncomment this file and remove this line. You can delete this file when you are finished.',
//   });
//   // try {
//   // 	return Response.json(await listInvoices());
//   // } catch (error) {
//   // 	return Response.json({ error }, { status: 500 });
//   // }
// }



import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: { rejectUnauthorized: false } });

// async function listInvoices() {
//   return sql`
//     SELECT invoices.amount, customers.name
//     FROM invoices
//     JOIN customers ON invoices.customer_id = customers.id
//     WHERE invoices.amount = 666;
//   `;
// }


// async function listInvoices() {
//   return sql`
//     SELECT DISTINCT ON (invoices.customer_id, invoices.amount) 
//         invoices.amount, 
//         customers.name
//     FROM invoices
//     JOIN customers ON invoices.customer_id = customers.id
//     WHERE invoices.amount = 666
//     ORDER BY invoices.customer_id, invoices.amount, invoices.id DESC;
//   `;
// }


async function getUniqueInvoiceCount() {
  const result = await sql`
    SELECT COUNT(*) AS unique_invoices
    FROM (
      SELECT DISTINCT ON (customer_id) id
      FROM invoices
    ) AS unique_records;
  `;

  return result[0]?.unique_invoices || 0;
}

export async function GET() {
  try {
    const totalUniqueInvoices = await getUniqueInvoiceCount();
    return new Response(JSON.stringify({ totalUniqueInvoices }), { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}

// export async function GET() {
//   try {
//     const data = await listInvoices();
//     return new Response(JSON.stringify(data), { status: 200 });
//   } catch (error) {
//     console.error('Database error:', error);
//     return new Response(JSON.stringify({ error }), { status: 500 });
//   }
// }
