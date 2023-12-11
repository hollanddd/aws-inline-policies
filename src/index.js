import {
  getGroupPolicy,
  getRolePolicy,
  getUserPolicy,
  listAllGroupPolicies,
  listAllGroups,
  listAllRolePolicies,
  listAllRoles,
  listAllUserPolicies,
  listAllUsers,
} from './iam.js';

import { writeFileSync } from 'node:fs'

const sleep = ms => new Promise(r => setTimeout(r, ms));


const getPoliciesForAllGroups = async (delay=1000) => {
  const response = [];

  const groups = await listAllGroups();

  for (const group of groups) {
    const policies = await listAllGroupPolicies(group.GroupName);

    const groupPolicies = {};

    for (const name of policies) {
      const policy = await getGroupPolicy(group.GroupName, name);
      groupPolicies[name] = policy;
      await sleep(delay);
    }

    response.push({ ...group, Policies: groupPolicies });
  }

  return response;
}

const getPoliciesForAllRoles = async (delay=1000) => {
  const response = [];

  const roles = await listAllRoles();

  for (const role of roles) {
    const policies = await listAllRolePolicies(role.RoleName)

    const rolePolicies = {};

    for (const name of policies) {
      const policy = await getRolePolicy(role.RoleName, name);
      rolePolicies[name] = policy;
      await sleep(delay);
    }

    response.push({ ...role, Policies: rolePolicies });
  }

  return response;
}

const getPoliciesForAllUsers = async (delay=1000) => {
  const response = [];

  const users = await listAllUsers();

  for (const user of users) {
    const policies = await listAllUserPolicies(user.UserName);

    const userPolicies = {} 

    for (const name of policies) {
      const userPolicy = await getUserPolicy(user.UserName, name); 
      userPolicies[name] = userPolicy;
      await sleep(delay)
    }

    response.push({ ...user, Policies: userPolicies });
    
  }

  return response;
}

const run = async () => {
  const args = process.argv.slice(2);

  switch (args[0]) {
    case '--groups':
    case '-g':
      const groups = await getPoliciesForAllGroups();
      writeFileSync('./out/groups.json', JSON.stringify(groups));
      break;

    case '--roles':
    case '-r': 
      const roles = await getPoliciesForAllRoles();
      writeFileSync('./out/roles.json', JSON.stringify(roles));

      break;
    case '--users':
    case '-u':
      const users = await getPoliciesForAllUsers();
      writeFileSync('./out/users.json', JSON.stringify(users));
      break;

    default:
      console.log('USAGE: node src/index --groups | --roles | --users');
      break;
  }
}

run();

