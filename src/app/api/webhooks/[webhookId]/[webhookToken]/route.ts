import axios from "axios";
import { headers } from "next/headers";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ webhookId: string, webhookToken: string }> }
) {
    const webhookId = (await params).webhookId // 'a', 'b', or 'c'
    const webhookToken = (await params).webhookToken // '123

    // console.log(webhookId, webhookToken)
    
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
    
    try {
      const res = await axios.post(discordWebhookUrl, body, {
          headers: {
              'Content-Type': 'application/json',
          },
      });

      const responseHeaders = new Headers();
      for (const [key, value] of Object.entries(res.headers)) {
          responseHeaders.set(key, value as string);
      }

      // Return without body for 204 status
      if (res.status === 204) {
          return new Response(null, {
              status: res.status,
              headers: responseHeaders,
          });
      }

      // Return with body for other statuses
      return new Response(JSON.stringify(res.data), {
          status: res.status,
          headers: responseHeaders,
      });

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const responseHeaders = new Headers();
      for (const [key, value] of Object.entries(error.response.headers)) {
        responseHeaders.set(key, value as string);
      }

      // Handle 429 and other error statuses with full headers
      return new Response(null, {
        status: 204,
        headers: responseHeaders,
      });
    } else {
        console.error('Unexpected error posting to Discord:', error);
        return new Response(JSON.stringify({ error: 'Failed to post to Discord webhook' }), {
          status: 500,
          headers: {
            'content-type': 'application/json',
          },
      });
    }
  } 
}