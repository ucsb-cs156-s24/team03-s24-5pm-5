import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestCreatePage({storybook=false}) {

  const objectToAxiosParams = (request) => ({
    url: "/api/RecommendationRequest/post",
    method: "POST",
    params: {
     requesterEmail: request.requesterEmail,
     professorEmail: request.professorEmail,
     explanation: request.explanation,
     dateRequested: request.dateRequested,
     dateNeeded: request.dateNeeded,
     done: request.done
    }
  });

  const onSuccess = (request) => {
    toast(`New RecommendationRequest Created - id: ${request.id} requestEmail: ${request.requesterEmail} professorEmail:${request.professorEmail} explanation: professorEmail:${request.explanation}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/RecommendationRequest/all"] // mutation makes this key stale so that pages relying on it reload
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/RecommendationRequest" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New RecommendationRequest</h1>
        <RecommendationRequestForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
