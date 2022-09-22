import { HttpUtils } from './HttpUtils';
const baseFeatureTogglesUri = '/config/toggledFeatures';

export class FeatureToggleUtils {
    static removeFeatureToggle(ENHANCED_ADD_EMPLOYEE_MODAL_FT: string, orgName: any, globalToken: any) {
        throw new Error("Method not implemented.");
    }
    static async addTenantToFeature(featureName: any, tenantName: any, token: any) {
        const featureRequestBody = {
            name: featureName,
            toggled: true,
            tenant: tenantName
        };
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: baseFeatureTogglesUri,
            body: featureRequestBody,
            authorization: token
        });
    }

    static async removeTenantFromFeature(featureToggleName: string, tenant: any, token: any) {
        let featureToggle: any;
        try {
            featureToggle = await FeatureToggleUtils.getFeature(featureToggleName, token);
        } catch (error) {
            console.log('Get feature toggle failure ', error);
            return error;
        }
        const featureInitiallyOn = featureToggle.toggled;
        if (featureInitiallyOn) {
            const initiallyOnTenants = featureToggle.onTenants.split(' ');
            const initiallyOffTenants = featureToggle.offTenants.split(' ');
            if (initiallyOnTenants && ((initiallyOnTenants && initiallyOnTenants.includes('*') && !initiallyOffTenants.includes(tenant)) || initiallyOnTenants.includes(tenant))) {
                try {
                    const result: any = await FeatureToggleUtils.removeTenantFromFeatureRequest(featureToggleName, tenant, token);
                    return result;
                } catch {
                    console.log(`error while trying to remove tenant from feature toggle: ${featureToggleName}`);
                }
            } else {
                console.log(`feature toggle ${featureToggleName} is not enabled for tenant and cannot be edited`);
            }
        } else {
            console.log(`feature toggle ${featureToggleName} is not enabled or not found and cannot be edited`);
        }
    }

    static async removeTenantFromFeatureRequest(featureName: string, tenantName: string, token: any) {
        const featureRequestBody = {
            name: featureName,
            toggled: false,
            tenant: tenantName
        };
        try {
            return await HttpUtils.sendRequest({
                action: 'POST',
                uri: baseFeatureTogglesUri,
                body: featureRequestBody,
                authorization: token
            });
        } catch (error) {
            console.log('Remove feature toggle failure: ', error);
            return new Error(error);
        }
    }

    static async getFeature(featureName: string, token: any) {
        try {
            return await HttpUtils.sendRequest({
                action: 'GET',
                uri: baseFeatureTogglesUri + '/featureStatus',
                queryStringParams: {
                    featureName: featureName
                },
                authorization: token
            });
        } catch (error) {
            console.log('Get feature toggle failure: ', error);
            return new Error(error);
        }
    }

    static async isFeatureToggleTurnedOnForTenant(featureToggleName: string, tenant: string, token: any) {
        let featureToggle: any;
        try {
            featureToggle = await FeatureToggleUtils.getFeature(featureToggleName, token);
        } catch (error) {
            console.log('Get feature toggle failure ', error);
            return error;
        }

        if (featureToggle) {
                return FeatureToggleUtils.validateFeatureToggleResponse(featureToggle, tenant);
        } else {
            return false;
        }
    }

    static validateFeatureToggleResponse(result: { toggled: any; onTenants: string; offTenants: string; }, tenant: string) {
        const featureInitiallyOn = result.toggled;
        const initiallyOnTenants = result.onTenants.split(' ');
        const initiallyOffTenants = result.offTenants.split(' ');
        if (!initiallyOnTenants || initiallyOnTenants.length === 0 || !initiallyOffTenants || initiallyOffTenants.length === 0) {
            return false;
        } else if (featureInitiallyOn && ((initiallyOnTenants.includes('*') && !initiallyOffTenants.includes(tenant)) || initiallyOnTenants.includes(tenant))) {
            return true;
        } else {
            return false;
        }
    }

    static turnOnFeatureToggleForTenant = async (featureToggleName, tenant, token) => {
        // 'use strict';
    
        // let featureToggle = await moduleExports.getFeature(featureToggleName, token);
        // let featureInitiallyOn = featureToggle.toggled;
        // let initiallyOnTenants = featureToggle.onTenants.split(' ');
        // let initiallyOffTenants = featureToggle.offTenants.split(' ');
        // //We can't turn on features via the API.  So it needs to be on already
        // if (featureInitiallyOn) {
        //     if (initiallyOnTenants && ((initiallyOnTenants.includes('*') && !initiallyOffTenants.includes(tenant)) || initiallyOnTenants.includes(tenant))) {
        //         Promise.resolve();
        //     } else {
        //         let result = await moduleExports.addTenantToFeature(featureToggleName, tenant, token);
        //         if (result.success) {
        //             Promise.resolve();
        //         } else {
        //             Promise.reject(`error while trying to add tenant from feature toggle: ${featureToggleName}`);
        //         }
        //     }
        // } else {
        //     Promise.reject(`feature toggle ${featureToggleName} is not enabled and cannot be edited`);
        // }
    };
}