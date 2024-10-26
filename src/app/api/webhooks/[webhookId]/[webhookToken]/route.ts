import axios from "axios";
import { headers } from "next/headers";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ webhookId: string, webhookToken: string }> }
) {
    const webhookId = (await params).webhookId // 'a', 'b', or 'c'
    const webhookToken = (await params).webhookToken // '123

    console.log(webhookId, webhookToken)
    
    const body = await request.json()

    if (!webhookId || !webhookToken) {
        return new Response(JSON.stringify({ error: 'Webhook ID and token are required' }), {
            status: 400,
            headers: {
                'content-type': 'application/json',
            },
        })
    }

    const discordWebhookUrl = `https://discord.com/api/webhooks/${webhookId}/${webhookToken}`
    
    const res = await axios.post(discordWebhookUrl, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    
    return new Response(JSON.stringify(res.data), {
        headers: {
            'content-type': 'application/json',
        },
    })
}