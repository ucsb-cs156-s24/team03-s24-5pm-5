import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function PlaceholderEditPage() {

  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit page not yet implemented</h1>
      </div>
    </BasicLayout>
  )
}

// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
// import { useParams } from "react-router-dom";
// import RecommendationRequestForm from 'main/components/RecommendationRequest/RecommendationRequestForm';
// import { Navigate } from 'react-router-dom'
// import { useBackend, useBackendMutation } from "main/utils/useBackend";
// import { toast } from "react-toastify";

// export default function RecommendationRequestEditPage({storybook=false}) {
//     let { id } = useParams();

//     const { data: request, _error, _status } =
//         useBackend(
//             // Stryker disable next-line all : don't test internal caching of React Query
//             [`/api/recommendationrequest?id=${id}`],
//             {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
//                 method: "GET",
//                 url: `/api/recommendationrequest`,
//                 params: {
//                     id
//                 }
//             }
//         );

//     const objectToAxiosPutParams = (request) => ({
//         url: "/api/recommendationrequest",
//         method: "PUT",
//         params: {
//             id: request.id,
//         },
//         data: {
//             requestEmail: request.requestEmail,
//             professorEmail: request.professorEmail,
//             explanation: request.explanation,
//             dateRequested: request.dateRequested,
//             dateNeeded: request.dateNeeded,
//             done: request.done,
//         }
//     });

//     const onSuccess = (request) => {
//         toast(`RecommendationRequest Updated - id: ${request.id} requestEmail: ${request.requestEmail} professorEmail:${request.professorEmail} explanation: professorEmail:${request.explanation}`);
//     }

//     const mutation = useBackendMutation(
//         objectToAxiosPutParams,
//         { onSuccess },
//         // Stryker disable next-line all : hard to set up test for caching
//         [`/api/recommendationrequest?id=${id}`]
//     );

//     const { isSuccess } = mutation

//     const onSubmit = async (data) => {
//         mutation.mutate(data);
//     }

//     if (isSuccess && !storybook) {
//         return <Navigate to="/recommendationrequest" />
//     }

//     return (
//         <BasicLayout>
//             <div className="pt-2">
//                 <h1>Edit RecommendationRequestt</h1>
//                 {
//                     request && <RecommendationRequestForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={request} />
//                 }
//             </div>
//         </BasicLayout>
//     )

// }