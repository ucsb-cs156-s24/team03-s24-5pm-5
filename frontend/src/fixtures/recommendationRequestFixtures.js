const recommendationRequestFixtures = {
    oneRecommendationRequest:
    [
      {
       "id": 1,
        "requesterEmail": "studentEmail1@ucsb.edu",
        "professorEmail": "profEmail1@ucsb.edu",
        "explanation": "please",
        "dateRequested": "2022-01-02T12:00:00",
        "dateNeeded": "2022-02-02T12:00:00",
        "done" : true   
      }
    ],

    threeRecommendationRequests:
    [
        {
        "id": 2,
            "requesterEmail": "studentEmail2@ucsb.edu",
            "professorEmail": "profEmail2@ucsb.edu",
            "explanation": "please",
            "dateRequested": "2022-02-02T12:00:00",
            "dateNeeded": "2022-03-02T12:00:00",
            "done" : true   
        },

        {
        "id": 3,
            "requesterEmail": "studentEmail3@ucsb.edu",
            "professorEmail": "profEmail3@ucsb.edu",
            "explanation": "please",
            "dateRequested": "2022-04-02T12:00:00",
            "dateNeeded": "2022-05-02T12:00:00",
            "done" : false   
        },

        {
        "id": 4,
            "requesterEmail": "studentEmail4@ucsb.edu",
            "professorEmail": "profEmail4@ucsb.edu",
            "explanation": "please",
            "dateRequested": "2022-05-02T12:00:00",
            "dateNeeded": "2022-06-02T12:00:00",
            "done" : true   
        },
        
    ]
};

export { recommendationRequestFixtures };
