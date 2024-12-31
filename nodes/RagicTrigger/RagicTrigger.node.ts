import {
	INodeType,
	INodeTypeDescription,
	IHookFunctions,
  IWebhookFunctions,
  IWebhookResponseData,
} from 'n8n-workflow';

export class RagicTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ragic Trigger',
		name: 'RagicTrigger',
		icon: 'file:Ragic.svg',
		group: ['trigger'],
		version: 1,
		description: 'Webhook Trigger for Ragic',
		defaults: {
			name: 'Ragic_Trigger',
		},
		inputs: [],
		outputs: ['main'],
    credentials: [
      {
        name: 'RagicApiTrigger',
        required: true,
      },
    ],
    webhooks:[
      {
        name: 'default',            // Webhook 的名稱
        httpMethod: 'POST',         // 支援的 HTTP 方法
        responseMode: 'onReceived', // 回應模式（即時處理請求）
        path: 'default',            // Webhook 的路徑（URL 的一部分）
    },
    ],
		properties: [
      {displayName: 'Event',
        name: 'event',
        type: 'options',
        options: [
          {
            name: 'Create Records',
            value: 'create',
          },
          {
            name: 'Update Records',
            value: 'update',
          },
          {
            name: 'Create & Update Records',
            value: 'CreateUpdate',
          },
        ],
        default: 'create',
        description: 'The Event of this trigger node listen to.',
        required: true,}
    ],
	};

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    
    // 獲取請求數據
    const bodyData = this.getBodyData();
    
    return {
      workflowData: [
        this.helpers.returnJsonArray({
          bodyData,
        }),
      ],
    };
  }

	// 定義 webhookMethods
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
        const credentials = await this.getCredentials('RagicApiTrigger');
        const webhookUrl = this.getNodeWebhookUrl('default') as string;
        const apiKey = credentials?.apiKey as string;
        const sheetUrl = credentials?.sheetUrl as string;
        const sheetUrlSection = sheetUrl.split('/');
        const server = sheetUrlSection[2];
        const apName = sheetUrlSection[3];
        const path = "/"+sheetUrlSection[4];
        const sheetIndex = sheetUrlSection[5];
        const event = this.getNodeParameter("event",0) as string;
        let url = `https://${server}/sims/webhooks.jsp?n8n`;
        url += `&ap=${apName}`;
        url += `&path=${path}`;
        url += `&si=${sheetIndex}`;
        url += `&url=${webhookUrl}`;
        url += `&event=${event}`;
        const responseString = await this.helpers.request({
            method: 'GET',
            url: url,
            headers: {
              Authorization: `Basic ${apiKey}`,
            },
        });
        
        return responseString.includes(webhookUrl);
      },
			async create(this: IHookFunctions): Promise<boolean> {
        const credentials = await this.getCredentials('RagicApiTrigger');
        const webhookUrl = this.getNodeWebhookUrl('default') as string;
        const apiKey = credentials?.apiKey as string;
        const sheetUrl = credentials?.sheetUrl as string;
        const sheetUrlSection = sheetUrl.split('/');
        const server = sheetUrlSection[2];
        const apName = sheetUrlSection[3];
        const path = "/"+sheetUrlSection[4];
        const sheetIndex = sheetUrlSection[5];
        const event = this.getNodeParameter("event",0) as string;
        let url = `https://${server}/sims/webhookSubscribe.jsp?n8n`;
        url += `&ap=${apName}`;
        url += `&path=${path}`;
        url += `&si=${sheetIndex}`;
        url += `&url=${webhookUrl}`;
        url += `&event=${event}`;
        await this.helpers.request({ // 2. 發送請求到第三方 API
            method: 'GET', // 3. 請求方法
            url: url, // 4. 請求的 API URL
            headers: { // 5. HTTP 請求的header資訊
                Authorization: `Basic ${apiKey}`, // 5.1 從憑證中獲取 API Token
            },
            json: true, // 7. 指定請求和回應使用 JSON 格式
        });
        
        return true; // 8. 返回 true 表示註冊成功
      },
			async delete(this: IHookFunctions): Promise<boolean> {
        const credentials = await this.getCredentials('RagicApiTrigger');
        const webhookUrl = this.getNodeWebhookUrl('default') as string;
        const apiKey = credentials?.apiKey as string;
        const sheetUrl = credentials?.sheetUrl as string;
        const sheetUrlSection = sheetUrl.split('/');
        const server = sheetUrlSection[2];
        const apName = sheetUrlSection[3];
        const path = "/"+sheetUrlSection[4];
        const sheetIndex = sheetUrlSection[5];
        const event = this.getNodeParameter("event",0) as string;
        let url = `https://${server}/sims/webhookUnsubscribe.jsp?n8n`;
        url += `&ap=${apName}`;
        url += `&path=${path}`;
        url += `&si=${sheetIndex}`;
        url += `&url=${webhookUrl}`;
        url += `&event=${event}`;
        await this.helpers.request({ // 2. 發送請求到第三方 API
            method: 'GET', // 3. 請求方法
            url: url, // 4. 請求的 API URL
            headers: { // 5. HTTP 請求的header資訊
                Authorization: `Basic ${apiKey}`, // 5.1 從憑證中獲取 API Token
            },
            json: true, // 7. 指定請求和回應使用 JSON 格式
        });
        return true; // 8. 返回 true 表示註冊成功
      },
		},
	};
}