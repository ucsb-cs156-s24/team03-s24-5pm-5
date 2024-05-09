import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationEditPage({storybook=false}) {
    let { id } = useParams();

    const { data: ucsborganization, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/UCSBOrganization?orgCode=${id}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/UCSBOrganization`,
                params: {
                    orgCode: id
                }
            }
        );

    const objectToAxiosPutParams = (ucsborganization) => ({
        url: "/api/UCSBOrganization",
        method: "PUT",
        params: {
            orgCode: ucsborganization.orgCode,
        },
        data: {
            orgCode: ucsborganization.orgCode,
            orgTranslationShort: ucsborganization.orgTranslationShort,
            orgTranslation: ucsborganization.orgTranslation,
            inactive: ucsborganization.inactive,
        }
    });

    const onSuccess = (ucsborganization) => {
        toast(`UCSB Organization Updated - orgCode: ${ucsborganization.orgCode}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/UCSBOrganization?orgCode=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/ucsborganization" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit UCSB Organization</h1>
                {
                    ucsborganization && <UCSBOrganizationForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={ucsborganization} />
                }
            </div>
        </BasicLayout>
    )
}