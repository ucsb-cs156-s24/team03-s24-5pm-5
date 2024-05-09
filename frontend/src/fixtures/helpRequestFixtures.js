const helpRequestFixtures = {
  oneHelpRequest: {
    id: 1,
    requesterEmail: "test01@gmail.com",
    teamId: "team01",
    tableOrBreakoutRoom: "table",
    explanation: "Want a room",
    solved: "true",
    requestTime: "2022-01-02t12:00:00",
  },
  threeHelpRequests: [
    {
      id: 1,
      requesterEmail: "test01@gmail.com",
      teamId: "team01",
      tableOrBreakoutRoom: "table",
      explanation: "Want a room",
      solved: "true",
      requestTime: "2022-01-02t12:00:00",
    },
    {
      id: 2,
      requesterEmail: "test02@gmail.com",
      teamId: "team02",
      tableOrBreakoutRoom: "table",
      explanation: "Want a room",
      solved: "true",
      requestTime: "2022-01-02t12:00:00",
    },
    {
      id: 3,
      requesterEmail: "test03@gmail.com",
      teamId: "team02",
      tableOrBreakoutRoom: "table",
      explanation: "Want a room",
      solved: "true",
      requestTime: "2022-01-02t12:00:00",
    },
  ],
};

export { helpRequestFixtures };
