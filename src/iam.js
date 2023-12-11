import {
  ListUserPoliciesCommand,
  ListUsersCommand,
  GetUserPolicyCommand,
  IAMClient,
  GetGroupPolicyCommand,
  ListGroupsCommand,
  ListGroupPoliciesCommand,
  GetRolePolicyCommand,
  ListRolesCommand,
  ListRolePoliciesCommand,
} from "@aws-sdk/client-iam";

const client = new IAMClient({});

// GROUPS
export const getGroupPolicy = async (groupname, policyname) => {
  const policy = await client.send(new GetGroupPolicyCommand({
    GroupName: groupname, PolicyName: policyname,
  }));
  
  return JSON.parse(decodeURIComponent(policy.PolicyDocument));
}

export const listGroups = async (max, marker) => {
  const props = { MaxItems: max };

  if (marker) props.Marker = marker;

  return await client.send(new ListGroupsCommand(props));
}

export const listAllGroups = async (marker) => {
  const max = 1000;
  const groups = [];

  const response = await listGroups(max, marker);

  groups.push(...response.Groups);

  if (response.IsTruncated && response.Marker) {
    return await listAllGroups(response.Marker);
  }

  return groups;
}

export const listGroupPolicies = async (name, max, marker) => {
  const props = { MaxItems: max, GroupName: name };

  if (marker) props.Marker = marker;

  return await client.send(new ListGroupPoliciesCommand(props));
}

export const listAllGroupPolicies = async (name, marker) => {
  const max = 1000;
  const policies = [];

  const response = await listGroupPolicies(name, max, marker);

  if (response.IsTruncated && response.Marker) {
    return await listAllGroupPolicies(name, max, response.Marker);
  }

  return policies;
}
// ROLES
export const getRolePolicy = async (rolename, policyname) => {
  const policy = await client.send(new GetRolePolicyCommand({
    RoleName: rolename, PolicyName: policyname,
  }));

  return JSON.parse(decodeURIComponent(policy.PolicyDocument))
}

export const listRoles = async (max, marker) => {
  const props = { MaxItems: max };

  if (marker) props.Marker = marker;

  return await client.send(new ListRolesCommand(props));
}

export const listAllRoles = async (marker) => {
  const max = 1000;
  const roles = [];

  const response = await listRoles(max, marker);

  roles.push(...response.Roles);

  if (response.IsTruncated && response.Marker) {
    return listAllRoles(response.Marker);
  }

  // decode assumed role document
  return roles.map((role) => {
    role.AssumeRolePolicyDocument = JSON.parse(decodeURIComponent(role.AssumeRolePolicyDocument));
    return role;
  });
}

export const listRolePolicies = async (name, max, marker) => {
  const props = { RoleName: name, MaxItems: max };

  if (marker) props.Marker = marker;

  return await client.send(new ListRolePoliciesCommand(props));
}

export const listAllRolePolicies = async (name, marker) => {
  const max = 1000;
  const policies = [];

  const response = await listRolePolicies(name, max, marker);

  policies.push(...response.PolicyNames);

  if (response.IsTruncated && response.Marker) {
    return await listAllRolePolicies(name, response.Marker);
  }

  return policies;
}


// USERS
export const getUserPolicy = async (username, policyname) => {
  const policy = await client.send(new GetUserPolicyCommand({
    UserName: username, PolicyName: policyname,
  }));

  return JSON.parse(decodeURIComponent(policy.PolicyDocument));
}
 
export const listUsers = async (max, marker) => {
  const props = { MaxItems: max };

  if (marker) props.Marker = marker;

  return await client.send(new ListUsersCommand(props));
}

export const listAllUsers = async (marker) => {
  const max = 1000;
  const users = [];

  const response = await listUsers(max, marker);

  users.push(...response.Users);

  if (response.IsTruncated && response.Marker) {
    return await listAllUsers(max, response.Marker);
  }

  return users;
}

export const listUserPolicies = async (name, max, marker) => {
  const props = { MaxItems: max, UserName: name };

  if (marker) props.Marker = marker;

  return await client.send(new ListUserPoliciesCommand(props));
}

export const listAllUserPolicies = async (username, marker) => {
  const max = 1000;
  const policies = [];

  const response = await listUserPolicies(username, max, marker);

  policies.push(...response.PolicyNames);

  if (response.IsTruncated && response.Marker) {
    return await listAllUsers(username, max, response.Marker);
  }

  return policies;
}

