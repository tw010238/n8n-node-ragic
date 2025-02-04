import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RagicApi implements ICredentialType {
	name = 'RagicApi';
	displayName = 'Ragic API';
	// Uses the link to this tutorial as an example
	// Replace with your own docs links when building your own nodes
	documentationUrl = 'https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Server Name',
			name: 'serverName',
			type: 'string',
			default: '',
			required: true,
		}
	];
	authenticate = {
		type: 'generic',
		properties: {
			headers: {
        'Authorization': '={{"Basic " + $credentials.apiKey}}',
      },
		},
	} as IAuthenticateGeneric;
}