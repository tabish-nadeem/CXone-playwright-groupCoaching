import { HttpUtils } from './HttpUtils';

export class AdminUtilsNoUI {

    public getToken(token) {
        if (!token) {
            return window.localStorage.getItem('wfo_saas.userToken');
        } else {
            return token;
        }
    };
    

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

    static async createSkill (skillName: any, token: any) {
        try {
            const response: any = await HttpUtils.sendRequest({
                action: 'POST',
                uri: '/wfo/user/skills',
                body: {
                    'id': '',
                    'name': skillName
                },
                authorization: token,
                timeout: 60000
            });
            console.log('Skills added Successfully');
            return response;
        } catch (error) {
            return error;
        }
    };

    static async getAllSkills (token: any) {
        try {
            const response: any = await HttpUtils.sendRequest({
                action: 'GET',
                uri: '/wfo/user/skills',
                authorization: token,
                timeout: 30000
            });
            console.log('Got all skills Successfully');
            return response;
        } catch (error) {
            return error;
        }
    };

}
