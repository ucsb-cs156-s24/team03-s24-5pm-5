import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import RecommenationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";
import { recommendationRequestFixtures } from 'fixtures/recommendationRequestFixtures';

export default {
    title: 'pages/RecommendationRequest/RecommenationRequestEditPage',
    component: RecommenationRequestEditPage
};

const Template = () => <RecommenationRequestEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/RecommendationRequest', (_req, res, ctx) => {
            return res(ctx.json(recommendationRequestFixtures.threeRestaurants[0]));
        }),
        rest.put('/api/RecommendationRequest', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}



