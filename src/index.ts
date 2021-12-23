import { fastify, FastifyRequest } from 'fastify';
import pino from 'pino';
import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FastifyReply } from 'fastify/types/reply';

const PORT = process.env.PORT || 11923;

const server = fastify({
  logger: pino({ level: 'info' })
});

let RESPONSE = '';

const cleanMultipleLines = (str: string) => str.split('\n').map((line: string) => line.trim()).filter((line) => !!line)

async function readURLList(): Promise<string[]> {
  const filepath = path.join(__dirname, 'assets/data/url-list.txt')
  const rawContent = await fs.readFile(filepath);
  return cleanMultipleLines(rawContent.toString());
}

async function updateHandler(request: FastifyRequest, reply: FastifyReply) {
  const lines = await readURLList();

  const allLists = await Promise.all(lines.map(async (url) => {
    const resp = await axios.get(url);
    return cleanMultipleLines(resp.data).join("\r\n");
  }));

  RESPONSE = allLists.join('\r\n');
  return RESPONSE;
}

async function indexHandler(request: FastifyRequest, reply: FastifyReply) {
  if (!RESPONSE) {
    return await updateHandler(request, reply);
  }

  return RESPONSE;
}

server.get('/', indexHandler);
server.post('/update', updateHandler);

const start = async () => {
  try {
    await server.listen(PORT, '0.0.0.0');
    console.log('Server started successfully');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
