import { create } from "ipfs-http-client";
export const action = async ({request, params}: any) => {
    const auth = 'Basic ' + Buffer.from(process.env.PROJECT_ID + ':' + process.env.PROJECT_SECRET).toString('base64');
    const body = await request.json();
    const client = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        apiPath: '/api/v0',
        headers: {
            authorization: auth
        },
    });

    const added = await client.add(JSON.stringify(body));
    console.log("added", added);
    return {
        path: added.path
    }

};