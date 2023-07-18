import { Worker } from 'cloud-router-ts';
import app from './app';

export interface Env {}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const worker = new Worker(request, app);
		return worker.listen();
	},
};
