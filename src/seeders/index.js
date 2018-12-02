import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from "constants";

const initialSeed = async (models) => {
  const seedHostData = [
    {
      name: 'server1',
      groups: ['DEV', 'web'],
      variables: [
        {
          name: 'tenant',
          value: 'croux-lab',
          source: 'vra',
        },
        {
          name: 'var with space',
          value: 'space in var',
          source: 'vra',
        },
        {
          name: 'bg',
          value: 'bg1',
          source: 'vra',
        },
        {
          name: 'myvar1',
          value: 'some values',
          source: 'vra',
        },
      ],
    },
    {
      name: 'server2',
      groups: ['DEV', 'web'],
      variables: [
        {
          name: 'tenant',
          value: 'croux-lab',
          source: 'vra',
        },
        {
          name: 'bg',
          value: 'bg2',
          source: 'vra',
        },
        {
          name: 'myvar1',
          value: 'some other values',
          source: 'vra',
        },
      ],
    },
    {
      name: 'server3',
      groups: ['PROD', 'db'],
      variables: [
        {
          name: 'tenant',
          value: 'croux-lab',
          source: 'vra',
        },
        {
          name: 'bg',
          value: 'bg1',
          source: 'vra',
        },
        {
          name: 'myvar2',
          value: 'some values',
          source: 'vra',
        },
      ],
    },
    {
      name: 'server4',
      groups: ['DEV', 'web', 'db'],
      variables: [
        {
          name: 'tenant',
          value: 'DEMO',
          source: 'vra',
        },
        {
          name: 'bg',
          value: 'bg3',
          source: 'vra',
        },
        {
          name: 'myvar1',
          value: 'some values',
          source: 'vra',
        },
      ],
    },
    {
      name: 'server5',
      groups: ['PROD', 'web'],
      variables: [
        {
          name: 'tenant',
          value: 'croux-lab',
          source: 'vra',
        },
        {
          name: 'bg',
          value: 'bg4',
          source: 'vra',
        },
        {
          name: 'myvar1',
          value: 'some values',
          source: 'vra',
        },
      ],
    },
  ];
  await Promise.all(seedHostData.map(async (host) => {
    // Create groups if don't exist yet
    let groups = [];
    await Promise.all(host.groups.map(async (groupName) => {
      await models.Group.findOrCreate({
        where: {
          name: groupName,
        },
      }).spread((newGroup, created) => {
        groups.push(newGroup);
      });
    }));
    // Create hosts
    await models.Host.findOrCreate({
      where: {
        name: host.name,
      },
    }).spread(async (newHost, created) => {
      await newHost.setGroups(groups);
      await Promise.all(host.variables.map(async (hostvar) => {
        await models.Hostvar.findOrCreate({
          where: {
            hostId: newHost.id,
            name: hostvar.name,
            source: hostvar.source,
          },
          defaults: {
            value: hostvar.value,
          },
        });
      }));
    });
  }));
};

const createUsersWithMessages = async (models) => {
  await models.User.create(
    {
      username: 'rwieruch',
      messages: [
        {
          text: 'Published the Road to learn React',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      username: 'ddavids',
      messages: [
        {
          text: 'Happy to release ...',
        },
        {
          text: 'Published a complete ...',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};

const seeders = [
  createUsersWithMessages,
  initialSeed,
];

export default seeders;
