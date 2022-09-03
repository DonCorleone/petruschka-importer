import fetch from 'node-fetch';

type Monster = {
  index: string;
  name: string;
  url: string;
};

type MonsterList = {
  count?: number;
  results?: Monster[];
};

const DND_5E_API = 'https://www.dnd5eapi.co';

async function getMonster(): Promise<Monster> {
  const resp = await fetch(`${DND_5E_API}/api/monsters`);
  const list: MonsterList | unknown = await resp.json();

  const monsterList = list as MonsterList;

  if (!monsterList || !monsterList.count || !monsterList.results) {
    throw new Error('no monsters');
  }

  return monsterList.results[Math.floor(Math.random() * monsterList.count)];
}

async function getMonsterData(url: string): Promise<unknown> {
  try {
    const resp = await fetch(DND_5E_API + url);
    return resp.json();
  } catch {
    throw new Error('monster not found');
  }
}

export async function handler() {
  try {
    const randomMonster = await getMonster();
    const data = await getMonsterData(randomMonster.url);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application.json'
      },
      body: JSON.stringify({
        message: err.message
      })
    };
  }
}
