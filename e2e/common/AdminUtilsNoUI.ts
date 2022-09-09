import { HttpUtils } from './HttpUtils';

export class AdminUtilsNoUI {

    static async createGroup(groupName, token) {
        try {
            const response: any = await HttpUtils.sendRequest({
                action: 'POST',
                uri: '/group',
                body: {
                    'id': '',
                    'name': groupName
                },
                authorization: token,
                timeout: 30000
            });
            console.log('Created Group Successfully');
            return response;
        } catch (error) {
            return error;
        }
    };

    static async createTeam(teamName, description, leadUserId, token) {
        try {
            const response: any = await HttpUtils.sendRequest({
                action: 'POST',
                uri: '/user-management/v1/teams',
                body: {
                    name: teamName,
                    description: description,
                    leadUserId: leadUserId,
                    status: 'ACTIVE'
                },
                authorization: token,
                timeout: 30000
            });
            console.log('Team ' + teamName + ' created');
            return response;
        } catch (error) {
            return error;
        }
    }

    static async deleteGroups(groupIds, token) {
        try {
            const response: any = await HttpUtils.sendRequest({
                action: 'POST',
                uri: '/group/delete',
                authorization: token,
                body: {
                    groupToDeleteIds: groupIds
                },
                timeout: 30000
            });
            console.log('Deleted Groups Successfully');
            return response;
        } catch (error) {
            return error;
        }
    };

    static async getAllTeams(token, teamsData?: any) {
        try {
            const response: any = await HttpUtils.sendRequest({
                action: 'POST',
                uri: '/user-management/v1/teams/search',
                body: teamsData ? teamsData : {},
                authorization: token,
                timeout: 30000
            });
            console.log('Got All Team Successfully');
            return response;
        } catch (error) {
            return error;
        }
    };



    static async assignUsersToTeam(teamId, usersList, token) {
        try {
            const response: any = await HttpUtils.sendRequest({
                action: 'PATCH',
                uri: '/user/v1/team/' + teamId,
                body: usersList,
                authorization: token,
                timeout: 30000
            });
            console.log('Users added to Team Successfully');
            return response;
        } catch (error) {
            return error;
        }
    }

}
