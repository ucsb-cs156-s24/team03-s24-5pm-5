import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemsTable from 'main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsTable';
import { useCurrentUser , hasRole} from 'main/utils/currentUser'
import { Button } from 'react-bootstrap';;

export default function UCSBDiningCommonsMenuItemsIndexPage() {
    const currentUser = useCurrentUser();

    const { data: diningCommonsMenuItems, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/ucsbdiningcommonsmenuitems/all"],
            { method: "GET", url: "/api/ucsbdiningcommonsmenuitems/all" },
            // Stryker disable next-line all : don't test default value of empty list
            []
        );

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/diningcommonsmenuitems/create"
                    style={{ float: "right" }}
                >
                    Create Menu Item
                </Button>
            )
        }
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                {createButton()}
                <h1>Dining Commons Menu Items</h1>
                <UCSBDiningCommonsMenuItemsTable diningCommonsMenuItems={diningCommonsMenuItems} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}
