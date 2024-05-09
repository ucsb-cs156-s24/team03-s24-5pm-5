import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function PlaceholderIndexPage() {

  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Index page not yet implemented</h1>
        <p><a href="/placeholder/create">Create</a></p>
        <p><a href="/placeholder/edit/1">Edit</a></p>
      </div>
    </BasicLayout>
  )
}
// import React from 'react'
// import { useBackend } from 'main/utils/useBackend';

// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
// import RecommendationRequestForm from 'main/components/RecommendationRequest/RecommendationRequestTable';
// import { useCurrentUser , hasRole} from 'main/utils/currentUser'
// import { Button } from 'react-bootstrap';

// export default function RecommendationRequestIndexPage() {

//     const currentUser = useCurrentUser();

//     const { data: requests, error: _error, status: _status } =
//         useBackend(
//             // Stryker disable next-line all : don't test internal caching of React Query
//             ["/api/recommendationrequest/all"],
//             { method: "GET", url: "/api/recommendationrequest/all" },
//             // Stryker disable next-line all : don't test default value of empty list
//             []
//         );

//     const createButton = () => {
//         if (hasRole(currentUser, "ROLE_ADMIN")) {
//             return (
//                 <Button
//                     variant="primary"
//                     href="/recommendationrequest/create"
//                     style={{ float: "right" }}
//                 >
//                     Create RecommendationRequest
//                 </Button>
//             )
//         } 
//     }

//     return (
//         <BasicLayout>
//             <div className="pt-2">
//                 {createButton()}
//                 <h1>RecommendationRequest</h1>
//                 <RecommendationRequestForm requests={requests} currentUser={currentUser} />
//             </div>
//         </BasicLayout>
//     );
// }